import { ApiFormat, CrudMethod, ModelHeaders } from "@elizer/shared";
import { create, find, retrieve, remove, update } from "./orm";
import electronDB from "libs/rxdb/electron";
import { throwError } from "@elizer/screwbox";

const { Create, Delete, Update, Retrieve, Find } = CrudMethod;
export const ormRoutes = [Create, Delete, Update, Retrieve, Find];

export async function modelOrmRoutes(ctx: ApiFormat<any, ModelHeaders<any>>) {
  const [err, db] = await electronDB;
  throwError(err);
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
