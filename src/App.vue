<template>
  <router-view id="app"/>
</template>

<script>
export default {
  name: 'app',

  beforeMount() {
    // const body = document.body
    // let symbols = document.createElement('object')
    // symbols.style.display = 'none'
    //
    // this.$http.get('/static/svg/icons.svg').then(response => {
    //   symbols.innerHTML = response.body
    //   body.insertBefore(symbols, body.children[0])
    // })
  }
}
</script>

<style lang="scss">
@import 'sass/app';
</style>
