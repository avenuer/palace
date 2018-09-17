import { subDays, getDate, format } from 'date-fns';
import { DateFormat, Attendance, AttendanceStatus } from '@elizer/shared';
import { difference } from 'lodash';

// calulates the previous same days in the past
export function sameDaysInPreviousWeeks(count = 5, date?: number) {
    const days: number[] = [];
    const selectedDate =  date || Date.now()
    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < count; i++) {
        days.push(getDate(format(subDays(selectedDate, i * 7), DateFormat)));
    }
    return days;
}

// checks attendace status of previous weekdays of the same day
export function attendanceStatusOnSameDaysInPreviousWeeks(attendance: Attendance[], weeksCount: number): Partial<Attendance>[] {
    const dates = sameDaysInPreviousWeeks(weeksCount);
    const attendanceDates = attendance.map(e => e.date);
    const datesDiff = difference(dates, attendanceDates);
    return dates.map((date) => {
        let attd: Partial<Attendance>;
        if (datesDiff.indexOf(date) < 0 ) {
            attd = { date, attendance: AttendanceStatus.Absent as any };
        } else {
            attd = { date, attendance: AttendanceStatus.Present as any};
        }
        return attd;
    })
}