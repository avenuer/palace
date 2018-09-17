export * from './crudFactories';
export * from './ipc.render';

export enum RouterNames {
    HomePage = 'Homepage',
}

export enum AdminRoutesNames {
    Home = 'Admin',
    MemberCreate = 'Admin:Member:Create',
    MemberEdit = 'Admin:Member:Edit',
    MemberProfile = 'Admin:Member:Profile',
}

export enum FollowUpRoutesNames {
    Home = 'FollowUp',
    Register = 'FollowUp::Register',
    Birthdays = 'FollowUp::Birthdays',
    Profile = 'FollowUp::Profile'
}