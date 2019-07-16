<template>
  <div>
    <h1>Diseño Industrial</h1>
    <div class="col-md-8 offset-md-2">
      <br />
      <upload-file
        v-bind:id="'di-dim'"
        v-bind:path="'diseno_industrial'"
        v-bind:label="'Dimensions'"
        v-bind:width="150"
      ></upload-file>
      <br />
      <h4>Module colors</h4>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          value="black"
          id="Black"
          v-model="moduleColors"
        />
        <label class="form-check-label" for="Black">Black</label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          value="silver"
          id="Silver"
          v-model="moduleColors"
        />
        <label class="form-check-label" for="Silver">Silver</label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          value="gold"
          id="Gold"
          v-model="moduleColors"
        />
        <label class="form-check-label" for="Gold">Gold</label>
      </div>
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
          <small id="typeHelp" class="form-text text-muted">Tipo de luminaria</small>
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
          <small id="materialsHelp" class="form-text text-muted">Lista de materiales</small>
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
          <small id="cordHelp" class="form-text text-muted">Cord Length</small>
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
  props: {},
  components: {
    "upload-file": UploadFileVue
  },
  data() {
    return {
      type: "",
      materials: "",
      cordLength: "",
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
      var data = {};
      if (this.moduleColors) {
        data["moduleColors"] = this.moduleColors;
      }
      if (this.type) {
        data["type"] = this.type;
      }
      if (this.materials) {
        data["materials"] = this.materials;
      }
      if (this.cordLength) {
        data["cordLength"] = this.cordLength;
      }

      db.collection("projects")
        .doc(this.projectid)
        .update(data)
        .then(() => {
          alert("Proyecto Actualizado");
          this.$router.push("/home");
        });
    }
  }
};
</script>