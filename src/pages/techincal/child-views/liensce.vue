<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>
  <v-container fluid grid-list-xl>
    <v-layout wrap align-center>
      <v-toolbar>
        <v-toolbar-title>Liensce</v-toolbar-title>
    </v-toolbar>
        <v-btn color="info" v-if="!validLiensce" @click="openDialog()">Liensce Key</v-btn>
        <v-btn color="info" v-if="validLiensce" @click="migrate(version)">confirm Liensce Key</v-btn>

    </v-layout>
  </v-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { migratePrototype, setLiensce, decryptLiensce } from "libs/render";
import { ApiStatus, Migration } from "@elizer/shared";
import { isObject } from 'lodash';


@Component({
  components: {}
})
export default class MigrationView extends Vue {

  public validLiensce = false;
  public key: string | null = null;
  
  async openDialog () {
    const { data, error } = await decryptLiensce();
    console.log({ data, error });
    if(data) {
      return
    }
    this.$notify({ type: 'error', title: 'Palace Liensce', text: error });
}

async decrypt(key: string) {
  // this.validLiensce = isNullOrUndefined(error);
  // this.key = this.validLiensce ? key : null;
}

async setLiensce(key: string) {

}
}
</script>

<style lang="scss">
</style>
