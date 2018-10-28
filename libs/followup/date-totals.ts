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
  AttendanceStatics
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
async function mapMember(
  koll: RxCollection<Member>,
  query: Partial<Member>
) {
  const holder: MemberMap = {};
  const members = await koll
    .find(query)
    .exec();
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
  return Object.keys(attendance).map((e) => {
    return {
      ...attendance[e as any],
      date: format(Number(e), DateFormat)
    }
  })
}

/**
 * does addition base on gender of the members
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
    if (member.gender.toLowerCase() === "female") {
      dateStat.female += 1;
    } else {
      dateStat.male += 1;
    }
    dateStat.total += 1;
    return dateStat;
  }
  return calculateStat({ total: 0, male: 0, female: 0 }, member);
}
