/*jshint esversion: 6 */
import Vue from "vue";
import Router from "vue-router";

import Home from "@/views/Home";
import Login from "@/views/Login";
import SignUp from "@/views/Signup";
import About from "@/views/About";
import store from "@/store";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "*",
      redirect: "/login"
    },
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/sign-up",
      name: "SignUp",
      component: SignUp
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/about",
      name: "About",
      component: About,
      meta: {
        //requiresAuth: true,
        roles: ["other"]
      }
    }
  ],
  mode: "history"
});

router.beforeEach((to, from, next) => {
  let roles = to.meta.roles ? to.meta.roles : ["guest"];
  if (roles.includes(store.state.userRole) || roles.includes("guest")) next();
  else next("login");
});

export default router;
