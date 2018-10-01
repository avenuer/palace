<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div
    stateless
    value="true"
  >

<v-list>
          <v-list-group
            v-for="item in menuConfig"
            :key="item.title"
            :prepend-icon="item.icon"
            no-action
          >
            <!-- v-model="item.active" -->
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
              v-for="subItem in item.subMenu"
              :key="subItem.title"
              @click="changeRoute(subItem.action)"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-tile-action>

            </v-list-tile>
          </v-list-group>
        </v-list>


  </div>


</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  RouterNames,
  AdminRoutesNames,
  FollowUpRoutesNames
} from "libs/render";
import { capitalize } from "lodash";

interface MenuItem {
  title: string;
  action: string;
  icon?: string;
}

interface Menu {
  [key: string]: {
    icon?: string;
    subMenu: MenuItem[];
  };
}

@Component
export default class ElizerNavBar extends Vue {
  /*** application menu configuration object */
  private menu: Menu = {
    member: {
      icon: "storage",
      subMenu: [
        {
          title: "List",
          action: AdminRoutesNames.Home,
          icon: "collections_bookmark"
        },
        { title: "Create", action: AdminRoutesNames.MemberCreate, icon: 'person_add' }
      ]
    },
    followUp: {
      icon: "assessment",
      subMenu: [
        {
          title: "BirthDays",
          action: FollowUpRoutesNames.Birthdays,
          icon: "event"
        },
        { title: "History", action: FollowUpRoutesNames.Home, icon: 'history' },
        { title: "Register", action: FollowUpRoutesNames.Register, icon: 'check' }
      ]
    }
  };

  /** changes the route to the route mapping the page requested */
  changeRoute(routeName: string) {
    this.$router.push({ name: routeName });
  }

  /** maps the menu object to a view configuration for the page */
  get menuConfig() {
    return Object.keys(this.menu).map(title =>
      Object.assign({ title: capitalize(title), ...this.menu[title] })
    );
  }
}
</script>

<style>
</style>
