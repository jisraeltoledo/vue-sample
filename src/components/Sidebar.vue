<template>
  <!-- Sidebar -->

  <ul class="sidebar navbar-nav">
    <br />
    <!-- <menu-moderador v-if="hasRol ('moderador')"></menu-moderador>
    <menu-diseno-grafico v-if="hasRol('diseno_grafico')"></menu-diseno-grafico>
    <menu-diseno-industrial v-if="hasRol('diseno_industrial')"></menu-diseno-industrial>
    <menu-ing-electrica v-if="hasRol('ingenieria_electrica')"></menu-ing-electrica>-->

    <li class="nav-item">
      <router-link tag="li" to="/projects/all">
        <a class="nav-link">
          <i class="fas fa-list"></i>
          <span> Todos los productos</span>
        </a>
      </router-link>
    </li>

    <li class="nav-item">
      <router-link tag="li" to="/projects/proceso">
        <a class="nav-link">
          <i class="fas fa-spinner"></i>
          <span> En proceso</span>
        </a>
      </router-link>
    </li>

    <li class="nav-item">
      <router-link tag="li" to="/projects/revision">
        <a class="nav-link">
          <i class="fas fa-check-double"></i>
          <span> En revisión</span>
        </a>
      </router-link>
    </li>

    <li class="nav-item">
      <router-link tag="li" to="/projects/publicado">
        <a class="nav-link">
          <i class="fas fa-globe-americas"></i>
          <span> Publicados</span>
        </a>
      </router-link>
    </li>

    <li class="nav-item">
      <router-link tag="li" to="/projects/retirado">
        <a class="nav-link">
          <i class="fas fa-minus-circle"></i>
          <span> Retirados </span>
        </a>
      </router-link>
    </li>

    <li class="nav-item">
      <router-link tag="li" to="/collections">
        <a class="nav-link">
          <i class="fas fa-layer-group"></i>
          <span> Collecciones </span>
        </a>
      </router-link>
    </li>
  </ul>
</template>

<script>
import store from "@/store";
import MenuModerador from "@/components/menus/MenuModerador";
import MenuDisenoGraficoVue from "./menus/MenuDisenoGrafico.vue";
import MenuDisenoIndstrialVue from "./menus/MenuDisenoIndstrial.vue";
import MenuIngenieriaElectricaVue from "./menus/MenuIngenieriaElectrica.vue";
import { roles } from "@/router";
export default {
  name: "side-bar",
  components: {
    "menu-moderador": MenuModerador,
    "menu-diseno-grafico": MenuDisenoGraficoVue,
    "menu-diseno-industrial": MenuDisenoIndstrialVue,
    "menu-ing-electrica": MenuIngenieriaElectricaVue
  },
  created() {
    
  },
  computed: {},
  methods: {
    hasRol(rol) {
      return (
        store.state.userRole === rol ||
        store.state.userRole === roles.super_admin
      );
    }
  }
};
</script>
