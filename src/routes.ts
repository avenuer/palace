import VueRouter, { RouteConfig } from 'vue-router';

import AdminBasePage from './pages/admin/admin-base-page.vue';
import AdminHomePage from './pages/admin/admin-home-page.vue';
import MemberFormPage from './pages/admin/member-form-page.vue';
import MemberProfilePage from './pages/admin/member-profile-page.vue';
import FollowUpHomePage from './pages/followup/followup-home-page.vue';
import FollowUpStaticsPage from './pages/followup/followup-statics-page.vue';
import AttendanceRegisterPage from './pages/followup/attendance-register-page.vue';
import BirthDaysPage from './pages/followup/birthdays-page.vue';
import { RouterNames, AdminRoutesNames, FollowUpRoutesNames } from 'libs/render';
// import AttendanceRegisterPage from './pages/followup/followup-home-page.vue';

const appRoutes: RouteConfig[] = [
  { path: '/', name: RouterNames.HomePage },
  {
    path: '/admin',
    component: AdminBasePage,
    name: AdminRoutesNames.Home,
    children: [
      { path: '', component: AdminHomePage },
      { path: 'form', component: MemberFormPage, name: AdminRoutesNames.MemberCreate },
      { path: 'profile/:id', component: MemberProfilePage, name: AdminRoutesNames.MemberProfile },
      { path: 'edit/:id', component: MemberFormPage, name: AdminRoutesNames.MemberEdit },
    ]
  },
  {
    path: '/followup',
    component: AdminBasePage,
    name: FollowUpRoutesNames.Home,
    children: [
      { path: '', component: FollowUpHomePage },
      { path: 'register', component: AttendanceRegisterPage, name: FollowUpRoutesNames.Register },
      { path: 'birthdays', component: BirthDaysPage, name: FollowUpRoutesNames.Birthdays },
      { path: 'profile/:id', component: FollowUpStaticsPage, name: FollowUpRoutesNames.Profile },
    ]
  }
];
const router = new VueRouter({ routes: appRoutes });

export default router;
