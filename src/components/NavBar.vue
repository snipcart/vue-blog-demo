<template>
  <nav class="nav">
    <h1 class="nav__title">
      <router-link to="/">{{ title }}</router-link>
    </h1>

    <menu>
      <li class="nav__item"></li>
      <li class="nav__item">{{ label }}</li>
    </menu>
  </nav>
</template>

<script>
export default {
  name: 'nav-bar',
  props: {
    title: String,
    label: String
  }
}
</script>
