<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<v-app>
  <v-navigation-drawer  stateless  width="250"
    value="true" app>
    <elizer-side-bar> </elizer-side-bar>
  </v-navigation-drawer>
<elizer-nav-bar></elizer-nav-bar>
  <v-content>
    <notifications position="bottom right"/>
      <router-view></router-view>
  </v-content>
  <v-footer app></v-footer>
</v-app>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ElizerNavBar from "./root/navbar.vue";
import ElizerSideBar from "./root/sidebar.vue";

@Component({
  components: {
    ElizerNavBar,
    ElizerSideBar
  }
})
export default class HelloDecorator extends Vue {

}
</script>

<style lang="scss">
@import "~vuetify/dist/vuetify.min.css";
@import "~material-design-icons-iconfont/dist/material-design-icons.css";

.greeting {
  font-size: 20px;
}
</style>
