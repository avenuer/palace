import { RxCollection } from "rxdb";
import {
  Member,
  Attendance,
  ApiFormat,
  FindQueryParams,
  FindQueryResponse,
  ApiStatus,
  DateFormat,
  TotalAttendanceStatics,
  AttendanceStatics,
  MemberCategories
} from "@elizer/shared";
import { DBKollections } from "libs/rxdb/interface";
import { fQD } from "libs/routes/models/find-search";
import { format } from "date-fns";

/**
 * summated the user members to various date attendances
 *
 * @export
 * @param {DBKollections} db
 * @param {ApiFormat<Partial<Member>, FindQueryParams>} ctx
 */
export async function dateAttendanceSummation(
  db: DBKollections,
  ctx: ApiFormat<Partial<Member>, FindQueryParams>
): Promise<Partial<FindQueryResponse<TotalAttendanceStatics>>> {
  const limit = ctx.headers.limit || fQD.limit;
  const skip = ctx.headers.skip || fQD.skip;
  try {
    const data = attendanceMapToArray(
      await dateAttendanceTotals(
        db.attendance,
        await mapMember(db.member, ctx.data)
      )
    );
    console.log(data);
    return {
      limit,
      skip,
      data: data.slice(skip, skip + limit),
      total: data.length,
      reqId: ctx.id,
      status: ApiStatus.Success,
      time: Date.now()
    };
  } catch (error) {
    return {
      error: (error as Error).message,
      reqId: ctx.id,
      time: Date.now(),
      status: ApiStatus.Failure
    };
  }
}

interface MemberMap {
  [key: string]: Member;
}

/**
 * maps members to an object map
 *
 * @param {RxCollection<Member>} koll
 * @param {Partial<Member>} query
 * @param {Partial<FindQueryParams>} [fqp={}]
 * @returns
 */
async function mapMember(koll: RxCollection<Member>, query: Partial<Member>) {
  const holder: MemberMap = {};
  const members = await koll.find(query).exec();
  members.forEach(m => {
    holder[m.id as string] = m.toJSON();
  });
  return holder;
}

interface TotalAttendaceMap {
  [key: number]: AttendanceStatics;
}

/**
 * return a map of attedance date to object
 *
 * @param {RxCollection<Attendance>} koll
 * @param {MemberMap} members
 * @returns
 */
async function dateAttendanceTotals(
  koll: RxCollection<Attendance>,
  members: MemberMap
) {
  const attendaceMap: TotalAttendaceMap = {};
  const attendace = await koll.find({}).exec();
  attendace.forEach(e => {
    const member = members[e.owner];
    if (member) {
      attendaceMap[e.date] = calculateStat(attendaceMap[e.date], member);
    }
  });
  return attendaceMap;
}

/**
 * retuns the converted object to array
 *
 * @param {TotalAttendaceMap} attendance
 * @returns {TotalAttendanceStatics[]}
 */
function attendanceMapToArray(
  attendance: TotalAttendaceMap
): TotalAttendanceStatics[] {
  return Object.keys(attendance).map(e => {
    return {
      ...attendance[e as any],
      date: format(Number(e), DateFormat)
    };
  });
}

/**
 * does collation of the members statics
 *
 * @param {AttendanceStatics} dateStat
 * @param {Member} member
 * @returns {AttendanceStatics}
 */
function calculateStat(
  dateStat: AttendanceStatics,
  member: Member
): AttendanceStatics {
  if (dateStat) {
    let stats = genderStat(dateStat, member);
    stats = categoryStat(stats, member);
    return stats;
  }
  return calculateStat(
    {
      total: 0,
      male: 0,
      female: 0,
      adults: 0,
      children: 0,
      teenager: 0,
      youth: 0
    },
    member
  );
}


/**
 * calculates the gender statics
 *
 * @param {AttendanceStatics} dateStat
 * @param {Member} member
 * @returns {AttendanceStatics}
 */
function genderStat(
  dateStat: AttendanceStatics,
  member: Member
): AttendanceStatics {
  if (member.gender.toLowerCase() === "female") {
    dateStat.female += 1;
  } else {
    dateStat.male += 1;
  }
  return dateStat;
}


/**
 * calculates the categories statics
 *
 * @param {AttendanceStatics} dateStat
 * @param {Member} member
 * @returns {AttendanceStatics}
 */
function categoryStat(
  dateStat: AttendanceStatics,
  member: Member
): AttendanceStatics {
  switch (member.category) {
    case MemberCategories.Adult: {
      dateStat.adults += 1;
    }
    case MemberCategories.Youth: {
      dateStat.youth += 1;
    }
    case MemberCategories.Teenager: {
      dateStat.teenager += 1;
    }
    case MemberCategories.Children: {
      dateStat.children += 1;
    }
    default:
      break;
  }
  return dateStat;
}
