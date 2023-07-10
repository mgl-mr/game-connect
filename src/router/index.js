import { createRouter, createWebHashHistory } from 'vue-router';

import store from '@/store';

import Authentication from '@/views/Authentication.vue';
import SignIn from '@/views/SignIn.vue';
import SignUp from '@/views/SignUp.vue';
import SignUp1 from '@/views/SignUp1.vue';
import SignUp2 from '@/views/SignUp2.vue';
import SignUp3 from '@/views/SignUp3.vue';
import SignUp4 from '@/views/SignUp4.vue';
import ForgotPass from '@/views/ForgotPass.vue';

import Application from '@/views/Application.vue';
import MyProfile from '@/views/MyProfile.vue';
import Suggestions from '@/views/Suggestions.vue';

const routes = [
  {
    path: '/',
    name: 'authentication',
    component: Authentication,
    children: [
      {
        path: '/authentication/sign-in',
        name: 'authentication-sign-in',
        component: SignIn,
      },
      {
        path: '/authentication/sign-up',
        name: 'authentication-sign-up',
        component: SignUp,
        children: [
          {
            path: 'sign-up1',
            name: 'sign-up1',
            component: SignUp1,
          },
          {
            path: 'sign-up2',
            name: 'sign-up2',
            component: SignUp2,
          },
          {
            path: 'sign-up3',
            name: 'sign-up3',
            component: SignUp3,
          },
          {
            path: 'sign-up4',
            name: 'sign-up4',
            component: SignUp4,
          },
        ],
      },
      {
        path: '/authentication/forgot-pass',
        name: 'authentication-forgot-pass',
        component: ForgotPass,
      },
    ],
  },
  {
    path: '/application',
    name: 'application',
    component: Application,
    children: [
      {
        path: '/application/my-profile',
        name: 'application-my-profile',
        component: MyProfile,
      },
      {
        path: '/application/suggestions',
        name: 'application-suggestions',
        component: Suggestions,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { user } = store.state;

  if (to.name.startsWith('application') && Object.keys(user).length === 0) {
    next({ name: 'authentication' });
  } else if (to.name === 'application') {
    next({ name: 'application-suggestions' });
  } else if (to.name === 'authentication') {
    next({ name: 'authentication-sign-in' });
  } else if (to.name === 'authentication-sign-up') {
    next({ name: 'sign-up1' });
  } else {
    next();
  }
});

export default router;
