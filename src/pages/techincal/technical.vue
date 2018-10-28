<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->

<template>
  <v-layout align-center>

    <migration-view></migration-view>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { format, getMonth, getMilliseconds } from "date-fns";
import MigrationView from "./child-views/migration.vue";

@Component({
  components: {
    MigrationView
  }
})
export default class TechnicalPage extends Vue {
  viewscount = 1;

  selected = 1;
}
</script>

<style lang="scss">
</style>
