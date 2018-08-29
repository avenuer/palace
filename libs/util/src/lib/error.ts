// import { ApiResponse } from '@dilta/authentication/src/lib/shared';

type ApiResponse = any;

/**
 * Errors thrown from failed Api Response
 *
 * @export
 * @class ApiResponseError
 * @extends {Error}
 */
export class ApiResponseError extends Error {
  /** formats the response to the error code */
  // tslint:disable-next-line:member-access
  static formatApiError(res: ApiResponse) {
    const { code, error, status } = res;
    return `${code}:: ${error} ::${status}`;
  }

  constructor(res: ApiResponse) {
    super(ApiResponseError.formatApiError(res));
  }
}
