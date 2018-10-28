import { attendanceStatusDaysIntervals } from './member';
import {
    ApiFormat,
    ApiStatus,
    Attendance,
    MemberFollowUpGraph,
    OtherQueryResponse
    } from '@elizer/shared';
import { DBKollections } from 'libs/rxdb/interface';
import { RxDocument } from 'rxdb';

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