const writeRoutes = [
  {
    path: "/write",
    name: "write",
    component: () => import("src/layouts/WriteLayout.vue"),
    children: [
      /*{
        path: "manuscript/:manuscript_id",
        name: "write-manuscript",
        component: () => import("src/pages/write/ManuscriptPage.vue")
      },*/
      {
        path: "manuscript/:manuscript_id/details",
        name: "write-detail",
        component: () => import("src/pages/app/BookDetailPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "manuscript/:manuscript_id/overview",
        name: "write-overview",
        component: () => import("src/pages/write/OverviewPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "editor",
        name: "write-editor",
        component: () => import("src/pages/write/EditorPage.vue"),
      },
    ],
  },
];

export default writeRoutes;
