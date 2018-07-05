<template>
<div class="uk-flex-center uk-container uk-padding-large">
  <div class="uk-text-center" uk-grid>
    <div class="uk-width-1-5@m">
      <side-bar></side-bar>
    </div>
    <div class="uk-width-expand@m">
      <div class="row uk-text-right">
          <button class="uk-button opacity-75 uk-button-danger uk-button-medium" v-on:click="$router.go(-1)"> go back </button>
      </div>
      <div class="row">
          <router-view ></router-view>
      </div>

          <!-- class="center-page" uk-child-width-1-2 -->
    </div>
  </div>
</div>
</template>

<script>
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import SideBar from './components/shared/SideBar/SideBar';

// loads the Icon plugin
UIkit.use(Icons);

export default {
  name: 'palace',
  components: {
    SideBar,
  },
};
</script>

<style>
@import url('~@/assets/css/uikit.min.css');
  .center-page {
    padding-top: 7%!important;
    padding-right: 15%!important;
  }

  .opacity-75 {
    opacity: 0.75;
  }
</style>
