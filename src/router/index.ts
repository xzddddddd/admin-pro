import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";
// import 'nprogress/nprogress.css'
// const routes:Array<RouteRecordRaw> = [
//   {
//     path: '/',
//     name: 'Home',
//     component: ()=>import("../views/home/index.vue"),
//     meta:{},
//     children:[]
//   }
// ]
export const aboutRouter = {
  path: "/about",
  name: "about",
  component: () => import("@/views/about/index.vue"),
  meta: {},
  children: [],
} as RouteRecordRaw;
const modules: Record<string, any> = import.meta.glob("./modules/*.ts", {
  eager: true,
});
const routes: Array<RouteRecordRaw> = [];
Object.keys(modules).forEach((key) => {
  routes.push(modules[key].default);
});
routes.push(aboutRouter);
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  NProgress.start();
  next();
});
router.afterEach((to, from) => {
  // to and from are both route objects.
  NProgress.done();
});
export default router;
