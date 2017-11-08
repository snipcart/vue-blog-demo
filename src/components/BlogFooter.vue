<template>
  <transition appear name="v--mask">
    <footer v-once class="blog__footer">
      <a class="signature" href="https://snipcart.com" target="_blank">
        <img src="../assets/vue-snip.svg"/>
      </a>
    </footer>
  </transition>
</template>

<script>
export default { name: 'blog-footer' }
</script>
