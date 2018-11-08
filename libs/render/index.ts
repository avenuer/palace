export * from './crudFactories';
export * from './ipc.render';
export * from './store-ops';

export enum RouterNames {
    HomePage = 'Homepage',
    TechnicalPage = 'TechnicalPage',
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
    Profile = 'FollowUp::Profile',
    SummationStats = 'FollowUp::SummationStats',
}