
export class UtilService {

  /**
   * Extract Error value from an array like await-to result format
   *
   * @template T
   * @param {[Error, T]} [err, value]
   * @returns
   * @memberof UtilService
   */
  static cleanErrorValue<T>([err, value]: [Error, T]) {
    if (err) {
      throw err;
    }
    return value;

  /**
   * cleans the apiError
   *
   * @template T
   * @param {ApiResponse<T>} details
   * @returns {T}
   * @memberof UtilService
   */
  // static cleanApiResponse<T>(details: ApiResponse<T>): T {
  //   console.log(details);
  //   if (details.error) {
  //     throw new ApiResponseError(details);
  //   }
  //   return details.data;
  // }

}
