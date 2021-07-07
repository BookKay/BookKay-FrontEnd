import homeRoutes from "src/router/home.js";
import appRoutes from "src/router/app.js";
import readRoutes from "src/router/read.js";
import writeRoutes from "src/router/write.js";

const baseRoutes = [
  {
    path: "/",
    name: "base",
    title: "BookKay",
    //icon: 'public\icons\favicon-16x16.png',
    component: () => import("src/pages/home/SplashScreenPage.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

const routes = baseRoutes.concat(
  homeRoutes,
  appRoutes,
  readRoutes,
  writeRoutes
);
//const routes = baseRoutes
export default routes;
