export enum EntityModelNames {
    Members = 'members',
}

export interface Member {
    id?: string;
    name: string;
    email?: string;
    phoneNo: string;
    gender: string;
    day: string;
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
