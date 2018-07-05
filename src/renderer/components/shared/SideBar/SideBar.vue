<template>
    <div class="uk-flex uk-flex-column uk-animation-slide-left">
      <button class="uk-button uk-button-default" v-on:click="changeRoute('/')"> Home </button>
      <button class="uk-button uk-button-default" v-on:click="changeRoute('/attendance')"> Attendance </button>
      <button class="uk-button uk-button-default" v-on:click="changeRoute('/birthday')"> Birthdays </button>
      <button class="uk-button uk-button-default" v-on:click="changeRoute('/admin')"> Admin </button>
    </div>
</template>

<script>
export default {
  name: 'side-bar',
  methods: {
    changeRoute(address) {
      this.$router.push(address);
    },
  },
};
</script>
