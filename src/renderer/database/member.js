// import {
//   // throwError,
//   logs,
// } from '../utils';

/**
 * initalize the members database
 */
const memberDb = window.require('electron').remote.getGlobal('memberDB');
// setup indexs


// retrieves a single member
const getMember = memberDb.get;
// querys and search members
async function findMembers(query) {
  return memberDb.createIndex({
    index: {
      fields: ['firstname', 'lastname', 'phoneNo', 'no',
        'level', 'department', 'student', 'visitor'],
    },
  }).then(() => memberDb.find({
    selector: query,
  })).then(val => val.docs);
}
// create new member
const createMember = memberDb.put;
// delete member
const deleteMember = memberDb.remove;
// all members
const allMembers = memberDb.allDocs;

export default {
  getMember,
  findMembers,
  createMember,
  deleteMember,
  allMembers,
};
