import { ApiMethod, EntityModelNames, CrudMethod, ApiStatus, FollowUpStatic, AttendanceStatus, Migration, Security } from "./constant";
import * as uuid from "uuid/v1";
import { Member } from "./models";

export interface BaseResponse {
  time: number;
  status: ApiStatus;
  reqId: string;
}

type Method = ApiMethod | CrudMethod | FollowUpStatic | Migration | Security;

export interface ApiFormat<T, K> {
  id: string;
  method: Method;
  data: T;
  event: EventBus;
  headers: K;
}

export function apiFactory<T, K>(
  method: Method,
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
export interface MemberFollowUpGraph {
  ownerId: string;
  selectedDate: number;
  interval?: number | 7;
  count?: number | 5;
}

export interface Search {
    $search: string;
}

export type SearchQuery<T> = Search & Partial<T>

export interface RegisterQuery {
  no: number[];
  date: number
}

export interface RegisterAttendance {
  owner: string;
  name: string;
  gender: string;
  phoneNo: string;
  churchNo: number;
  date: number;
  status: AttendanceStatus;
}


export interface AttendanceStatics {
  male: number;
  female: number;
  total: number;
}

export interface TotalAttendanceStatics extends AttendanceStatics {
  date: string;
}
