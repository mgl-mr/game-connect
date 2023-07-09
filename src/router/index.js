import { createRouter, createWebHashHistory } from 'vue-router';

import store from '@/store';

import Authentication from '@/views/Authentication.vue';
import SignIn from '@/components/SignIn.vue';
import SignUp from '@/components/SignUp.vue';
import SignUp1 from '@/components/SignUp1.vue';
import SignUp2 from '@/components/SignUp2.vue';
import SignUp3 from '@/components/SignUp3.vue';
import SignUp4 from '@/components/SignUp4.vue';
import ForgotPass from '@/components/ForgotPass.vue';

import Application from '@/views/Application.vue';
import MyProfile from '@/components/MyProfile.vue';
import Suggestions from '@/components/Suggestions.vue';

const routes = [
  {
    path: '/',
    name: 'authentication',
    component: Authentication,
    children: [
      {
        path: '/sign-in',
        name: 'sign-in',
        component: SignIn,
      },
      {
        path: '/sign-up',
        name: 'sign-up',
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
        path: '/forgot-pass',
        name: 'forgot-pass',
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
        path: '/my-profile',
        name: 'my-profile',
        component: MyProfile,
      },
      {
        path: '/suggestions',
        name: 'suggestions',
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

  if (to.name === 'application' && Object.keys(user).length === 0) {
    next({ name: 'authentication' });
  } else if (to.name === 'application') {
    next({ name: 'my-profile' });
  } else if (to.name === 'authentication') {
    next({ name: 'sign-in' });
  } else if (to.name === 'sign-up') {
    next({ name: 'sign-up1' });
  } else {
    next();
  }
});

export default router;
