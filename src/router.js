/*jshint esversion: 6 */
import Vue from "vue";
import Router from "vue-router";

import Home from "@/views/Home";
import Login from "@/views/Login";
import SignUp from "@/views/Signup";
import About from "@/views/About";
import store from "@/store";
import CreateProject from "@/components/CreateProject";
import ListProject from "@/components/ListProject";
import DisenoGrafico from "@/components/DisenoGrafico";
import DisenoIndustrial from "@/components/DisenoIndustrial";
import CreateTemplate from "@/components/CreateTemplate";
import IngenieriaElectrica from "@/components/IngenieriaElectrica";
import FormBase from "@/components/FormBase";

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
      path: "/form-base/:formid/:departamento",
      name: "FormBase",
      component: FormBase
    },
    {
      path: "/create-template",
      name: "CreateTemplate",
      component: CreateTemplate
    },
    {
      path: "/create-project/:projectid?",
      name: "Create Project",
      component: CreateProject,
      meta: {
        roles: ["moderador", "super_admin"]
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
          "ingenieria_electrica",
          "super_admin"
        ]
      }
    },
    {
      path: "/diseno-grafico/:projectid",
      name: "Diseño Gráfico",
      component: DisenoGrafico,
      meta: {
        roles: ["diseno_grafico", "super_admin"]
      }
    },
    {
      path: "/diseno-industrial/:projectid",
      name: "Diseño Industrial",
      component: DisenoIndustrial,
      meta: {
        roles: ["diseno_industrial", "super_admin"]
      }
    },
    {
      path: "/ingenieria-electrica/:projectid",
      name: "Ingenieria Electrica",
      component: IngenieriaElectrica,
      meta: {
        roles: ["ingenieria_electrica", "super_admin"]
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
