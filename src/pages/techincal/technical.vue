<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->

<template>
  <v-layout align-center column>
    <v-flex>
        <v-select
        v-model="selectedView"
          :items="subViews"
          label="Operation"
        ></v-select>
    </v-flex>
      <migration-view v-if="selectedView === subViews[0]"></migration-view>
      <liensce-view v-if="selectedView === subViews[1]"></liensce-view>

  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { format, getMonth, getMilliseconds } from "date-fns";
import MigrationView from "./child-views/migration.vue";
import LiensceView from "./child-views/liensce.vue";

@Component({
  components: {
    MigrationView,
    LiensceView
  }
})
export default class TechnicalPage extends Vue {
  subViews = ['migration', 'liensce'];
  selectedView = ''

  mounted() {
   const ops: string | null = this.$route.query['ops']; 
   if (ops) {
     this.selectedView = ops;
   }
  }
}
</script>

<style lang="scss">
</style>
