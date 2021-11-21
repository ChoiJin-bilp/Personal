import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login/index.vue"; //登录单独视图

// import { getCookie } from "@/utils/cookie.js";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { title: "登录" },
  }
];
// 解决两次访问相同路由地址报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  routes: routes,
});
// 路由导航
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    // 跳转前动态设置当前title
    document.title = to.meta.title;
  }
  // if (getCookie("loginToken")) {
  next();
  // } else {
  // if (to.name === "login") {
  //   next();
  // } else {
  //   next("/login");
  // }
  // }
});

export default router;
