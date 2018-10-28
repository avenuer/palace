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
  Retrieve = 'Followup-retrieve',
  MemberGraph = 'Followup-member-graph',
  RegisterHistory = 'Followup-register-history',
  TotalAttendanceHistory = 'Followup-attendance-history',
}

export enum Migration {
  Prototype = 'Migration-prototype'
}

// tslint:disable-next-line:variable-name
export const DateFormat = "D-MMMM-YYYY";

export const memberSearchFields = ['name', 'address', 'gender', 'department', 'level', 'school', 'job', 'workAddress'  ];
