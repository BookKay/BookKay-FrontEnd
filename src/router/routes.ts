import { RouteRecordRaw } from 'vue-router';

import homeRoutes from 'src/router/home';
import appRoutes from 'src/router/app';
import readRoutes from 'src/router/read';
import writeRoutes from 'src/router/write';

const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'base',
    component: () => import('src/pages/home/SplashScreenPage.vue'),
    //children: [{ path: '', component: () => import('pages/Index.vue') }],
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('pages/Error404.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'bad-not-found',
    component: () => import('pages/Error404.vue'),
  },
];

//Injecting in routes from the imported modules
const routes = baseRoutes.concat(
  homeRoutes,
  appRoutes,
  readRoutes,
  writeRoutes
);

export default routes;
