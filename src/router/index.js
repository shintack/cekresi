import Vue from "vue";
import VueRouter from "vue-router";

import routes from "./routes";
import store from "../store";
import { loginAndGetProfile } from "../lib/SessionHelper";
import { logout } from "../lib/SessionHelper";
import { LocalStorage } from "quasar";
import { getSegment } from "../lib/helper";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function(/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });
  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      const profile = store.getters["user/profile"];
      if (profile) {
        next();
      } else {
        const slug = getSegment(1);
        next(`/${slug}`);
      }
    } else {
      next();
    }
  });
  /*
  Router.beforeEach((to, from, next) => {
    console.log("each");
    if (to.matched.some(record => record.meta.requiresAuth)) {
      const u = to.query.u;
      const p = to.query.p;
      if (u && p) {
        const profile = store.getters['user/profile'];

        if (profile === null) { // blm login sama sekali
          // set login
          // loginAndGetProfile({ username: u, password: p }, to).then(r => {
          //   next();
          // }).catch();
        } else { // sudah pernah login
          if (profile.email !== u) {
            logout();
            setTimeout(() => {
              loginAndGetProfile({ username: u, password: p }, to).then(r => {
                next();
              }).catch();
            }, 1000);
            location.reload();
          } else {
            next();
          }
        }
      } else {
        if (store.getters['user/isAuthenticated']) {
          next();
        } else {
          next('/welcome');
        }
      }
    } else if (to.matched.some(record => record.meta.guestOnly)) {
      if (store.getters["user/isAuthenticated"]) {
        next("/");
      } else {
        next();
      }
    } else {
      next();
    }
  });
*/
  return Router;
}
