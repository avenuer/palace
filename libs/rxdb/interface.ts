import { RxCollection, RxDatabase } from 'rxdb';
import { Attendance, Member } from '@elizer/shared';

/**
 * export interface for the rxcollection provided
 * in the database created
 *
 * @export
 * @interface OfflineDB
 */
export interface OfflineDB {
  attendance: RxCollection<Attendance>;
  member: RxCollection<Member>;
}


/**
 * interface mapping the mainframe object to its key value type info
 *
 * @interface DBKollections
 */
export interface DBKollections extends RxDatabase {
  attendance: RxCollection<Attendance>;
  member: RxCollection<Member>;
}
