import { AttendanceStatus } from './constant';

export interface BaseModel {
  id: string;
  hash: string;
  createdAt: number;
  updatedAt: number;
  organization: string;
}

export interface Member extends Partial<BaseModel> {
  name: string;
  email?: string;
  phoneNo: string;
  gender: string;
  day: number;
  month: string;
  isStudent: boolean;
  department?: string;
  level?: string;
  school?: string;
  job?: string;
  workAddress?: string;
  isVisitor: boolean;
  address: string;
  churchNo: number;
}

export interface Attendance extends Partial<BaseModel> {
    owner: string;
    date: number;
    attendance: AttendanceStatus;
}

export interface Image extends Partial<BaseModel> {
    owner: string;
    link: string;
}


export interface Organization extends Partial<BaseModel> {
  name: string;
  email: string;
  phoneNo: string;
  address: string;
  state: string;
  town: string;
}