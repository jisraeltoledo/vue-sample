<template>
  <!-- Sidebar -->
  
  <ul class="sidebar navbar-nav">
    <br>
    <menu-moderador v-if="hasRol ('moderador')"></menu-moderador>
    <menu-diseno-grafico v-if="hasRol('diseno_grafico')"></menu-diseno-grafico>
    <menu-diseno-industrial v-if="hasRol('diseno_industrial')"></menu-diseno-industrial>
    <menu-ing-electrica v-if="hasRol('ingenieria_electrica')"></menu-ing-electrica>
  </ul>
</template>

<script>
import store from "@/store";
import MenuModerador from "@/components/menus/MenuModerador";
import MenuDisenoGraficoVue from './menus/MenuDisenoGrafico.vue';
import MenuDisenoIndstrialVue from './menus/MenuDisenoIndstrial.vue';
import MenuIngenieriaElectricaVue from './menus/MenuIngenieriaElectrica.vue';

export default {
  name: "side-bar",
  components: {
    "menu-moderador": MenuModerador,
    "menu-diseno-grafico": MenuDisenoGraficoVue,
    "menu-diseno-industrial": MenuDisenoIndstrialVue,
    "menu-ing-electrica": MenuIngenieriaElectricaVue
  },
  created(){
      console.log (store);
  },
  computed: {
      
  },
  methods: {
      hasRol (rol){
          return store.state.userRole === rol || store.state.userRole=== 'super_admin'; 
      }
  }
};
</script>
