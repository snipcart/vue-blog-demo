# Vue.js content management & blog

### SEO

meta title:
page title:
URL:
meta description:

intents spotted?
- learn how to build a vue blog
- access detailed examples of vue projects

KW targets

- vue.js blog
- vue.js demo

LSI/related

*see gsheet KW research

Add inlinks from relevant posts:

- Suggested posts:
-

*see gsheet for on-page optimization

### Outreach & promotion

Influencers / communities / resources used

link building

quora

*see gsheet outreach

chat / forums


### Twitter

@?
#VueJS #frontend #webdev

***

### Draft

Intro / hook / story

Include KW 1st 100 words

Statements to agree with

Preview & promise for upcoming content

Internal links high

Media early to keep scroll / attention

The JAMstack is the product of frontend development's rapid evolution over recent years, notably in the JavaScript community. For those new to the concept it consists of JavaScript, APIs and Markup.

Amongst its many redeeming features, there are two that can share the blame(?) for the stack's impressive rise in popularity:

- **Ease of access**
	Familiar languages/frameworks coupled with abstracted backends make it hard to resist. I wouldn't be shocked to learn that most frontend devs share the same dread for databases that I do. As much as I enjoy working _with_ data, I don't like managing it.

- **Decoupled data source**
	In theory, it doesn't matter where your data is coming from or how many different APIs you're calling to get it. As long as you can feed it to your app. For websites this means that you are never strictly bound to your CMS and could swap it out if need be.

## Should have - Could have
One of the most frustrating situations any dev can face is the belated realization that something could have been done to prevent yourself from dealing with a certain issue.

The decoupled backend is without a doubt an attractive prospect, one that I sold to my boss when we were looking into building a website with Vue.js and a headless CMS. As it turns out, it is very easy to allow your API's data structure to define your app's inner workings. Sooner or later you'll find yourself wondering what happened to the whole "decoupled" argument.

A good hint that you're falling into this trap is if you're fetching data and parsing the response directly in your Vue components. The first step is to remove all your API calls from your components to create a replaceable data-access layer.

There are a ton of tools and techniques to help you implement this sort of pattern. What's difficult is making sure you keep it in mind while building your website or app.

The following is a simple example of how you could go about it without adding any dependencies other than `lodash.merge` (4.2kb gzipped). I've configured a blog built on top of a Vue webpack setup available [on github]() and a live version on [CodeSandbox]().

- For a blog
- Truly decoupled, easy to migrate
- Don't adapt your app to the data, adapt your data to your app (more portable after, really decoupled)
- Backend devs = it's a given for them, but might be new territory for frontend devs

## Seperation of concerns

Let's start with our project's document tree, which looks like this -
(( image of document tree ))

I won't go into detail on how the webpack setup works, but those of you who are used to working with Vue will recognize the [vue-cli](https://github.com/vuejs/vue-cli) [webpack template](https://github.com/vuejs-templates/webpack). We're also using `vue-router` here.

There are only two additional folders: `./sass` and `./resources`. We might get into why the app's Sass is separate from the components another time. For now, the important one is re resources folder, which is where we'll put our data-access layer.

For the purpose of this article, the data itself is stored in the `./static/api` folder, under the `v1` and `v2` folders. Typically you would only have one main API that you would call through and external endpoint, but the goal here is to show how easy it is to swap your data sources, adjusting to the sometimes very different structures.

Our component tree remains basic: we've got our `<BlogFeed>` which is our "home page", `<PostPreview>` for the home page's grid items and `<BlogPost>` being a single article's page.

Let's start with `<BlogFeed>` to wrap our head around the mechanics at work:

```javascript
export default {
  name: 'blog-feed',
  resource: 'Blog',

  data() {
    return {
      feed: [],
      title: '',
      about: {
        text: '',
        label: ''
      }
    }
  },

  beforeMount() {
    this.$getResource('blog')
    this.$getResource('feed')
  }
}
```

Not too much going on here, right? We've got our component's name and data object schema, all filled out with placeholders as recommended by Vue. The only things we haven't seen before are the `resource: 'Blog'` option and the two calls to `$getResource` in the `beforeMount` lifecycle hook.

If you load up the app by running `npm run dev` in your terminal (after having run `npm install` of course), all our data appears on screen after a brief moment. We didn't even need to assign the response to the data, it just gets filled out on it's own.

This is perfect! As I mentioned above, we want to avoid making any references specific to our API's implementation inside components. Instead we have abstracted versions of our AJAX requests, called using an identifier string much like you would with Vuex (Vue's official state management plugin).


## The resource plugin

Let's take a look at what's going on behind this `$getResource` instance method. If we head over to `./resources/resource.js`, we find the following:

