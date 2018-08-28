<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>
  <div>

  <v-layout justify-center>
    <v-flex xs12 sm8>
      <v-card>
        <v-card-title class="cyan darken-1">
          <span class="headline white--text"> name Sarah Mcbeal</span>

          <v-spacer></v-spacer>
          <v-btn dark icon>
            churchNo
          </v-btn>

          <v-btn dark icon>
            <v-icon>chevron_left</v-icon>
          </v-btn>

          <v-btn dark icon>
            <v-icon>edit</v-icon>
          </v-btn>

          <v-btn dark icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-card-title>

        <v-img
          src="https://picsum.photos/700?image=996"
          height="200px"
        ></v-img>

                <v-list>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>mail</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>joe@email.com</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>

            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>phone</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>(323) 555-6789</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>cake</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> Birthday : Setup calender </v-list-tile-title>
            </v-list-tile-content>
            <v-icon>calendar_today</v-icon>
            <!-- calender -->
                <!-- <v-date-picker :readonly="true" v-model="picker" :landscape="landscape" :reactive="reactive"></v-date-picker> -->

          </v-list-tile>


          <v-divider inset></v-divider>

         <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>nature</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> male </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

         <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>place</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> department </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>
         <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>my_location</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> level </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

         <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>school</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> University </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

         <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>place</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> job </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

         <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>business_center</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> workAddress </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

         <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>visibility</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> Vistor </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>location_on</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> Address Orlando, FL 79938</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

      </v-card>
    </v-flex>
  </v-layout>

  </div>
</template>

<script lang="ts">
import { Member } from "@elizer/members";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ElizerMemberBiodata extends Vue {
  @Prop() public member!: Member;
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

  get genders(): string[] {
    return ["Female", "Male"];
  }

  get exclamationMarks(): string {
    return "";
  }
}
</script>

<style>
@import "~vuetify/dist/vuetify.min.css";

.greeting {
  font-size: 20px;
}
</style>
