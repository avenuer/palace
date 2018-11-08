import { ApiStatus, ApiFormat, OtherQueryResponse } from "@elizer/shared";

export function successResponse<T>(ctx: ApiFormat<any, any>, res: T): OtherQueryResponse<T> {
    return {
      data: res,
      reqId: ctx.id,
      status: ApiStatus.Success,
      time: Date.now()
    };
  }
  
  export function failureResponse(ctx: ApiFormat<any, any>, error: Error): OtherQueryResponse<any> {
    return {
      error: error.message,
      reqId: ctx.id,
      status: ApiStatus.Failure,
      time: Date.now()
    };
  }
  