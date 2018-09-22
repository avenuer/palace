<template>
<div class="space-10">
  <!-- navigation -->
  <div class="row" uk-grid>
    <div class="uk-width-1-3">
      <button v-on:click="getAllMembers()" class="uk-button uk-button-default uk-width-1-1"> All Members </button>
    </div>
    <div class="uk-width-1-3">
      <div class="uk-search uk-search-default uk-width-1-1">
        <a v-on:click="searchQuery(query)" class="uk-search-icon-flip" uk-search-icon></a>
        <input v-on:change="searchQuery(query)" v-model="query" class="uk-search-input" type="search" placeholder="Search...">
      </div>
    </div>
    <div class="uk-width-1-3">
      <button v-on:click="setupMemberOperation('New')" class="uk-button uk-button-default uk-width-1-1"> New Member </button>
    </div>
  </div>
  <!--  main-content -->
  <div class="row" uk-grid>
    <!-- list -->
    <div class="uk-width-1-2">
      <bio-list v-bind:indexNo="true" v-on:member="member = $event" v-bind:attendance="true" v-bind:members="members"></bio-list>
    </div>
    <!-- content -->
    <div v-if="member" class="uk-width-1-2">
      <bio-data v-bind:member="member" class="space-15 uk-width-1-1"></bio-data>
      <p class="uk-text-right">Attendance: {{ getFrequency(member).sunAttArr }}</p>
      <div class="row space-10 uk-text-right">
        <button v-on:click="deleteMember(member._id, member._rev)" class="uk-button uk-button-danger"> Delete </button>
        <button v-on:click="setupMemberOperation('Edit')" class="uk-button uk-button-primary"> Edit </button>
      </div>
    </div>
  </div>
  <!-- <div class="row"> -->
    <paginate
    :page-count="pageCount - 1"
    :page-range="3"
    :margin-pages="2"
    :click-handler="paginatePage"
    :prev-text="'Prev'"
    :next-text="'Next'"
    :container-class="'uk-pagination uk-flex-center'"
    :page-class="'uk-active'">
  </paginate>
  <!-- </div> -->
  <!-- modal for member form -->
  <div id="memberForm" class="uk-flex-top" uk-modal>
    <!-- <p style="padding-top: 10%"> New Member Registration </p> -->
    <div class="uk-modal-dialog uk-margin-auto-vertical">
      <div class="uk-modal-header">
        <h2 class="uk-modal-title"> {{ formOp }} Member</h2>
      </div>
      <div class="uk-modal-body" uk-overflow-auto>
        <bio-form v-bind:member="member" v-on:member="applyOperation(formOp, $event)"></bio-form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import UIkit from 'uikit';
import to from 'await-to-js';
// import Logger from 'js-logger';

import BioList from './shared/BioList/BioList';
import BioForm from './shared/BioForm/BioForm';
import BioData from './shared/BioData/BioData';


import DB from '../database';
import utils, {
  logs,
  memberUtils,
  notify,
} from '../utils';
// import member from '../database/member';

const {
  throwError,
} = utils;

const {
  calculateSundaysBack,
  mapMemberToAttendance,
} = memberUtils;

const {
  createMember,
  deleteMember,
  allMembers,
  getMember,
} = DB;

async function rowCounts() {
  const [err, members] = await to(allMembers({}));
  throwError(err);
  return members.total_rows;
}

