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
    preview(e, divId) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        $("#" + divId)
          .attr("src", e.target.result)
          .width(150);
      };
      reader.readAsDataURL(files[0]);
    },
    upload(input) {
      var storageRef = firebase.storage().ref();
      var ref = storageRef.child(this.projectid + "/" + input + ".jpg");
      var file = document.getElementById(input).files[0];
      var uploadTask = ref.put(file);
      uploadTask.on(
        "state_changed",
        function(snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
        },
        function(error) {
          // Handle unsuccessful uploads
        },
        function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  }
};
</script>