<template>
<div class="">
  <img width="480" class="uk-animation-kenburns" src="~@/assets/rccg-logo.png" uk-img alt="">
</div>
</template>

<script>
Window.pouchDb = window.require('pouchdb');

export default {
  name: 'home-page',
  components: { },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
  },
};
</script>