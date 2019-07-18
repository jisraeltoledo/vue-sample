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
            Modelo
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
          <textarea
            v-model="descripcion"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="formGroupExampleInput">
            Nombre Diseñador
            <small>*</small>
          </label>
          <input
            v-model="disenador"
            type="text"
            class="form-control"
            id="formGroupExampleInput"
            placeholder="Ej. Juan Perez"
          />
        </div>
        <div class="form-group">
          <label for="exampleFormControlTextarea1">
            Bio diseñador
            <small>*</small>
          </label>
          <textarea v-model="bio" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        </div>
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
      title: "Crear proyecto"
    };
  },
  created() {
    if (this.$route.params.projectid) {
      this.title = "Editar proyecto";
      db.collection("projects")
        .doc(this.$route.params.projectid)
        .get()
        .then(doc => {
          this.nombre = doc.data().nombre;
          this.modelo = doc.data().modelo;
          this.descripcion = doc.data().descripcion;
          this.bio = doc.data ().bio;
          this.disenador = doc.data().disenador;
        });
    }
  },
  methods: {
    cancelar() {
      this.$router.push("/home");
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
      if (!this.disenador) {
        this.errors.push("Nombre de diseñador es requerido.");
      }
      if (!this.bio) {
        this.errors.push("Biografía es requerido.");
      }

      e.preventDefault();
      if (this.errors.length == 0) {
        db.collection("projects")
          .add({
            nombre: this.nombre,
            modelo: this.modelo,
            descripcion: this.descripcion,
            disenador: this.disenador,
            bio: this.bio
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