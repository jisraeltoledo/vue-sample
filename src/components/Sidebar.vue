<template>
  <!-- Sidebar -->
  <ul class="sidebar navbar-nav">
    <menu-moderador v-if="hasRol ('moderador')"></menu-moderador>
    
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
import MenuModerador from "@/components/moderador/Menu.vue";
export default {
  name: "side-bar",
  components: {
    "menu-moderador": MenuModerador
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
