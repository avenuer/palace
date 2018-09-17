import {
  CrudMethod,
  apiFactory,
  EntityModelNames,
  ModelHeaders,
  BaseResponse,
  FindQueryResponse,
  OtherQueryResponse,
  FindQueryParams,
  FollowUpStatic,
  Member,
  MemberAttendanceQuery,
} from '@elizer/shared';
import { renderEventBus } from './ipc.render';
import { MembersAttendance } from 'libs/followup/attendance';

export function getApiFactory<ResType>(name: EntityModelNames, id: string) {
  return renderEventBus<OtherQueryResponse<ResType>>(
    apiFactory(CrudMethod.Retrieve, id, { name }),
  );
}

export function findApiFactory<ResType, T>(
  name: EntityModelNames,
  query: T,
  custom: Partial<FindQueryParams> = {}
) {
  const headers: ModelHeaders<Partial<FindQueryParams>> = { name, query: custom };
  return renderEventBus<FindQueryResponse<ResType>>(
    apiFactory(CrudMethod.Find, query, headers),
  );
}

export function createApiFactory<ResType, T>(name: EntityModelNames, data: T) {
  return renderEventBus<OtherQueryResponse<ResType>>(
    apiFactory<T, ModelHeaders<T>>(CrudMethod.Create, data, { name }),
  );
}

export function updateApiFactory<ResType, T>(name: EntityModelNames, data: T) {
  return renderEventBus<OtherQueryResponse<ResType>>(
    apiFactory(CrudMethod.Update, data, { name }),
  );
}

export function deleteApiFactory(name: EntityModelNames, data: string) {
  return renderEventBus<OtherQueryResponse<boolean>>(
    apiFactory(CrudMethod.Delete, data, { name }),
  );
}

export function findMembersAttendance(query: Partial<MemberAttendanceQuery>, params?: Partial<FindQueryParams>) {
  return renderEventBus<FindQueryResponse<MembersAttendance>>(apiFactory(FollowUpStatic.Find, query, params));
}