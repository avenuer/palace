<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<v-app>
  <!-- <v-navigation-drawer app></v-navigation-drawer> -->
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
import ElizerNavBar from "../shared/navbar.vue";

@Component({
  components: {
    ElizerNavBar
  }
})
export default class HelloDecorator extends Vue {
  @Prop() public name!: string;
  @Prop() public initialEnthusiasm!: number;

  public enthusiasm = this.initialEnthusiasm;

  public increment() {
    this.enthusiasm++;
  }

  public decrement() {
    if (this.enthusiasm > 1) {
      this.enthusiasm--;
    }
  }

  public log($event: Event) {
    const files = ($event.srcElement as HTMLInputElement).files;
    if (!files) {
      return;
    }
    const file = files.item(0);
    // tslint:disable-next-line:no-console
    console.log($event);
  }

  get exclamationMarks(): string {
    return Array(this.enthusiasm + 1).join("!");
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
