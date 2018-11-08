export enum Platform {
  Name = 'palace'
}

export enum EntityModelNames {
  Member = 'member',
  Attendance = 'attendance',
  Image = 'image',
}

export enum MemberCategories {
  Adult = 'Adult',
  Children = 'children',
  Teenager = 'Teenager',
  Youth = 'Youth',
}

export enum Security {
  SetLiensce = 'set-liensce',
  DeleteLiensce = 'delete-liensce',
  RetrieveLiensce = 'retrieve-liensce',
  DecryptLiensce = 'decrypt-liensce',
}

export enum AttendanceStatus {
    Absent = 0,
    Present = 1,
}

export enum ApiMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
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
