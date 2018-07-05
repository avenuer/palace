import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home_Page',
      component: require('@/components/HomePage').default,
    },
    {
      path: '/attendance',
      name: 'Attendance_Page',
      component: require('@/components/AttendancePage').default,
    },
    {
      path: '/birthday',
      name: 'Birthday_Page',
      component: require('@/components/BirthdayPage').default,
    },
    {
      path: '/admin',
      name: 'admin_Page',
      component: require('@/components/AdminPage').default,
    },
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/components/LandingPage').default,
    // },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
