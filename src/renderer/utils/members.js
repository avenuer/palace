import moment from 'moment';
import { pick, difference } from 'lodash'; // eslint-disable-line
import { logs } from '../utils';

export function formatDate(date) {
  return {
    date: date.format('Do/MM/YYYY'),
    time: date.format('HH:mm A'),
  };
}

export default {
  // format Date
  /** calculates and return an array of sundays from the present day */
  calculateSundaysBack(sundayCount) {
    const lastSundayDate = moment().subtract(moment().day(), 'day');
    const sundays = [lastSundayDate.toISOString()];
    for (let i = 1; i < sundayCount; i++) { // eslint-disable-line
      sundays.push(lastSundayDate.subtract(i * 7, 'day').toISOString());
    }
    return sundays;
  },
  /** map every member to an attendance format */
  mapMembersToAttendance(members, sundays) {
    return members.map(m => this.mapMembersToAttendance(m, sundays));
  },
  /** map member to attendance format */
  mapMemberToAttendance(member, sundays) {
    member = { sundays: [], ...member };
    logs.debug({ member: member.sundays, sundays });
    member.name = member.firstName + member.lastName;
    member.sundays = member.sundays.splice(member.sundays.length - sundays.length);
    member.sundays = member.sundays.map(e => formatDate(moment(e)).date);
    sundays = sundays.map(e => formatDate(moment(e)).date);
    const diff = difference(sundays, member.sundays); // days not present
    member.sunAttArr = sundays.map(e => (diff.indexOf(e) < 0) ? 'P' : 'A').reverse(); // eslint-disable-line
    return pick(member, '_id', 'name', 'sunAttArr');
  },
};