```javascript
import _merge from 'lodash.merge'

// install $resource as a Vue plugin
export default {
  install(Vue, { endpoint = '', resources = {} }) {
    // Add method to Vue prototype
    Vue.prototype.$getResource = function(method, options) {
      let name = this.$options.resource
      if (!name || !resources[name] || !resources[name][method]) return;

      // get fetch path and response resolver/mapper
      let { path, resolve } = resources[name][method](options)

      // methods return promise to keep chain alive
      const mappers = {
        // deep merge object with component $data
        merge: dataSet => {
          _merge(this.$data, dataSet)
          return Promise.resolve(dataSet)
        },

        // set individual props on instance $data
        set: dataSet => {
          Object.keys(dataSet).forEach(prop => {
            this.$set(this.$data, prop, dataSet[prop])
          })

          return Promise.resolve(dataSet)
        }
      }

      // fetch and parse resource then pass to resolver
      return fetch(endpoint + path)
        .then(response => response.json())
        .then(response => resolve(response, mappers))
    }
  }
}
```

This is the standard approach for creating a Vue.js plugin. If we pass this export to `Vue.use()`, Vue will look for an `install()` method and call it, passing Vue as the first argument and an options object as the second. In our case, these options are `endpoint`, being the API's base url to which we'll append our query paths, and an object of resources. We'll come back to these soon.

Inside the `install()` method, we assign a function `$getResource` to the Vue prototype that accepts a method name and an options object. The first variable is important; it retrieves the resource identifier from the component it's been called in. In out `<BlogFeed>` example above, this was `'Blog'`. Before looking at where and what this string is referencing, lets look at what is expected of it.

After a few checks to make sure we've got everything we need, we *deconstruct* the result of calling the specified method with the passed options. Safe to assume then that we want methods to return an object with `path` and `resolve`. Then we define an object with two methods: `merge()` and `set()` both taking a `dataSet` argument. The former is using lodash's merge utility to do a deep merge of the `dataSet` our component's data object. The latter simply loops over the keys in `dataSet` and assigns them to our data. Both of these return a Promise, meaning we could chain `.then(dataSet => {})`.

Finally, it calls the new ES2015 native `fetch()` method for making AJAX calls, parses the JSON response and passes the result along with the mappers to our `resolve` function from when we called the resource's method.


## Resource implementations

We're now ready to look at how we define our resources! If we look at the `./resources` folder we find two implementation folders labeled `v1` and `v2`. Again, in most circumstances you would only have one but I've already set up the second API's implementations. Open up `implementation-v1/Blog.js`, you should see:

```javascript
export default {
  feed() {
    return {
      path: '/v1/feed.json',
      resolve: (response, mappers) => mappers.set({ feed: response.results })
    }
  },

  blog() {
    return {
      path: '/v1/blog.json',
      resolve: (response, mappers) => {
        let blog = response.results[0]

        return mappers.merge({
          title: blog.title,
          about: {
            text: blog.about_text,
            label: blog.about_label
          }
        })
      }
    }
  }
}
```
You may have started to connect the dots here. We've got two methods, `feed()` and `blog()` neither of which need any options. Look familiar? These are the two methods we're calling from `<BlogFeed>`'s beforeMount hook.

Both return an object containing the path to query and a resolver function that maps the the correct response data to the component. The `feed()` method is setting the `feed` property directly and `blog()` is merging an object.


## Plug it in

The final step is to connect the dots by telling Vue to use our custom plugin. First we create an index in our implementations folder the declares `export { default as ResourceName } from './ResourceName'`. In our entry point script file `main.js`, we can simply `import * as resources from './resources/implementation-v1'` and pass this to Vue like so:

```javascript
import resource from './resources/resource'
import * as resources from './resources/implementation-v1'

Vue.use(resource, {
	resources,
	endpoint: '/static/api'
})
```

When Vue installs the plugin, we create a closure that captures the resources object, which only the plugin can access directly. This is why setting `resource: 'Blog'` in our component is able to find the implementation.

## Making the switch

How do we get our app to make all its request to the simulated "V2 API" from here? As long as you make sure to put the same methods on your new resource implementations.


## Conclusion

XXX

*Link to headless CMS resources, JAMstack resources, some static site resources?*

***Bullet points recap 1, 2, 3

1) How was your overall experience managing conten with Vue and building a full site (Which things did you enjoy? Did you encounter any challenges?)

>

3) What could you have pushed further? /or/ What other types of projects do you think would be a cool fit for full-on Vue sites?

>

***

*If you've enjoyed this post, please take a second to [share it on Twitter](). Got comments, questions? Hit the section below!*
