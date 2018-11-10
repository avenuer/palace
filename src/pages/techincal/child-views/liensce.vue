<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>
  <v-container >
      <v-toolbar>
        <v-toolbar-title>Liensce</v-toolbar-title>
    </v-toolbar>
    <v-layout class=".column-liensce" >
      <v-flex></v-flex>
      <v-flex>
        <v-card v-if="org">
                <v-list>
          <v-list-tile >
            <v-list-tile-action>
              <v-icon>person</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ org.name }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>

            </v-list-tile-action>
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile >
            <v-list-tile-action>
              <v-icon>nature</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ org.id }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>

            </v-list-tile-action>
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile >
            <v-list-tile-action>
              <v-icon>mail</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ org.email }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>

            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile >
            <v-list-tile-action>
              <v-icon>phone</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> {{ org.phoneNo }} </v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>


          <v-list-tile >
            <v-list-tile-action>
              <v-icon>location_on</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> {{ org.address }} </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

      </v-card>
        <v-btn class="self-center " color="info" v-if="!org" @click="openDialog()">Liensce Key</v-btn>
        <v-btn class="self-center " color="info" v-if="org" @click="setLiensce()">confirm Liensce Key</v-btn>
      </v-flex>
      <v-flex></v-flex>

    </v-layout>
  </v-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { migratePrototype, setLiensce, decryptLiensce, AdminRoutesNames } from "libs/render";
import { ApiStatus, Migration, Organization } from "@elizer/shared";
import { isObject } from "lodash";

@Component({
  components: {}
})
export default class MigrationView extends Vue {
  public key: string | null = null;
  public org: Organization | null = null;

  async openDialog() {
    const { data, error } = await decryptLiensce();
    if (data) {
      this.org = data.decrypted;
      this.key = data.key;
    this.$notify({ type: "success", title: "Palace Liensce", text: 'Liensce is successfully decrypted' });
      return;
    }
    this.$notify({ type: "error", title: "Palace Liensce", text: error });
  }

  async setLiensce() {
    if (this.key) {
      const { data, error } = await setLiensce(this.key);
      if (data) {
        this.$router.push({ name: AdminRoutesNames.Home });
        this.$notify({ type: "success", title: "Palace Liensce", text: 'Liensce is successfully set' });
        return
      }
      this.$notify({ type: "error", title: "Palace Liensce", text: error });
    }
  }
}
</script>

<style lang="scss">
.column-liensce {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
}

.self-center {
  align-self: center
}
</style>
