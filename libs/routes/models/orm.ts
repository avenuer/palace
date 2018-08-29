import { RxCollection, RxQuery, RxDocument, RxError } from "rxdb";
import {
  ApiFormat,
  ModelHeaders,
  FindQueryParams,
  UpdateQueryApi,
  BaseModel,
  FindQueryResponse,
  ApiStatus,
  OtherQueryResponse
} from "@elizer/shared";
import { to } from "await-to-js";
import {
  updateBaseModel,
  defaultPreInsert,
  EmbeddedRxDBError
} from "@elizer/rxdb";
import { map } from "rxjs/operators";
import { throwError } from "@elizer/screwbox";

export type FindQueryApi = ModelHeaders<Partial<FindQueryParams>>;

const fQD: FindQueryParams = {
  limit: 15,
  skip: 0,
  sort: "id"
};

export async function find<T>(
  koll: RxCollection<T>,
  ctx: ApiFormat<any, FindQueryApi>
): Promise<FindQueryResponse<T>> {
  try {
    const param: Partial<T> =
      typeof ctx.data === "object" ? ctx.data : ({} as any);
    const query = koll.find(koll);
    const total = await countQuery<T>(query);
    let headers = ctx.headers.query || {};
    const data = await findQuery<T>(query, { ...fQD, ...headers } as any);
    return {
      data,
      total,
      reqId: ctx.id,
      limit: fQD.limit,
      skip: fQD.skip,
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

async function findQuery<T>(
  query: RxQuery<T, RxDocument<T, {}>[]>,
  custom: FindQueryParams
) {
  return await query
    .sort(custom.sort)
    .skip(custom.skip)
    .limit(custom.limit)
    .exec()
    .then(e => e.map(e => e.toJSON()));
}

async function countQuery<T>(query: RxQuery<T, RxDocument<T, {}>[]>) {
  return await query.exec().then(e => e.length);
}

const noDocError = new Error(`document requested missing or not available`);

export async function retrieve<T>(
  koll: RxCollection<T>,
  ctx: ApiFormat<any, any>
): Promise<OtherQueryResponse<T>> {
  try {
    const data: Partial<T> =
      typeof ctx.data === "object" ? ctx.data : ({} as any);
    const doc = await koll.findOne(data).exec();
    if (!doc) {
      throwError(noDocError);
    }
    return {
      data: data as any,
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
    const data = defaultPreInsert(ctx.data);
    const newData = await koll.insert(ctx.data);
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
  ctx: ApiFormat<T, UpdateQueryApi>
) {
  try {
    if (ctx.data && ctx.data.id) {
      const doc = await koll
        .findOne({ id: ctx.data.id })
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
