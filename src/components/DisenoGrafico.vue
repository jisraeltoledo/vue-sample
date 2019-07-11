<template>
  <div>
    <h1>Diseño Gráfico</h1>
    <div class="col-md-8 offset-md-2">
        <upload-file v-bind:id="'bio'" v-bind:path="'diseno_grafico'" v-bind:label="'Foto Diseño'" v-bind:width="150"></upload-file>
        <br />
        <upload-file v-bind:id="'prod'" v-bind:path="'diseno_grafico'" v-bind:label="'Foto Producto'" v-bind:width="150"></upload-file>
        <br />
        <upload-file v-bind:id="'mod'" v-bind:path="'diseno_grafico'" v-bind:label="'Module Colors'" v-bind:width="150"></upload-file>
        <br />
        <upload-file v-bind:id="'dim'" v-bind:path="'diseno_grafico'" v-bind:label="'Dimensions'" v-bind:width="150"></upload-file>
        <br />
        <upload-file v-bind:id="'est'" v-bind:path="'diseno_grafico'" v-bind:label="'Estructura'" v-bind:width="150"></upload-file>
      
    </div>
    <br />
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
import firebase from 'firebase';
import UploadFileVue from './UploadFile.vue';
export default {
  name: "diseno-grafico",
  props: {},
  components: {
      "upload-file": UploadFileVue
  },
  data() {
    return {};
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
    
  }
};
</script>