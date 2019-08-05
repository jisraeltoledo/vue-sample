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
import TabsScreen from "@/components/TabsScreen";
import Producto from "@/components/Producto";

Vue.use(Router);

export const roles = {
  moderador: "moderador",
  estructuras: "estructuras",
  diseno_grafico: "diseño grafico",
  diseno_industrial: "diseño industrial",
  ingenieria_electrica: "ingenieria electrica",
  fotometria: "fotometria",
  super_admin: "super admin"
};

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
      path: "/form-base/:formid/:projectid?",
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
        roles: [roles.moderador]
      }
    },
    {
      path: "/projects/:status/",
      name: "List Project Progress",
      component: TabsScreen,
      meta: {}
    },
    {
      path: "/list-project/:next_path/",
      name: "List Project",
      component: ListProject,
      meta: {
        roles: []
      }
    },
    {
      path: "/diseno-grafico/:projectid",
      name: "Diseño Gráfico",
      component: DisenoGrafico,
      meta: {
        roles: [roles.diseno_grafico]
      }
    },
    {
      path: "/diseno-industrial/:projectid",
      name: "Diseño Industrial",
      component: DisenoIndustrial,
      meta: {
        roles: [roles.diseno_industrial]
      }
    },
    {
      path: "/tab-screen",
      name: "Tabs Screem",
      component: TabsScreen,
      meta: {}
    },
    {
      path: "/product/:projectid",
      name: "Producto",
      component: Producto,
      meta: {}
    },
    {
      path: "/ingenieria-electrica/:projectid",
      name: "Ingenieria Electrica",
      component: IngenieriaElectrica,
      meta: {
        roles: [roles.ingenieria_electrica]
      }
    }
  ],
  mode: "history"
});

router.beforeEach((to, from, next) => {
  let roles = to.meta.roles ? to.meta.roles : ["guest"];
  if (
    store.state.userRole === roles.super_admin ||
    roles.includes(store.state.userRole) ||
    roles.includes("guest")
  )
    next();
  else next("login");
});

export default router;
