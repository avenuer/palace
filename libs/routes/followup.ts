import { ApiFormat, FollowUpStatic } from '@elizer/shared';
import { memberGraphAttendance, membersStatic, registerHistory, dateAttendanceSummation } from 'libs/followup';
import electronDB from 'libs/rxdb/electron';


const { Find, Retrieve, MemberGraph, RegisterHistory, TotalAttendanceHistory } = FollowUpStatic;

// routes navigable by setting ctx: method
export const followupRoutes = [Find, Retrieve, MemberGraph, RegisterHistory, TotalAttendanceHistory];

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
    case RegisterHistory:
      return await registerHistory(db, ctx);
    case TotalAttendanceHistory:
      return await dateAttendanceSummation(db, ctx);
    default:
      break;
  }
}




