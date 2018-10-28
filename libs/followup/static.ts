import { DBKollections } from '../rxdb/interface';
import { memberAttendMaps, MembersAttendance } from 'libs/followup/attendance';
import { fQD } from 'libs/routes/models/find-search';
import { find } from 'libs/routes/models/orm';
import {
    ApiFormat,
    ApiStatus,
    EntityModelNames,
    FindQueryParams,
    FindQueryResponse,
    FollowUpStatic,
    Member,
    MemberAttendanceQuery,
    } from '@elizer/shared';

const { Find, Retrieve, MemberGraph } = FollowUpStatic;

// routes navigable by setting ctx: method
export const followupRoutes = [Find, Retrieve, MemberGraph];

/**
 * mapps the status per date selected for followup home page
 *
 * @param {DBKollections} db
 * @param {ApiFormat<MemberAttendanceQuery, Partial<FindQueryParams>>} ctx
 * @returns {Promise<FindQueryResponse<MembersAttendance>>}
 */
export async function membersStatic(
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