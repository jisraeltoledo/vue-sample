<template>
  <div class="container">
    <img src="@/assets/imgs/logo_claves.png">
    <h1>Claves</h1>

    <div
      class="row"
    >
    
    Claves es un complemento que permite cifrar cadenas por cadenas aleatorias, y posteriormente recuperarlas.
    <br><br>
    <ol>
      <li>  Iniciar el script <br><img src="@/assets/imgs/paso1.png" width="600"><br><br></li>
      <li>  Seleccionar las cadenas a cifrar dar click en ofuscar. 
        <br><img src="@/assets/imgs/paso2.png" width="600"><br><br></li>
      <li>  Se pueden agregar 3 datos a la cadena cifrada. Click en <strong>Ofusca las celdas seleccionadas </strong><br><img src="@/assets/imgs/paso3.png" width="600"><br><br></li>
      <li>  Las cadenas se cifran con valores aleatorios. <br><img src="@/assets/imgs/paso4.png" width="600"><br><br></li>
    </ol>
    </div>
    Desarrollador: <a href="mailto:israel@omr.mx">israel@omr.mx</a>
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import ProgressVue from "@/components/Progress.vue";
import { db } from "@/main";
import fields from "@/assets/fields.json";
import mock from "@/assets/MOCK_DATA.json";
import TabsScreenVue from "../components/TabsScreen.vue";
export default {
  name: "claves",
  components: {},
  created() {},
  methods: {}
};
</script>