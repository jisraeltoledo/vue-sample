<template>
  <div>
    <h1>Diseño Gráfico</h1>
    <div class="col-md-8 offset-md-2">
      <upload-file
        v-bind:id="'bio'"
        v-bind:path="'diseno_grafico'"
        v-bind:label="'Foto Diseño'"
        v-bind:width="150"
      ></upload-file>
      <br />
      <upload-file
        v-bind:id="'prod'"
        v-bind:path="'diseno_grafico'"
        v-bind:label="'Foto Producto'"
        v-bind:width="150"
      ></upload-file>
      <br />
      <upload-file
        v-bind:id="'dim'"
        v-bind:path="'diseno_grafico'"
        v-bind:label="'Dimensions'"
        v-bind:width="150"
      ></upload-file>
      <br />
      <upload-file
        v-bind:id="'est'"
        v-bind:path="'diseno_grafico'"
        v-bind:label="'Estructura'"
        v-bind:width="150"
      ></upload-file>
      <br />
      <h4>Module colors</h4>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="black" id="Black" v-model="moduleColors" />
        <label class="form-check-label" for="Black">Black</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="silver" id="Silver"  v-model="moduleColors"/>
        <label class="form-check-label" for="Silver">Silver</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="gold" id="Gold"  v-model="moduleColors"/>
        <label class="form-check-label" for="Gold">Gold</label>
      </div>
      <button class="btn btn-primary pull-right text-right" @click="guardar"> Guardar </button>
    </div>
    <br />
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
import firebase from "firebase";
import UploadFileVue from "./UploadFile.vue";
export default {
  name: "diseno-grafico",
  props: {},
  components: {
    "upload-file": UploadFileVue
  },
  data() {
    return {
        moduleColors: []
    };
  },
  created() {
    console.log(this.$route.params.projectid);
  },
  computed: {
    projectid() {
      return this.$route.params.projectid;
    }
  },
  methods: {
      guardar() {
          db.collection("projects").doc(this.projectid).update ({
              moduleColors: this.moduleColors
          }).then (()=>{
              alert ("Proyecto Actualizado");
              this.$router.push("/home");
          });
      }
  }
};
</script>