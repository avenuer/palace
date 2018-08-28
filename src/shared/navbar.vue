<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

  <v-toolbar color="primary" app>
      <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title>Title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat>Follow Up</v-btn>
      <v-btn flat>Admin</v-btn>
      <v-btn flat>Link Three</v-btn>
    </v-toolbar-items>
  </v-toolbar>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ElizerNavBar extends Vue {
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

    get exclamationMarks(): string {
        return Array(this.enthusiasm + 1).join('!');
    }
}
</script>

<style>

@import "~vuetify/dist/vuetify.min.css";

.greeting {
    font-size: 20px;
}
</style>
