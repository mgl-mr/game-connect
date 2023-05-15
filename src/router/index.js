import { createRouter, createWebHashHistory } from 'vue-router';
import SignIn from '@/components/SignIn.vue';
import SignUp from '@/components/SignUp.vue';
import SignUp1 from '@/components/SignUp1.vue';
import SignUp2 from '@/components/SignUp2.vue';
import SignUp3 from '@/components/SignUp3.vue';
import SignUp4 from '@/components/SignUp4.vue';
import ForgotPass from '@/components/ForgotPass.vue';
import Authentication from '@/views/Authentication.vue';

const routes = [
  {
    path: '/',
    name: 'authentication',
    redirect: '/sign-in',
    component: Authentication,
    children: [
      {
        path: '/sign-in',
        component: SignIn,
      },
      {
        path: '/sign-up',
        component: SignUp,
        redirect: '/sign-up/sign-up1',
        children: [
          {
            path: 'sign-up1',
            component: SignUp1,
          },
          {
            path: 'sign-up2',
            component: SignUp2,
          },
          {
            path: 'sign-up3',
            component: SignUp3,
          },
          {
            path: 'sign-up4',
            component: SignUp4,
          },
        ],
      },
      {
        path: '/forgot-pass',
        component: ForgotPass,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
