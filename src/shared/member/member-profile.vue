<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>
  <div>

  <v-layout justify-center>
    <v-flex xs12 sm8>
      <v-card>
        <v-card-title color="indigo"  >
          <span> {{ member.name }} </span>

          <v-spacer></v-spacer>
          <v-btn icon>
            {{ member.churchNo }}
          </v-btn>
          <div v-if="actions" >
            <v-btn  icon>
              <v-icon @click="edit(member)">edit</v-icon>
            </v-btn>

            <v-btn  icon>
              <v-icon @click="deleteMember(member)">delete</v-icon>
            </v-btn>
          </div>

        </v-card-title>
        <v-img
          v-bind:src="image"
          height="200px"
        ></v-img>

                <v-list>
          <v-list-tile >
            <v-list-tile-action>
              <v-icon>mail</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ member.email }}</v-list-tile-title>
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
              <v-list-tile-title> {{ member.phoneNo }} </v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile >
            <v-list-tile-action>
              <v-icon>cake</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ member.day }} {{ member.month }} </v-list-tile-title>
            </v-list-tile-content>
            <v-icon v-if="actions"  @click="calender = !calender">calendar_today</v-icon>
            <!-- calender -->
                <v-date-picker v-if="calender" :readonly="true" v-model="picker"></v-date-picker>
          </v-list-tile>


          <v-divider inset></v-divider>

         <v-list-tile >
            <v-list-tile-action>
              <v-icon>nature</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> {{ member.gender }} </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

        <!-- student details -->
         <div  v-if="member.isStudent" >
           <v-list-tile >
            <v-list-tile-action>
              <v-icon>place</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> {{ member.department }} </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>
         <v-list-tile >
            <v-list-tile-action>
              <v-icon>my_location</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> {{ member.level }} </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

         <v-list-tile >
            <v-list-tile-action>
              <v-icon>school</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> {{ member.school }} </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>
         </div>
        <!-- student details End -->
        <!--  working class start -->

         <div v-if="!member.isStudent">
           <v-list-tile >
            <v-list-tile-action>
              <v-icon>place</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> {{ member.job }} </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

         <v-list-tile >
            <v-list-tile-action>
              <v-icon>business_center</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> {{ member.workAddress }} </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>
         </div>
          <!--  working class end -->

         <v-list-tile >
            <v-list-tile-action>
              <v-icon>visibility</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> {{ member.isVisitor }} </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-list-tile >
            <v-list-tile-action>
              <v-icon>location_on</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title> {{ member.address }} </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

      </v-card>
    </v-flex>
  </v-layout>

  </div>
</template>

<script lang="ts">
import { Member } from '@elizer/shared';
import { Component, Prop, Vue } from "vue-property-decorator";
import { format } from 'date-fns';

@Component
export default class ElizerMemberBiodata extends Vue {
  @Prop() public member!: Member;
  @Prop() public image!: string;
  @Prop() public actions!: boolean;
  @Prop() deleteMember!: Function;
  @Prop() edit!: Function;

  /** boolean to show calender dialog */
  calender = false;

  get genders(): string[] {
    return ["Female", "Male"];
  }

  get picker() {
    const currentYr = format(Date.now(), `YYYY`);
    const date = new Date(`${currentYr}-${this.member.month}-${this.member.day}`);
    return format(date, `YYYY-MM-DD`);
  }
}
</script>

<style>

</style>
