<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>

<v-form ref="form" v-model="valid" lazy-validation>
    <!-- General Basic Bio-form start -->
    <v-text-field
      v-model="name"
      prepend-icon="person"
      :rules="nameRules"
      :counter="10"
      label="Full Name"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      prepend-icon="email"
      label="E-mail"
    ></v-text-field>
    <v-text-field
      v-model="phoneNo"
      prepend-icon="contact_phone"
      :rules="emailRules"
      label="Phone No"
      required
    ></v-text-field>
    <!-- General Basic Bio-form End -->
    <!-- Personal Details Bio-form start -->
<v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
        </v-date-picker>
    <!-- calender for birthday -->
            <v-select
      v-model="gender"
      :items="genders"
      prepend-icon="nature"
      :rules="[v => !!v || 'Item is required']"
      label="Gender"
    ></v-select>

        <!-- relation ship status -->

    <!-- Personal Details Bio-form end -->
    <!-- student specific form Start-->
    <v-checkbox
      v-model="isStudent"
      label="A Student?"
      required
    ></v-checkbox>
        <v-text-field
      v-model="department"
      label="Department"
      prepend-icon="place"
    ></v-text-field>
        <v-text-field
      v-model="level"
      prepend-icon="my_location"
      label="Level"
    ></v-text-field>
        <v-text-field
      v-model="school"
      prepend-icon="school"
      label="University"
    ></v-text-field>
    <!-- student specific form End -->
    <!-- working class specific form start -->
        <v-text-field
      v-model="job"
      prepend-icon="place"
      label="Job Title"
    ></v-text-field>
        <v-text-field
        prepend-icon="business_center"
      v-model="workAddress"
      label="Work Address"
    ></v-text-field>
    <!-- working class specific form  end -->
    <!-- working follow-ip specific form  start -->
     <v-checkbox
      v-model="checkbox"
      label="Visitor ?"
      required
    ></v-checkbox>
        <v-text-field
      v-model="address"
      prepend-icon="directions"
      label="Address"
      required
    ></v-text-field>
    <!-- working follow-ip specific form  end -->
    <!-- working Admin-specific operation  start -->
        <v-checkbox
      v-model="checkbox"
      label="manual Numbering?"
    ></v-checkbox>
        <v-text-field
      v-model="churchNo"
      type="number"
      label="Church Number"
    ></v-text-field>
    <!-- working  Admin-specific operation   end -->

    <v-btn
      :disabled="!valid"
      @click="submit"
    >
      submit
    </v-btn>
    <v-btn @click="clear">clear</v-btn>
  </v-form>

</div>

</template>

<script lang="ts">
import { Member } from '@elizer/members';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ElizerMemberForm extends Vue {
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
    return ['Female', 'Male'];
  }

  get exclamationMarks(): string {
    return '';
  }
}
</script>

<style>
@import "~vuetify/dist/vuetify.min.css";

.greeting {
  font-size: 20px;
}
</style>
