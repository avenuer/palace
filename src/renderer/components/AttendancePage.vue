<template>
<div class="uk-container uk-animation-scale-up uk-transform-origin-top-center">
  <!-- page title -->
  <div class="row space-down-content">
    <h2 class="uk-text-center"> Attendance </h2>
  </div>
  <div class="row">
    <!-- page elements -->
    <div class="uk-child-width-1-2 uk-text-center" uk-grid uk-height-match="target: #_other_container">
      <!-- search section -->
      <div class="">
        <div class="uk-text-center confim-btns">
          <div class="uk-width-auto uk-padding-small">
            <label for="id_no" class="uk-text-large uk-text-muted">Identification No</label>
            <input v-model="memberId" class="uk-input" type="text" name="id_no" id="">
          </div>
          <div class="">
            <button v-on:click="getMember(memberId)" type="submit" class="uk-button uk-button-primary uk-button-medium">Search</button>
          </div>
        </div>
      </div>
      <!-- -->
      <!-- biodata section -->
      <div v-if="member" id="_other_container">
        <bio-data v-bind:member="member"></bio-data>
        <div class="uk-child-width-1-2 confim-btns" uk-grid>
          <div> <button v-on:click="resetMember()" class="uk-button uk-button-danger uk-button-medium" type="reset"> Cancel</button> </div>
          <div> <button v-on:click="markAttendance()" class="uk-button success-confim-btns uk-button-medium" type="submit"> Okay </button> </div>
        </div>
      </div>
    </div>
    <div>

    </div>
  </div>
</div>
</template>

<script>
import to from 'await-to-js';
import moment from 'moment';
import BioData from './shared/BioData/BioData';

import DB from '../database';
import util, {
  notify,
  logs,
} from '../utils';

const {
  createMember,
  getMember,
} = DB;


const {
  throwError,
} = util;

export default {
  name: 'attendance-page',
  components: {
    BioData,
  },
  data: function attendanceData() {
    return {
      //  current memberId selected
      memberId: undefined,
      // current member object
      member: undefined,
    };
  },
  methods: {
    // retrieves the member from the database
    async getMember(id) {
      try {
        const [err, member] = await to(getMember(id));
        logs.debug({
          err,
          member,
        });
        throwError(err);
        this.member = member;
      } catch (e) {
        this.handleError(e);
      }
    },
    // marks the member attendance
    async markAttendance() {
      try {
        if (!this.member.sundays) {
          this.member = { ...this.member,
            sundays: [],
          };
        }
        const dayToAdd = moment().subtract(moment().day(), 'day');
        const memberSundays = this.member.sundays.map(e => util.formatDate(moment(e)).date);
        if (memberSundays.indexOf(util.formatDate(dayToAdd).date) < 0) {
          this.member.sundays.push(dayToAdd);
        }
        const [err, member] = await to(createMember(this.member));
        console.log(member);
        throwError(err);
        this.resetMember();
      } catch (e) {
        this.handleError(e);
      }
    },
    // reset member and memberId
    resetMember() {
      this.member = undefined;
      this.memberId = undefined;
    },
    // handles the error
    handleError(err) {
      notify.error('error marking attendance', err.message);
    },
  },
};
</script>

<style scoped>
.confim-btns {
  padding-top: 10%;
}

.success-confim-btns {
  background-color: rgb(0, 167, 89);
  color: white;
}

.space-down-content {
  padding-bottom: 3%;
}
</style>
