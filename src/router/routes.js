const routes = [
  {
    path: "/",
    component: () => import("layouts/BasicLayout.vue"),
    meta: {
      guestOnly: true
    },
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("pages/cekresi/Index.vue")
      },
      {
        path: "/cekresi",
        name: "cekresi",
        component: () => import("pages/cekresi/CekResi.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
