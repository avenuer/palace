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
import { retrieveLiensce, RouterNames, OrgModuleMutations, AdminRoutesNames } from "libs/render";

@Component({
  components: {
    ElizerSideBar
  }
})
export default class HelloDecorator extends Vue {
  private menu = false;

  async confirmLiensce() {
    const { data, error } = await retrieveLiensce();
    if (data) {
      // set-store
      this.$store.commit(OrgModuleMutations.SetOrg, data);
      this.$notify({
        type: "success",
        title: "Organization Liensce",
        text: "successfully retreive orgainzational liensce"
      });
      this.$router.push({name: AdminRoutesNames.Home})
      return;
    }
    this.$notify({
      type: "failure",
      title: "Liensce",
      text: error|| "successfully retreive orgainzational liensce"
    });
    this.$router.push({ name: RouterNames.TechnicalPage, query: { ops: 'liensce' }});
  }

  mounted() {
    this.confirmLiensce();
  }

  
}
</script>

<style lang="scss">
@import "~vuetify/dist/vuetify.min.css";
@import "~material-design-icons-iconfont/dist/material-design-icons.css";

.greeting {
  font-size: 20px;
}
</style>
