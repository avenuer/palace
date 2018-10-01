import electronDB from "libs/rxdb/electron";
import {
  FollowUpStatic,
  ApiFormat,
  FindQueryParams,
  Member,
  EntityModelNames,
  FindQueryResponse,
  ApiStatus,
  MemberAttendanceQuery,
  OtherQueryResponse,
  Attendance,
  MemberFollowUpGraph
} from "@elizer/shared";
import { find } from "./models/orm";
import { DBKollections } from "../rxdb/interface";
import { memberAttendMaps, MembersAttendance } from "libs/followup/attendance";
import { attendanceStatusDaysIntervals } from "../followup";
import { count } from "rxjs/operators";
import { RxDocument } from "rxdb";
import { fQD } from "./models/find-search";

const { Find, Retrieve, MemberGraph } = FollowUpStatic;

// routes navigable by setting ctx: method
export const followupRoutes = [Find, Retrieve, MemberGraph];

/**
 * the follow up routes for attendance statics
 *
 * @param {ApiFormat<any, Partial<FindQueryParams>>} ctx
 */
export async function followUpRoutes(
  ctx: ApiFormat<any, any>
) {
  const [err, db] = await electronDB;
  switch (ctx.method) {
    case Find:
      return await membersStatic(db, ctx);
    case MemberGraph:
      return await memberGraphAttendance(db, ctx);
    default:
      break;
  }
}


/**
 * mapps the status per date selected for followup home page
 *
 * @param {DBKollections} db
 * @param {ApiFormat<MemberAttendanceQuery, Partial<FindQueryParams>>} ctx
 * @returns {Promise<FindQueryResponse<MembersAttendance>>}
 */
async function membersStatic(
  db: DBKollections,
  ctx: ApiFormat<MemberAttendanceQuery, Partial<FindQueryParams>>
): Promise<FindQueryResponse<MembersAttendance>> {
  try {
    // getting headers for find query
    const { headers, ...ctxOptions } = ctx;
    // getting the selected date and mapping query
    const { selectedDate, ...query } = ctxOptions.data;
    // changing query for headers back
    ctxOptions.data = query;
    const { data, error, ...others } = await find(db.member, {
      ...ctxOptions,
      headers: { name: EntityModelNames.Member, query: headers }
    });
    if (data) {
      const attends = await attendances(db, data);
      const followStats = await memberAttendMaps(data, attends, selectedDate);
      return {
        data: followStats,
        ...others as any
      };
    }
    throw new Error(error);
  } catch (error) {
    return {
      reqId: ctx.id,
      limit: fQD.limit,
      skip: fQD.skip,
      total: 0,
      error: (error as Error).message,
      status: ApiStatus.Failure,
      time: Date.now()
    };
  }
}

/**
 * retrieve attendances for the members with the id
 *
 * @param {DBKollections} db
 * @param {Member[]} members
 * @returns
 */
async function attendances(db: DBKollections, members: Member[]) {
  const ids = members.map(e => e.id as string);
  return await db.attendance
    .find({})
    .exec()
    .then(e => e.map(e => e.toJSON()));
}


export async function memberGraphAttendance(
  db: DBKollections,
  ctx: ApiFormat<MemberFollowUpGraph, any>
): Promise<OtherQueryResponse<Partial<Attendance>[]>> {
  const { data } = ctx;
  const count = data.count || 5;
  const interval = data.interval || 7;
  const date = data.selectedDate || Date.now();
  
  try {
    const attendance = selectAttendanceCount(
      await db.attendance.find({ owner: data.ownerId }).exec(),
      count
    );
    return {
      data: attendanceStatusDaysIntervals(attendance, count, date, interval),
      reqId: ctx.id,
      status: ApiStatus.Success,
      time: Date.now()
    };
  } catch (error) {
    return {
      error: (error as Error).message,
      reqId: ctx.id,
      status: ApiStatus.Failure,
      time: Date.now()
    };
  }
}

/** sorts and selectes a portion of the attendance array */
function selectAttendanceCount(
  attendance: RxDocument<Attendance, {}>[],
  count: number
) {
  return attendance
    .map(attends => attends.toJSON())
    .sort((a, b) => b.date - a.date)
    .splice(0, count);
}
