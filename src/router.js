/*jshint esversion: 6 */
import Vue from "vue";
import Router from "vue-router";

import Home from "@/views/Home";
import Login from "@/views/Login";
import SignUp from "@/views/Signup";
import About from "@/views/About";
import store from "@/store";
import CreateProject from "@/components/moderador/CreateProject";
import ListProject from "@/components/moderador/ListProject";
import DisenoGrafico from "@/components/DisenoGrafico";
import DisenoIndustrial from "@/components/DisenoIndustrial";
import IngenieriaElectrica from "@/components/IngenieriaElectrica";

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
      component: Login,
      meta: {
        plainLayout: true
      }
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
      component: About
    },
    {
      path: "/create-project",
      name: "Create Project",
      component: CreateProject,
      meta: {
        roles: ["moderador"]
      }
    },
    {
      path: "/list-project/:next_path/",
      name: "List Project",
      component: ListProject,
      meta: {
        roles: [
          "moderador",
          "diseno_grafico",
          "diseno_industrial",
          "ingenieria_electrica"
        ]
      }
    },
    {
      path: "/diseno-grafico/:projectid",
      name: "Diseño Gráfico",
      component: DisenoGrafico,
      meta: {
        roles: ["diseno_grafico"]
      }
    },
    {
      path: "/diseno-industrial/:projectid",
      name: "Diseño Industrial",
      component: DisenoIndustrial,
      meta: {
        roles: ["diseno_industrial"]
      }
    },
    {
      path: "/ingenieria-electrica/:projectid",
      name: "Ingenieria Electrica",
      component: IngenieriaElectrica,
      meta: {
        roles: ["ingenieria_electrica"]
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
