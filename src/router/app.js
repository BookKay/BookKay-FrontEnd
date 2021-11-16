const appRoutes = [
  {
    path: "/app",
    name: "app",
    component: () => import("src/layouts/AppLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "read",
        name: "app-read",
        component: () => import("src/pages/app/ReadPage.vue"),
      },
      {
        path: "write",
        name: "app-write",
        component: () => import("src/pages/app/WritePage.vue"),
      },
      {
        path: "add-manuscript",
        name: "app-add-manuscript",
        component: () => import("src/pages/app/AddManuscriptPage.vue"),
      },
      {
        path: "store",
        name: "app-store",
        component: () => import("src/pages/app/BookShopPage.vue"),
        children: [
          {
            path: "list",
            name: "app-store-list",
            component: () => import("src/pages/app/BookShopList.vue"),
          },
          {
            path: "search",
            name: "app-store-search",
            component: () => import("src/pages/app/BookShopSearch.vue"),
          },
        ],
      },
      {
        path: "browse/:book_id",
        name: "app-browse-book",
        component: () => import("src/pages/app/BookDetailPage.vue"),
      },
      {
        path: "purchase/:book_id",
        name: "app-purchase-book",
        component: () => import("src/pages/app/BookPurchasePage.vue"),
      },
      {
        path: "profile",
        name: "app-profile",
        component: () => import("src/pages/app/ProfilePage.vue"),
      },
      {
        path: "change-password",
        name: "app-change-password",
        component: () => import("src/pages/app/ChangePasswordPage.vue"),
      },
    ],
  },
];

export default appRoutes;
