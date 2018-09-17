import { Member, Attendance, AttendanceStatus } from "@elizer/shared";

interface CollatedAttendance {
  lastAttendance: number;
  totalAttendance: number;
  selectedDate: string;
}

type Collation = {
  [key: string]: CollatedAttendance;
};

export type MembersAttendance = Member & CollatedAttendance;

/**
 * Collates the attendance by grouping and comparing dates
 *
 * @export
 * @param {Attendance[]} attends
 * @returns
 */
export function attendanceKeysMap(attends: Attendance[], selectedDate = Date.now()) {
  const memberStatic: Collation = {};
  for (const attd of attends) {
    if (memberStatic.hasOwnProperty(attd.owner as string)) {
      const { lastAttendance, totalAttendance } = memberStatic[attd.owner as string];
      memberStatic[attd.owner as string] = {
        totalAttendance: totalAttendance + 1,
        selectedDate: (attd.date === selectedDate) ? 'Present' : 'Absent',
        lastAttendance: lastAttendance > attd.date ? lastAttendance : attd.date
      };
    } else {
      memberStatic[attd.owner as string] = {
        lastAttendance: attd.date,
        totalAttendance: 1,
        selectedDate: (attd.date === selectedDate) ? 'Present' : 'Absent'
      };
    }
  }
  return memberStatic;
}


/**
 * maps the attendance and members together
 *
 * @export
 * @param {Member[]} members
 * @param {Attendance[]} attendance
 * @returns {MembersAttendance[]}
 */
export function memberAttendMaps(members: Member[], attendance: Attendance[], date = Date.now()): MembersAttendance[] {
    const memberAttedMap = attendanceKeysMap(attendance, date);
    return members.map(mem => {
        return {
            ...mem,
            ...memberAttedMap[mem.id as string] || { totalAttendance: 0, lastAttendance: 'Never' }
        }
    });
}