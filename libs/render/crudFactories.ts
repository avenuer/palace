import {
  CrudMethod,
  apiFactory,
  EntityModelNames,
  ModelHeaders,
  BaseResponse,
  FindQueryResponse,
  OtherQueryResponse,
} from '@elizer/shared';
import { renderEventBus } from './ipc.render';

export function getApiFactory<ResType>(name: EntityModelNames, id: string) {
  return renderEventBus<OtherQueryResponse<ResType>>(
    apiFactory(CrudMethod.Retrieve, id, { name }),
  );
}
export function findApiFactory<ResType, T, K>(
  name: EntityModelNames,
  data: T,
  query?: K,
) {
  const headers: ModelHeaders<K> = { name, query };
  return renderEventBus<FindQueryResponse<ResType>>(
    apiFactory(CrudMethod.Find, data, headers),
  );
}
export function createApiFactory<ResType, T>(name: EntityModelNames, data: T) {
  return renderEventBus<OtherQueryResponse<ResType>>(
    apiFactory(CrudMethod.Create, data, { name }),
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
