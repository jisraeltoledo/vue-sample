<template>
  <div>
    <h1>{{title}}</h1>
    <div class="col-md-6 offset-md-3">
      <form id="app" @submit="guardar">
        <div v-if="errors.length">
          <b>Por favor corrige los errores:</b>
          <ul>
            <li v-for="(error, idx) in errors" :key="idx">{{ error }}</li>
          </ul>
        </div>

        <div class="form-group">
          <label for="formGroupExampleInput">
            Nombre
            <small>*</small>
          </label>
          <input
            required
            v-model="nombre"
            type="text"
            class="form-control"
            id="formGroupExampleInput"
            placeholder="Nombre del proyecto"
          />
        </div>
        <div class="form-group">
          <label for="formGroupExampleInput">
            Clave
            <small>*</small>
          </label>
          <input
            v-model="modelo"
            type="text"
            class="form-control"
            id="formGroupExampleInput"
            placeholder="Ej. .004"
          />
        </div>
        <div class="form-group">
          <label for="exampleFormControlTextarea1">
            Descripción
            <small>*</small>
          </label>
          <ckeditor :editor="editor" v-model="descripcion" :config="editorConfig"></ckeditor>
          <!-- <textarea
            v-model="descripcion"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
          ></textarea>-->
        </div>
        <div class="form-group">
          <label for="formGroupExampleInput">
            Código de barras
            <small>*</small>
          </label>
          <input
            v-model="barCode"
            type="text"
            class="form-control"
            id="formGroupExampleInput"
            placeholder="Ej. 82912819281"
          />
        </div>
        <div class="form-group">
          <label for="select-form">
            Formulario
            <small>*</small>
          </label>
          <select v-model="form" class="form-control" id="select-form">
            <option v-for="f in forms" :key="f">{{f}}</option>
          </select>
        </div>
        <div>
          <div class="form-check">
            <input
              v-model="isFamily"
              class="form-check-input"
              type="checkbox"
              value="true"
              id="isFamily"
            />
            <label class="form-check-label" for="isFamily">Es familia</label>
          </div>
        </div>
        <br />
        <button class="btn btn-success" @click="guardar">Guardar</button>
        <button class="btn" @click="cancelar">Cancelar</button>
      </form>
      <br />
    </div>
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
  name: "create-project",
  props: {},
  data() {
    return {
      nombre: "",
      modelo: "",
      descripcion: "",
      bio: "",
      errors: [],
      disenador: "",
      title: "Crear producto",
      barCode: "",
      isFamily: false,
      forms: [],
      form: "",
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {}
    };
  },
  mounted (){
    this.editor.resize( '100%', '350', true );
  },
  created() {
    if (this.$route.params.projectid) {
      this.title = "Editar proyecto";
      db.collection("projects")
        .doc(this.$route.params.projectid)
        .get()
        .then(doc => {
          this.nombre = doc.data().C03;
          this.modelo = doc.data().C01;
          this.descripcion = doc.data().C02;
          this.barCode = doc.data().C04;
        });
    }
    db.collection("forms")
      .get()
      .then(docs => {
        docs.forEach(doc => {
          this.forms.push(doc.id);
        });
      })
      .then(() => {
        this.form = this.forms[0];
      });
  },
  watch: {
    isFamily: function(nV, oV) {}
  },
  methods: {
    cancelar() {
      this.$router.push("/home");
    },
    createKey(name) {
      console.log(name);
      const arrName = [];
      let curName = "";
      name
        .toLowerCase()
        .split("")
        .forEach(letter => {
          curName += letter;
          arrName.push(curName);
        });
      return arrName;
    },
    guardar(e) {
      if (this.name && this.age) {
        return true;
      }

      this.errors = [];

      if (!this.nombre) {
        this.errors.push("Nombre es requerido.");
      }
      if (!this.modelo) {
        this.errors.push("Modelo es requerido.");
      }
      if (!this.descripcion) {
        this.errors.push("Descripción es requerido.");
      }
      if (!this.barCode) {
        this.errors.push("Código de barras es requerido");
      }

      e.preventDefault();
      var keywords = [];
      keywords = keywords.concat(this.createKey(this.descripcion));
      keywords = keywords.concat(this.createKey(this.nombre));

      if (this.errors.length == 0) {
        db.collection("projects")
          .add({
            C03: this.nombre,
            C01: this.modelo,
            C02: this.descripcion,
            C04: this.barCode,
            status: "proceso",
            step: "estructuras",
            created: new Date().getTime(),
            form: this.form,
            isFamily: this.isFamily,
            keywords: Array.from(new Set(keywords))
          })
          .then(ref => {
            alert("se guardó el proyecto correctamente");
            this.$router.push("/home");
          });
      }
    }
  }
};
</script>

<style>
  .ck-editor__editable {
    min-height: 300px;
   }
</style>