import { createRouter, createWebHashHistory } from 'vue-router';
import SignIn from '@/components/SignIn.vue';
import SignUp from '@/components/SignUp.vue';
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
        path: 'sign-in',
        component: SignIn,
      },
      {
        path: 'sign-up',
        component: SignUp,
      },
      {
        path: 'forgot-pass',
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
