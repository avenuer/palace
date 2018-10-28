import { RxCollection } from "rxdb";
import { Member, Attendance, AttendanceStatus, ApiFormat, FindQueryApi, RegisterQuery, RegisterAttendance, FindQueryResponse, ApiStatus } from "@elizer/shared";
import { DBKollections } from "libs/rxdb/interface";


/**
 * returns the history of the numbers passed and attendance status
 *
 * @export
 * @param {DBKollections} db
 * @param {ApiFormat<RegisterQuery, FindQueryApi>} ctx
 * @returns {Promise<Partial<FindQueryResponse<T>>>}
 */
export async function registerHistory(db: DBKollections, ctx: ApiFormat<RegisterQuery, FindQueryApi>): Promise<Partial<FindQueryResponse<RegisterAttendance>>> {
    console.log('called-regisetr');
    try {
        const members = await numberedMember(db.member, ctx.data);
    const attendance = await dateAttendances(db.attendance, ctx.data);
    const data = members.map((m) => {
        return <RegisterAttendance>{
            owner: m.id,
            name: m.name,
            gender: m.gender,
            phoneNo: m.phoneNo,
            churchNo: m.churchNo,
            date: ctx.data.date,
            status: attendanceDateStatus(m, attendance)
        }
    });
    return {
        data,
        reqId: ctx.id,
        time: Date.now(),
        status: ApiStatus.Success
    }
    } catch (error) {
       return  {
           error: (error as Error).message,
           status: ApiStatus.Failure,
           time: Date.now(),
           reqId: ctx.id
       }
    }
}


/**
 * maps the member to their attendance status
 *
 * @param {Member} member
 * @param {AttendanceMap} attendance
 * @returns
 */
function attendanceDateStatus(member: Member, attendance: AttendanceMap) {
    return attendance.hasOwnProperty(member.id as string) ? AttendanceStatus.Present : AttendanceStatus.Absent;
}


/**
 * retrieve the members that matches the function
 *
 * @param {RxCollection<Member>} koll
 * @param {RegisterQuery} query
 * @returns
 */
async function numberedMember(koll: RxCollection<Member>, query: RegisterQuery) {
    const users = await koll.find({ }).exec().then(e => e.map(f => f.toJSON()));
    return users.filter((e) => query.no.includes(Number(e.churchNo)));
}

interface AttendanceMap {
    [key: string]: Attendance
}


/**
 * maps the attendance to an object
 *
 * @export
 * @param {RxCollection<Attendance>} koll
 * @param {RegisterQuery} { date }
 * @returns
 */
export async function dateAttendances(koll: RxCollection<Attendance>, { date }: RegisterQuery) {
    const holder: AttendanceMap = {};
    const dateAttendance = await koll.find({ date }).exec().then(e => e.map(f => f.toJSON()));
    dateAttendance.forEach(e => {
        holder[e.owner] = e;
    })
    return holder;
}