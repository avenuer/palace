<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<v-app>
  <v-navigation-drawer  stateless  width="250"
    :value="menu" app>
    <elizer-side-bar> </elizer-side-bar>
  </v-navigation-drawer>
  <v-toolbar dark color="primary" app>
      <v-toolbar-side-icon @click="menu = !menu" ></v-toolbar-side-icon>
    <v-toolbar-title>Elizer </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn @click="$router.go(-1)" flat> Go Back </v-btn>
  </v-toolbar>
  <v-content>
    <notifications position="bottom right"/>
      <router-view></router-view>
  </v-content>
  <v-footer app></v-footer>
</v-app>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ElizerSideBar from "./root/sidebar.vue";

@Component({
  components: {
    ElizerSideBar
  }
})
export default class HelloDecorator extends Vue {

  private menu = false;

}
</script>

<style lang="scss">
@import "~vuetify/dist/vuetify.min.css";
@import "~material-design-icons-iconfont/dist/material-design-icons.css";

.greeting {
  font-size: 20px;
}
</style>
