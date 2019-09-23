<template>
  <div class="container" v-if="hasRol ('moderador')">
    <div class="form-group align-bottom col-md-6 offset-md-3">
      <div class="input-group-prepend align-bottom">
        <input
          id="upload-font"
          type="file"
          class="form-control align-bottom"
          accept=".ttf"
          @change="checkIsEmpty()"
        />
        <span class="input-group-btn">
          <button v-if="! empty" class="btn btn-success pull-right" @click="upload">Subir</button>
        </span>
      </div>
      <div class="progress">
        <div
          id="progress-indicator"
          class="progress-bar"
          role="progressbar"
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
          style="width:0%"
        ></div>
      </div>
    </div>
    <div class="col-md-6 offset-md-3" style="margin-top: 10px;">
      <label>Nombre</label>
      <input type="text" placeholder="(Arial, Curier, etc)" class="form-control" v-model="nombre" />
    </div>
    <div class="col-md-6 offset-md-3" style="margin-top: 10px;">
      <label>Tipo</label>
      <input type="text" placeholder="(normal, bold)" class="form-control" v-model="tipo" />
    </div>
    <div class="col-md-6 offset-md-3" style="margin-top: 10px;" v-if="ready">
      <button class="btn btn-primary" @click="save">Guardar</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import { db } from "@/main";
import UploadFileVue from "./UploadFile.vue";

export default {
  name: "font-create",
  data() {
    return {
      empty: true,
      nombre: "",
      tipo: "",
      downloadUrl: "",
      base64: "",
      ready: false
    };
  },
  components: {},
  created() {},

  methods: {
    save() {
        db.collection("fonts").doc (this.nombre + "-" + this.tipo).set({
            nombre: this.nombre,
            tipo: this.tipo,
            url: this.downloadUrl,
            base64: this.base64
        }).then (()=>{
            alert ("La fuente se ha guardado");
            $("#upload-font").val("");
            this.nombre = "";
            this.tipo = "";
            this.ready = false;
            this.empty = true;
            this.downloadUrl = "";
            this.base64 = "";
            $("#progress-indicator")
            .css("width", 0 + "%")
            .attr("aria-valuenow", 0);
        });
    },
    loadFont() {
      var reader = new FileReader();
      reader.onload = e => {
        // .split(",").pop() => remove first part data:[<mediatype>][;base64],<data>
        this.base64 = e.target.result.split(",").pop();
        this.ready = true;
      };
      var xhr = new XMLHttpRequest();
      xhr.open("GET", this.downloadUrl);
      xhr.responseType = "blob"; //force the HTTP response, response-type header to be blob
      xhr.onload = function() {
        reader.readAsDataURL(xhr.response); //xhr.response is now a blob object
      };
      xhr.send();
    },
    upload() {
      var files = document.getElementById("upload-font").files;
      var ref = firebase
        .storage()
        .ref()
        .child("fonts/" + this.nombre + "-" + this.tipo + ".ttf");

      var uploadTask = ref.put(files[0]);
      uploadTask.on(
        "state_changed",
        snapshot => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          $("#progress-indicator")
            .css("width", progress + "%")
            .attr("aria-valuenow", progress);
        },
        error => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.downloadUrl = downloadURL;
            this.loadFont ();
            console.log("File available at", downloadURL);
          });
        }
      );
      return uploadTask.then(snap => {
        return snap.ref.getDownloadURL();
      });
    },
    checkIsEmpty() {
      var files = document.getElementById("upload-font").files;
      this.empty = !files.length > 0;
      this.nombre = files[0].name.split("-")[0];
      this.tipo = files[0].name.split("-")[1];
      this.tipo = this.tipo.substring(0, this.tipo.indexOf("."));
    }
  }
};
</script>