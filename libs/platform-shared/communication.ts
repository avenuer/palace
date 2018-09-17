import { ApiMethod, EntityModelNames, CrudMethod, ApiStatus, FollowUpStatic } from "./constant";
import * as uuid from "uuid/v1";
import { Member } from "./models";

export interface BaseResponse {
  time: number;
  status: ApiStatus;
  reqId: string;
}

export interface ApiFormat<T, K> {
  id: string;
  method: ApiMethod | CrudMethod | FollowUpStatic;
  data: T;
  event: EventBus;
  headers: K;
}

export function apiFactory<T, K>(
  method: ApiMethod | CrudMethod | FollowUpStatic,
  data: T,
  headers: K
): ApiFormat<T, K> {
  return {
    method,
    data,
    headers,
    event: EventBus.Request,
    id: uuid()
  };
}

export enum EventBus {
  Request = "Request",
  Response = "Response"
}

export interface FindQueryParams {
  limit: number;
  skip: number;
  sort: string;
}

export interface FindQueryResponse<T> extends BaseResponse {
  limit: number;
  skip: number;
  total: number;
  data?: T[];
  error?: string;
}

export interface OtherQueryResponse<T> extends BaseResponse {
  data?: T;
  error?: string;
  time: number;
  status: ApiStatus;
}

export interface UpdateQueryParams {
  id: string;
}

export interface ModelHeaders<T> {
  name: EntityModelNames;
  query?: T;
}

export type FindQueryApi = ModelHeaders<Partial<FindQueryParams>>;

export type UpdateQueryApi = ModelHeaders<Partial<any>>;

export interface MemberAttendanceQuery extends Member {
  selectedDate?: number;
}