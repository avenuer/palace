<template>
<div class="uk-text-left">
  <ul class="uk-list uk-list-divider">
    <li v-for="(member, index) in members" v-bind:key="member.id" v-on:click="emit(member)">
      {{ index + 1 }}
      <!-- {{ member._id }}  -->
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
  props: ['members', 'attendance'],
  methods: {
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
