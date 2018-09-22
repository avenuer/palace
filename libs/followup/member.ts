import { subDays, format } from "date-fns";
import { Attendance, AttendanceStatus } from "@elizer/shared";
import { difference } from "lodash";

// calulates the previous same days in the past
export function sameDaysInPreviousWeeks(
  count = 5,
  interval = 7,
  date = Date.now()
) {
  const days: number[] = [];
  // tslint:disable-next-line:no-increment-decrement
  for (let i = 0; i < count; i++) {
    days.push(Number(format(subDays(date, i * interval), "x")));
  }
  return days;
}

// checks attendace status on previous intervals of the same day
export function attendanceStatusDaysIntervals(
  attendance: Attendance[],
  count: number,
  date: number,
  interval = 7
): Partial<Attendance>[] {
  const dates = sameDaysInPreviousWeeks(count, interval, date);
  const attendanceDates = attendance.map(e => e.date);
  const datesDiff = difference(dates, attendanceDates);
  return dates.map(date => {
    let attd: Partial<Attendance>;
    if (datesDiff.includes(date)) {
      attd = { date, attendance: AttendanceStatus.Absent as any };
    } else {
      attd = { date, attendance: AttendanceStatus.Present as any };
    }
    return attd;
  });
}

/** attendace status as defined for day of previous week */
export const attendanceStatusOnSameDaysInPreviousWeeks = (
  attendance: Attendance[],
  weeksCount: number,
  date = Date.now()
) => attendanceStatusDaysIntervals(attendance, weeksCount, date, 7);
