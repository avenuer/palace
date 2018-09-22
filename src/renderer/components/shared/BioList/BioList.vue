<template>
<div class="uk-text-left">
  <ul class="uk-list uk-list-divider">
    <li class=" uk-animation-slide-right" v-for="(member, index) in members" v-bind:key="member.id" v-on:click="emit(member)">
      <span v-if="!indexNo"> {{ index + 1 }} </span>
      <span v-if="indexNo"> {{ no(member._id) }}  </span>
      {{ member.firstname }} {{ member.lastname }}

      <span v-if="attendance && !member.visitor">
        {{ calAttendance(member) }}
      </span>
      <span v-if="member.visitor">
        {{ 'v' }}
      </span>
    </li>
  </ul>
</div>
</template>

<script>

import memberUtils from '../../../utils/members';

export default {
  name: 'bio-list',
  props: ['members', 'attendance', 'indexNo'],
  methods: {
    no(nostring) {
      let pared = 0;
      try {
        pared = parseInt(nostring, 10);
      } catch (error) {
        pared = 0;
      }
      return pared;
    },
    emit(member) {
      this.$emit('member', member);
    },
    calAttendance(member) {
      const sundays = memberUtils.calculateSundaysBack(4);
      let absentCount = 0;
      memberUtils.mapMemberToAttendance(member, sundays).sunAttArr.forEach((s) => {
        if (s === 'A') {
          absentCount += 1;
        }
      });
      return `${absentCount}A`;
    },
  },
};
</script>
