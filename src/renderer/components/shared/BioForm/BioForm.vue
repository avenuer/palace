<template>
<div class="row">
  <div class="uk-text-center" uk-grid>
    <div class="uk-width-1-2">
      <label for="first_name">First Name</label>
      <input v-model="_member.firstname" class="uk-input" type="text" name="first_name" id="">
    </div>
    <div class="uk-width-1-2">
      <label for="last_name">Last Name</label>
      <input v-model="_member.lastname" class="uk-input" type="text" name="last_name" id="">
    </div>
    <div class="uk-width-1-2">
      <label for="phoneNo">Phone No</label>
      <input v-model="_member.phoneNo" class="uk-input" type="text" name="phoneNo" id="">
    </div>
    <div class="uk-width-1-2">
      <label for="email">Email</label>
      <input v-model="_member.email" class="uk-input" type="email" name="email" id="">
    </div>
    <div class="uk-width-1-2">
      <label for="department">Department</label>
      <input v-model="_member.department" class="uk-input" type="text" name="department" id="">
    </div>
    <div class="uk-width-1-2">
      <label for="level">Level</label>
      <input v-model="_member.level" class="uk-input" type="text" name="level" id="">
    </div>
    <div class="uk-width-1-3">
        <label for="gender">Gender</label>
        <select v-model="_member.gender" class="uk-select" name="gender" id="">
            <option value="Female"> Female </option>
            <option value="Male"> Male </option>
          </select>
    </div>
    <div class="uk-width-1-3">
        <label for="birth_day">Day</label>
        <select v-model="_member.birthday" class="uk-select" name="birth_day" id="">
            <option v-for="day in days" v-bind:key="day + 1" v-bind:value="day + 1"> {{ day + 1 }} </option>
          </select>
    </div>
    <div class="uk-width-1-3">
      <label for="birth_month">Month</label>
      <select v-model="_member.birthmonth" class="uk-select" name="birth_month" id="">
          <option v-for="month in months" v-bind:key="month" v-bind:value="month"> {{month}} </option>
      </select>
    </div>
    <div class="uk-width-1-2">
      <label for="is_student">Student</label>
      <input v-model="_member.student" class="uk-checkbox" type="checkbox" name="is_student" id="">
    </div>
    <div class="uk-width-1-2">
      <label for="is_visitor">Visitor</label>
      <input v-model="_member.visitor" class="uk-checkbox" type="checkbox" name="is_visitor" id="">
    </div>
    <div class="uk-margin uk-width-1-1">
      <!-- <div class="uk-width-auto"> -->
      <label for="address">Address</label>
      <textarea v-model="_member.address" class="uk-input address-text-area" name="address" id="" cols="30" rows="10"></textarea>
      <!-- </div> -->
    </div>
  </div>
  <div class="uk-text-right">
    <!-- v-bind:disabled="isValid" -->
    <button  v-on:click="clear()" class="uk-button uk-button-danger"> Clear </button>
    <button  v-on:click="emit('member', _member)" class="uk-button uk-button-primary"> Okay </button>
  </div>
</div>
</template>

<script>
import { calender, logs } from '../../../utils';

const keys = ['firstName', 'lastName', 'phoneNo', 'email', 'day', 'month', 'address', 'visitor', 'student'];

export default {
  name: 'bioform',
  props: {
    member: {},
  },
  methods: {
    emit(name, value) {
      this.$emit(name, value);
      logs.log(value);
    },
    clear() {
       this._member = this.uncleared; // eslint-disable-line
    },
  },
  data() {
    return {
      holder: undefined,
      ...calender,
      uncleared: true,
    };
  },
  computed: {
    isValid: function isValid() {
      return (keys.map(e => (this._member[e])).indexOf(false) > -1); // eslint-disable-line
    },
    _member: { // eslint-disable-line
      get() {
        if (!this.holder) {
          this.holder = this.member;
        }
        return Object.assign({}, this.holder);
      },
      set(value) {
        if (value) {
          this.holder = {};
          this.uncleared = false;
        } else {
          this.holder = this.member;
          this.uncleared = true;
        }
      },
    },
  },
};
</script>


<style scoped>
.address-text-area {
  min-width: 150px;
  min-height: 150px;
  max-height: 150px;
}
</style>
