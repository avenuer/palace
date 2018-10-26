<template>
<div class="home">
  <img width="480" class="uk-animation-kenburns" src="~@/assets/rccg-logo.png" uk-img alt="">
  <button class="uk-button uk-button-default" v-on:click="dumpDB()"> Dump </button>
</div>
</template>

<style>
  
  .home {
    display: flex;
    flex-direction: column;
    align-content: center;
  }

  .home .item {
    align-self: flex-end;
    justify-self: center;
  }

</style>


<script>
Window.pouchDb = window.require('pouchdb');
export default {
  name: 'home-page',
  components: { },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    dumpDB() {
      this.$electron.remote.getGlobal('dumpDB')();
    }
  },
};
</script>