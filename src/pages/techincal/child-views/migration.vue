<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>
  <v-container fluid grid-list-xl>
    <v-toolbar>
      <v-toolbar-title>Migration</v-toolbar-title>
  </v-toolbar>
    <v-layout wrap align-center>
      
      <v-flex xs12 sm12 d-flex>
        <v-select
        v-model="version"
          :items="items"
          label="Version"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm12 >
        <v-btn color="info" @click="migrate(version)">Migrate</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { format, getMonth, getMilliseconds } from "date-fns";
import { migratePrototype } from "libs/render";
import { ApiStatus, Migration } from "@elizer/shared";

interface MigrationData {
  text: string;
  migration: Migration;
}


enum MigrationText {
  Prototype = "Prototype"
}

@Component({
  components: {}
})
export default class MigrationView extends Vue {
  
  /** migration options available */
  public migration: MigrationData[] = [
    { text: MigrationText.Prototype, migration: Migration.Prototype }
  ];

/** current version selected */
  version = MigrationText.Prototype;

  async migrate(migrationFormat: MigrationText) {
    switch (migrationFormat) {
      case MigrationText.Prototype:
      const {data, error} =  await migratePrototype();
        this.$notify({ title: 'Prototype Migration', text: data || error });
        break;
    
      default:
        break;
    }
  }

  get items() {
    return this.migration.map(e => e.text);
  }
}
</script>

<style lang="scss">
</style>
