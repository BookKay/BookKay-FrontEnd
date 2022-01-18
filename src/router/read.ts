const readRoutes = [
  {
    path: "/read",
    name: "read-book",
    component: () => import("src/pages/read/ReadBook.vue")
  }
];

export default readRoutes;
