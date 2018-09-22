import { ApiFormat, CrudMethod, ModelHeaders } from '@elizer/shared';
import { create, find, retrieve, remove, update } from './orm';
// tslint:disable-next-line:import-name
import electronDB from 'libs/rxdb/electron';
import { throwError } from '@elizer/screwbox';
import { logger } from '@elizer/rxdb';

const { Create, Delete, Update, Retrieve, Find } = CrudMethod;
export const ormRoutes = [Create, Delete, Update, Retrieve, Find];

export async function modelOrmRoutes(ctx: ApiFormat<any, ModelHeaders<any>>) {
  const [err, db] = await electronDB;
  throwError(err);
  logger.info({message: '', trace: '' }, ctx.method);
  switch (ctx.method) {
    case CrudMethod.Find:
      return find((db as any)[ctx.headers.name], ctx);
    case CrudMethod.Retrieve:
      return retrieve((db as any)[ctx.headers.name], ctx);
    case CrudMethod.Create:
      return create((db as any)[ctx.headers.name], ctx);
    case CrudMethod.Update:
      return update((db as any)[ctx.headers.name], ctx);
    case CrudMethod.Delete:
      return remove((db as any)[ctx.headers.name], ctx);
    default:
      break;
  }
}
