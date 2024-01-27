import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "calculator",
      component: () => import("../views/Calculator.vue"),
      meta: { requiresAuth: true },
    },

    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/Login.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/auth/Signup.vue"),
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach((to, from, next) => {
  let userId = localStorage.getItem("id");
  let token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token && !userId) {
    next("/signup");
  } else {
    next();
  }
});

export default router;
