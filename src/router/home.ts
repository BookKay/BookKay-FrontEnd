const homeRoutes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('src/layouts/HomeLayout.vue'),
    children: [
      {
        path: '',
        name: 'home-homepage',
        component: () => import('src/pages/home/HomePage.vue'),
      },
      {
        path: 'sign-in',
        name: 'home-sign-in',
        component: () => import('src/pages/home/SignInSignUpPage.vue'),
      },
      {
        path: 'sign-up',
        name: 'home-sign-up',
        component: () => import('src/pages/home/SignInSignUpPage.vue'),
      },
      {
        path: 'store',
        name: 'home-store',
        component: () => import('src/pages/app/BookShopPage.vue'),
        children: [
          {
            path: 'list',
            name: 'home-store-list',
            component: () => import('src/pages/app/BookShopList.vue'),
          },
          {
            path: 'search',
            name: 'home-store-search',
            component: () => import('src/pages/app/BookShopSearch.vue'),
          },
        ],
      },
      {
        path: 'members',
        name: 'home-members',
        component: () => import('src/pages/home/MembersPage.vue'),
      },
      {
        path: 'browse/:book_id',
        name: 'home-browse-book',
        component: () => import('src/pages/app/BookDetailPage.vue'),
      },
      {
        path: 'verify_email',
        name: 'home-verify-email',
        component: () => import('src/pages/home/VerifyEmailPage.vue'),
      },
    ],
  },
];

export default homeRoutes;
