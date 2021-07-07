const homeRoutes = [
  {
    path: "/home",
    name: "home",
    component: () => import("src/layouts/HomeLayout.vue"),
    children: [
      {
        path: "",
        name: "home-homepage",
        component: () => import("src/pages/home/HomePage.vue")
      },
      {
        path: "sign-in",
        name: "home-sign-in",
        component: () => import("src/pages/home/SignInPage.vue")
      },
      {
        path: "sign-up",
        name: "home-sign-up",
        component: () => import("src/pages/home/SignUpPage.vue")
      },
      {
        path: "browse",
        name: "home-browse",
        component: () => import("src/pages/app/BookShopPage.vue")
      },
      {
        path: "browse/:book_id",
        name: "home-browse-book",
        component: () => import("src/pages/app/BookDetailPage.vue")
      }
    ]
  }
];

export default homeRoutes;
