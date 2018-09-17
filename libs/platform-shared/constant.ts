export enum EntityModelNames {
  Member = 'member',
  Attendance = 'attendance',
  Image = 'image',
}

export enum AttendanceStatus {
    Absent = 0,
    Present = 1,
}

export enum ApiMethod {
  GET = 'GET',
  POST = 'GET',
  PUT = 'GET',
  DELETE = 'GET',
}

export enum ApiStatus {
  Success = 'Success',
  Failure = 'Failure',
  Pending = 'Pending',
}

export enum CrudMethod {
  Retrieve = 'RETRIEVE',
  Find = 'Find',
  Update = 'Update',
  Create = 'Create',
  Delete = 'Delete'
}

export enum FollowUpStatic {
  Find = 'Followup-find',
  Retrieve = 'Followup-retrieve'
}

// tslint:disable-next-line:variable-name
export const DateFormat = "D-MMMM-YYYY";