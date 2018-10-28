import { ApiFormat, Migration } from '@elizer/shared';
import { migratePrototype } from 'libs/migration';
import electronDB from 'libs/rxdb/electron';

const { Prototype } = Migration;

// routes navigable by setting ctx: method
export const migrationRoutes = [Prototype];

/**
 * the follow up routes for attendance statics
 *
 * @param {ApiFormat<any, Partial<FindQueryParams>>} ctx
 */
export async function migrationRoute(
  ctx: ApiFormat<any, any>
) {
  const [err, db] = await electronDB;
  switch (ctx.method) {
    case Prototype:
      return await migratePrototype(db, ctx);
    default:
      break;
  }
}




