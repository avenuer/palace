<template>
<div class="uk-container uk-card-body uk-animation-scale-up">
  <!-- page title -->
  <div class="row space-down-content">
    <h2 class="uk-text-center"> BirthDays </h2>
  </div>
  <div class="row">
    <!-- page elements -->
    <div class="uk-text-center" uk-grid>
      <!-- search section -->
      <div class="uk-width-1-2@m">
        <div class="row">
          <div class="uk-inline uk-width-1-1 uk-text-center">
            <div class="uk-margin">
              <label for="birth_month">Month</label>
              <select v-model="month" class="uk-select" name="birth_month" id="">
              <option v-for="_month in months" v-bind:key="_month" v-bind:value="_month"> {{ _month }} </option>
            </select>
            </div>
          </div>
        </div>
        <!-- list display -->
        <div class="row">
          <bio-list v-bind:members="members" v-on:member="member = $event"></bio-list>
        </div>
      </div>
      <!-- biodata section -->
      <!--  v-if="member" -->
      <div v-if="member" class="uk-width-expand@m">
        <bio-data class="space-15" v-bind:member="member"></bio-data>
      </div>
    </div>
    <div>

    </div>
  </div>
</div>
</template>

<script>
import to from 'await-to-js';

import BioData from './shared/BioData/BioData';
import BioList from './shared/BioList/BioList';

import DB from '../database';
import utils, {
  calender,
  logs,
  notify,
} from '../utils';

export default {
  name: 'birthday-page',
  components: {
    BioData,
    BioList,
  },
  data() {
    return {
      // the list of members to display
      members: [],
      // current member selected
      member: undefined,
      month: calender.months[0],
      months: calender.months,
    };
  },
  methods: {
    /** search members with their birthMonths  */
    async searchBirthMonth(birthmonth) {
      try {
        const [err, members] = await to(DB.findMembers({ birthmonth }));
        logs.debug(err, members);
        utils.throwError(err);
        utils.nullError(members);
        this.members = members;
      } catch (e) {
        this.handleErr(e);
      }
    },
    // handles the error locally
    handleErr(err) {
      notify.error('Error searching BirthdayMonths', err.message);
    },
  },
  watch: {
    month(value) {
      this.searchBirthMonth(value);
    },
  },
  created() {
    this.searchBirthMonth(this.month);
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