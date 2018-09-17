<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>

<div>
<!-- v-model="member.valid" -->

<v-form ref="form"  lazy-validation>
    <!-- General Basic Bio-form start -->
    <v-text-field
      v-model="member.name"
      prepend-icon="person"
      label="Full Name"
      required
    ></v-text-field>
    <v-text-field
      v-model="member.email"
      prepend-icon="email"
      label="E-mail"
    ></v-text-field>
    <v-text-field
      v-model="member.phoneNo"
      prepend-icon="contact_phone"
      label="Phone No"
      required
    ></v-text-field>
    <!-- General Basic Bio-form End -->
    <!-- Personal Details Bio-form start -->
    <v-date-picker v-model="picker" no-title scrollable>
      <v-spacer></v-spacer>
    </v-date-picker>
    <!-- calender for birthday -->
            <v-select
      v-model="member.gender"
      :items="genders"
      prepend-icon="nature"
      :rules="[v => !!v || 'Item is required']"
      label="Gender"
    ></v-select>

        <!-- relation ship status -->

    <!-- Personal Details Bio-form end -->
    <v-checkbox
      v-model="member.isStudent"
      label="A Student?"
      required
    ></v-checkbox>
    <!-- student specific form Start-->
        <div v-if="member.isStudent">
          <v-text-field
      v-model="member.department"
      label="Department"
      prepend-icon="place"
    ></v-text-field>
        <v-text-field
      v-model="member.level"
      prepend-icon="my_location"
      label="Level"
    ></v-text-field>
        <v-text-field
      v-model="member.school"
      prepend-icon="school"
      label="University"
    ></v-text-field>
        </div>
    <!-- student specific form End -->
    <!-- working class specific form start -->
        <div v-if="!member.isStudent">
          <v-text-field
      v-model="member.job"
      prepend-icon="place"
      label="Job Title"
    ></v-text-field>
        <v-text-field
        prepend-icon="business_center"
      v-model="member.workAddress"
      label="Work Address"
    ></v-text-field>
        </div>
    <!-- working class specific form  end -->
    <!-- working follow-ip specific form  start -->
     <v-checkbox
      v-model="member.checkbox"
      label="Visitor ?"
      required
    ></v-checkbox>
        <v-text-field
      v-model="member.address"
      prepend-icon="directions"
      label="Address"
      required
    ></v-text-field>
    <!-- working follow-ip specific form  end -->
    <!-- working Admin-specific operation  start -->
        <v-checkbox
      v-model="manual"
      label="manual Numbering?"
    ></v-checkbox>
        <div v-if="manual">
          <v-text-field
      v-model="member.churchNo"
      type="number"
      label="Church Number"
    ></v-text-field>
        </div>
    <!-- working  Admin-specific operation   end -->

    <v-btn
    color="primary"
      :disabled="!valid"
      @click="submit(member)"
    >
      submit
    </v-btn>
    <v-btn @click="clear">clear</v-btn>
  </v-form>

</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { format } from "date-fns";
import { Member, DateFormat } from "@elizer/shared";

@Component
export default class ElizerMemberForm extends Vue {
  public date = Number(format(format(Date.now(), DateFormat), "x"));

  public manual = false;

  public member: Member = {} as any;

  @Prop() public input!: Member;

  /** hender format */
  get genders(): string[] {
    return ["Female", "Male"];
  }

  get valid() {
    return (
      this.member.name &&
      this.member.gender &&
      this.member.address &&
      this.member.phoneNo &&
      this.date
    );
  }

  /** remap and emit the memer */
  submit($event: Member) {
    $event.day = Number(format(this.date, "DD"));
    $event.month = format(this.date, "MMMM");
    this.$emit('submit', $event);
  }

  clear() {}

  get picker() {
    return format(this.date, "YYYY-MM-DD");
  }

  set picker(date: string) {
    this.date = Number(format(format(date, DateFormat), "x"));
  }

  mounted() {
    this.member = { ...this.input };
  }
}
</script>

<style>
</style>
