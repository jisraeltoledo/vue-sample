<template>
  <div>
    <h1>Diseño Industrial</h1>
    <div class="col-md-8 offset-md-2">
      <br />
      <upload-file
        v-bind:id="'mod'"
        v-bind:path="'diseno_industrial'"
        v-bind:label="'Module Colors'"
        v-bind:width="150"
      ></upload-file>
      <br />
      <upload-file
        v-bind:id="'dim'"
        v-bind:path="'diseno_industrial'"
        v-bind:label="'Dimensions'"
        v-bind:width="150"
      ></upload-file>
      <br />
      <div>
        <div class="form-group">
          <label for="type">Type</label>
          <input
            v-model="type"
            type="text"
            class="form-control"
            id="type"
            aria-describedby="typeHelp"
            placeholder="Type"
          />
          <small
            id="typeHelp"
            class="form-text text-muted"
          >Tipo de luminaria</small>
        </div>

        <div class="form-group">
          <label for="type">Materials:</label>
          <textarea
            v-model="materials"
            type="text"
            class="form-control"
            id="materials"
            aria-describedby="materialsHelp"
            placeholder="Materials"
          ></textarea>
          <small
            id="materialsHelp"
            class="form-text text-muted"
          >Lista de materiales</small>
        </div>

        <div class="form-group">
          <label for="cordLength">Cord length:</label>
          <input
            v-model="cordLength"
            type="text"
            class="form-control"
            id="cordLength"
            aria-describedby="cordHelp"
            placeholder="Cord Length"
          />
          <small
            id="cordHelp"
            class="form-text text-muted"
          >Cord Length</small>
        </div>
        
        <button @click="guardar" class="btn btn-primary">Guardar</button>
      </div>
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
  props: {
  },
  components: {
    "upload-file": UploadFileVue
  },
  data() {
    return {
        type: "",
        materials: "",
        cordLength: ""
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
      guardar(){
          db.collection("projects").doc(this.projectid).update ({
              type: this.type,
              materials: this.materials,
              cordLength: this.cordLength
          }).then (()=>{
              alert ("Proyecto Actualizado");
              this.$router.push("/home");
          });
      },
  }
};
</script>