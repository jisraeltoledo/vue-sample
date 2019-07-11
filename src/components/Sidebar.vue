<template>
  <!-- Sidebar -->
  <ul class="sidebar navbar-nav">
    <menu-moderador v-if="hasRol ('moderador')"></menu-moderador>
    <menu-diseno-grafico v-if="hasRol('diseno_grafico')"></menu-diseno-grafico>
    <li class="nav-item">
      <a class="nav-link" href="charts.html">
        <i class="fas fa-fw fa-chart-area"></i>
        <span>Charts</span>
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="tables.html">
        <i class="fas fa-fw fa-table"></i>
        <span>Tables</span>
      </a>
    </li>
  </ul>
</template>

<script>
import store from "@/store";
import MenuModerador from "@/components/menus/MenuModerador";
import MenuDisenoGraficoVue from './menus/MenuDisenoGrafico.vue';

export default {
  name: "side-bar",
  components: {
    "menu-moderador": MenuModerador,
    "menu-diseno-grafico": MenuDisenoGraficoVue
  },
  created(){
      console.log (store);
  },
  computed: {
      
  },
  methods: {
      hasRol (rol){
          return store.state.userRole === rol; 
      }
  }
};
</script>
