<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-6" style="margin-top: 10px;">
        <label for="id">ID</label>
        <input type="text" placeholder="ID" min="0" step="1" v-model="data.id" class="form-control" />
      </div>
      <div class="col-sm-6" style="margin-top: 10px;">
        <label>Nombre:</label>
        <input type="text" v-model="data.nombre" placeholder="Nombre" class="form-control" />
      </div>
      <div class="col-md-6" style="margin-top: 10px;">
        <label>Descripción</label>
        <input
          type="text"
          v-model="data.descripcion"
          placeholder="Descripción"
          class="form-control"
        />
      </div>
      
      <div class="col-md-6" style="margin-top: 10px;">
        <label>Departamento</label>
        <select v-model="data.departamento" class="form-control">
          <option value="moderador">Moderador</option>
          <option value="estructuras">Estructuras</option>
          <option value="diseño grafico">Diseño Grafico</option>
          <option value="diseño industrial">Diseño Industrial</option>
          <option value="ingenieria electrica">Ingenieria Electrica</option>
          <option value="fotometria">Fotometria</option>
          <option value="ventas">Ventas</option>
          <option value="super admin">Super Admin</option>
          <option value="sistema">Sistema</option>
        </select>
      </div>
      <div class="col-md-6" style="margin-top: 10px;">
        <label>Tipo</label>
        <select v-model="data.tipo" class="form-control">
          <option value="texto">Texto</option>
          <option value="textarea">Texto largo</option>
          <option value="numero">Número</option>
          <option value="boolean">Boolean</option>
          <option value="check">Check</option>
          <option value="radio">Radio</option>
          <option value="file">Archivo</option>
          <option value="files">Archivos</option>
        </select>
      </div>
      <div class="col-md-6" style="margin-top: 10px;" v-if="data.tipo=='file'||data.tipo=='files'">
        <label>Tipo de archivo</label>
        <input
          type="text"
          v-model="data.fileType"
          placeholder=".zip | images/* | .pdf"
          class="form-control"
          :disabled="!(data.tipo=='file'||data.tipo=='files')"
        />
      </div>
      <div class="col-md-6" style="margin-top: 10px;" v-if="data.tipo=='radio'||data.tipo=='check'">
        <label>Opciones <small>(1 por linea)</small></label>
      <textarea v-model="options" class="col-md-12 form-control">

      </textarea>
      </div>
      <div class="col-md-6" style="margin-top: 10px;">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="true" v-model="data.obligatorio" />
          <label class="form-check-label">Obligatorio</label>
        </div>
      </div>
      <div class="col-md-6" style="margin-top: 10px;">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value="true"
            v-model="data.editableIfFamily"
          />
          <label class="form-check-label">Editar si tiene familia</label>
        </div>
      </div>
      <button class="btn btn-primary" style="margin-top: 10px;" @click="guardar">Guardar</button>
      <button class="btn" style="margin-top: 10px;" @click="cancelar">Cancelar</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import ProgressVue from "@/components/Progress.vue";
import { db } from "@/main";
export default {
  name: "field-edit",

  data() {
    return {
      id: 0,
      data: {
        id: "",
        nombre: "",
        descripcion: "",
        departamento: "",
        tipo: "",
        fileType: "",
        options: [],
        editableIfFamily: false,
        obligatorio: false
      },
      options: ""
    };
  },
  computed: {
  },
  components: {},
  created() {
    if (this.$route.params.id !== "new") {
      db.collection("fields")
        .doc(this.$route.params.id)
        .get()
        .then(snap => {
          if (snap.exists){
            this.data = snap.data();
            this.options = this.data.options.join ('\n');
          }          
        });
    }
  },
  methods: {
    cancelar() {
      this.$router.replace('/fields'); 
    },
    guardar() {
      this.data["options"] = this.options.split('\n');
      db.collection("fields")
        .doc(this.data.id).set (this.data).then (()=>{
          alert ("Campo guardado");
          this.$router.replace('/fields');          
        });
    }
  }
};
</script>