export default {
  name: 'admin-page',
  components: {
    BioList,
    BioForm,
    BioData,
  },
  data() {
    return {
      // search input query
      query: '',
      // current member id selected
      memberId: 'undefined',
      // current member information
      member: undefined,
      // current list of members displayed
      members: [],
      // form operation
      formOp: 'New',
      debug: [],
      pageCount: 1,
    };
  },
  // props: ['query', 'memberId'],
  methods: {
    /** aplly form operations */
    applyOperation(operName, value) {
      if (operName === 'New') {
        return this.saveMember(value);
      }
      return this.updateMember(value);
    },
    /** paginates the page with the page number */
    async paginatePage(pageNum) {
      console.log({ pageNum });
      let err;
      let members;
      const options = {
        // limit: 10,
      };
      [err, members] = await to(allMembers(options));
      throwError(err);
      if (pageNum > 1) {
        pageNum *= 10;
      } else {
        pageNum = 1;
      }
      options.startKey = members.rows[pageNum - 1].id;
      options.endkey = (members.rows[pageNum + 8]) ? members.rows[pageNum + 8].id : undefined;
      console.log(options);
      options.include_docs = true;
      [err, members] = await to(allMembers(options));
      throwError(err);
      console.log(members.rows.length);
      this.members = members.rows.slice(pageNum - 1, pageNum + 9).map(e => e.doc)
        .filter(e => (e.firstname && e.lastname));
      console.log(this.members.length);
    },
    /** retrieves all the members in the database */
    async getAllMembers() {
      let err;
      let count;
      try {
        [err, count] = await to(rowCounts());
        throwError(err);
        if (Math.floor(count % 10) > 0) {
          count -= Math.floor(count % 3);
        }
        this.pageCount = Math.ceil(count / 10);
        this.paginatePage(0);
      } catch (e) {
        this.handleErr('error retrieving all members', e);
      }
    },
    /** search for the members with the query  */
    async searchQuery(query) {
      try {
        const regx = new RegExp(`^${query}`, 'i');
        const [err, members] = await to(allMembers({
          include_docs: true,
        }));
        throwError(err);
        const filterdMembers = members.rows.filter((member) => {
          const values = Object.values(member.doc)
            .filter(e => (e))
            .map(v => regx.test(v.toString().toLowerCase()));
          return values.includes(true);
        }).map(e => e.doc).slice(0, 30);
        this.members = filterdMembers;
        // members
      } catch (e) {
        this.handleErr('error while searching', e.message);
      }
    },
    /** getthe frequency of attendance of the member */
    getFrequency(member) {
      const sundays = calculateSundaysBack(4);
      return mapMemberToAttendance(member, sundays);
    },
    /** deletes the member that matches the id */
    async deleteMember(_id, _rev) {
      try {
        const [err, value] = await to(deleteMember({
          _id,
          _rev,
        }));
        logs.debug({
          err,
          value,
        });
        throwError(err);
        this.resetSetup();
      } catch (e) {
        this.handleErr(`Error Deleting Member ${_id}`, e.message);
      }
    },
    /** saves the member information */
    async saveMember(member) {
      let err;
      let value;
      try {
        member = Object.assign({}, {
          _id: `${await rowCounts() + 1}`,
        }, member); // eslint-disable-line
        console.log({ member });
        [err, value] = await to(createMember(member));
        logs.debug({
          err,
          member,
          value,
        });
        throwError(err);
        [err, value] = await to(getMember(member._id)); // eslint-disable-line
        throwError(err);
        this.member = member;
        this.getAllMembers();
        UIkit.modal('#memberForm').hide();
      } catch (e) {
        logs.debug({
          e,
        });
        this.handleErr('Error Saving Member', e.message);
      }
    },
    /** handles the error by displaying */
    handleErr(title, err) {
      notify.error(title, err);
    },
    /** opens modal to perform operation speciefied */
    setupMemberOperation(operName) {
      this.formOp = operName;
      UIkit.modal('#memberForm').show();
    },
    updateMember(value) {
      value = Object.assign({}, this.member, value);
      logs.debug(value);
      this.saveMember(value);
    },
    resetSetup() {
      this.getAllMembers();
      this.member = undefined;
    },
  },
  created() {
    this.getAllMembers();
  },
};
</script>

<style>
.space-10 {
  padding-top: 5%;
}

.space-15 {
  padding-top: 15%;
}
</style>
