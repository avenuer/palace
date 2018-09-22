<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

  <v-toolbar dark color="primary" app>
      <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title>Elizer </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat>Follow Up</v-btn>
      <v-btn flat>Admin</v-btn>
    </v-toolbar-items>
  </v-toolbar>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ElizerNavBar extends Vue {

}
</script>

<style>

</style>
