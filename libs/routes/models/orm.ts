import {
  defaultPreInsert,
  EmbeddedRxDBError,
  updateBaseModel
} from "@elizer/rxdb";
import { throwError } from "@elizer/screwbox";
import {
  ApiFormat,
  ApiStatus,
  BaseModel,
  FindQueryParams,
  FindQueryResponse,
  ModelHeaders,
  OtherQueryResponse,
  UpdateQueryApi
} from "@elizer/shared";
import { RxCollection } from "rxdb";
import { findDocs, searchDocs, fQD } from "./find-search";

export type FindQueryApi = ModelHeaders<Partial<FindQueryParams>>;

export async function find<T>(
  koll: RxCollection<T>,
  ctx: ApiFormat<any, FindQueryApi>
): Promise<Partial<FindQueryResponse<T>>> {
  try {
    const ctxQuery: Partial<T> =
      typeof ctx.data === "object" ? ctx.data : ({} as any);
    const headers = ctx.headers.query || {};
    const { data, total, skip, limit } = await searchOrQuery<T>(
      koll,
      ctxQuery,
      headers
    );
    return {
      data,
      total,
      limit,
      skip,
      reqId: ctx.id,
      status: ApiStatus.Success,
      time: Date.now()
    };
  } catch (error) {
    return {
      reqId: ctx.id,
      limit: fQD.limit,
      skip: fQD.skip,
      total: 0,
      error: new EmbeddedRxDBError(error).message,
      status: ApiStatus.Failure,
      time: Date.now()
    };
  }
}

/** checks if the query is meant to be a search or not either is mapped accordingly */
function searchOrQuery<T>(
  koll: RxCollection<T>,
  queryObj: object,
  ctm: Partial<FindQueryParams> = {}
) {
  console.log(queryObj, queryObj.hasOwnProperty("$search"));
  if (queryObj.hasOwnProperty("$search")) {
    return searchDocs(koll, queryObj as any, ctm);
  }
  return findDocs(koll, queryObj, ctm);
}

const noDocError = new Error(`document requested missing or not available`);

export async function retrieve<T>(
  koll: RxCollection<T>,
  ctx: ApiFormat<string, any>
): Promise<OtherQueryResponse<T>> {
  try {
    const doc = await koll
      .findOne({ id: ctx.data })
      .exec()
      .then(e => (e ? e.toJSON() : throwError(noDocError)));
    return {
      data: doc as any,
      reqId: ctx.id,
      status: ApiStatus.Success,
      time: Date.now()
    };
  } catch (error) {
    return {
      error: new EmbeddedRxDBError(error).message,
      reqId: ctx.id,
      status: ApiStatus.Failure,
      time: Date.now()
    };
  }
}

export async function create<T>(
  koll: RxCollection<T>,
  ctx: ApiFormat<T, any>
): Promise<OtherQueryResponse<T>> {
  try {
    const newData = await koll.insert(defaultPreInsert(ctx.data));
    return {
      data: newData.toJSON(),
      reqId: ctx.id,
      status: ApiStatus.Success,
      time: Date.now()
    };
  } catch (error) {
    return {
      error: new EmbeddedRxDBError(error).message,
      reqId: ctx.id,
      status: ApiStatus.Failure,
      time: Date.now()
    };
  }
}

const noIdError = new Error(`Id is required for update`);

export async function update<T extends BaseModel>(
  koll: RxCollection<T>,
  ctx: ApiFormat<T, UpdateQueryApi>
) {
  try {
    const updatedDoc = await koll.upsert(updateBaseModel<T>(ctx.data));
    return {
      data: updatedDoc.toJSON(),
      reqId: ctx.id,
      status: ApiStatus.Success,
      time: Date.now()
    };
  } catch (error) {
    return {
      error: new EmbeddedRxDBError(error).message,
      reqId: ctx.id,
      status: ApiStatus.Failure,
      time: Date.now()
    };
  }
}
export async function remove<T extends BaseModel>(
  koll: RxCollection<T>,
  ctx: ApiFormat<string, UpdateQueryApi>
) {
  try {
    if (ctx.data && ctx.data) {
      const doc = await koll
        .findOne({ id: ctx.data })
        .exec()
        .then(e => (e ? e.remove() : false));
      return {
        data: doc,
        reqId: ctx.id,
        status: ApiStatus.Success,
        time: Date.now()
      };
    }
    throwError(noIdError);
  } catch (error) {
    return {
      error: new EmbeddedRxDBError(error).message,
      reqId: ctx.id,
      status: ApiStatus.Failure,
      time: Date.now()
    };
  }
}
