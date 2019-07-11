
<template>
  <div class="row">
    <div class="col-md-8">
      <div class="form-group align-bottom">
        <h4>
          <label>{{label}}</label>
        </h4>
        <div class="form-group align-bottom">
          <div class="input-group-prepend align-bottom">
            <input
              :id="id"
              type="file"
              class="form-control align-bottom"
              name="filename"
              accept="image/gif, image/jpeg, image/png"
              @change="preview($event, 'img_'+id)"
            />
            <span class="input-group-btn">
              <button v-if="! empty" class="btn btn-success pull-right" @click="upload">Subir</button>
            </span>
          </div>
        </div>
      </div>
      <div class="progress">
        <div
          :id="'progress_'+id"
          class="progress-bar"
          role="progressbar"
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
          style="width:0%"
        ></div>
      </div>
      <small><a target="blank" v-if="downloadUrl" :href="downloadUrl">{{downloadUrl}}</a></small>
    </div>
    <div class="col-md-4">
      <img :id="'img_'+id" :src="'https://via.placeholder.com/'+width" alt="your image" />
    </div>
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
import firebase from "firebase";
export default {
  name: "upoad-file",
  props: {
    label: String,
    id: String,
    width: Number,
    path: String
  },
  components: {},
  data: function() {
    return {
      empty: true,
      downloadUrl: null
    };
  },
  created() {
    console.log(this.downloadUrl);
  },
  watch: {
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
      this.empty = document.getElementById(this.id).files.length === 0;
    },
    upload() {
      //var _this = this;
      var storageRef = firebase.storage().ref();
      var ref = storageRef.child(this.projectid + "/" + this.path + "/" + this.id + ".jpg");
      var file = document.getElementById(this.id).files[0];
      var uploadTask = ref.put(file);
      uploadTask.on(
        "state_changed",
        snapshot => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          $("#" + "progress_" + this.id)
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
          });
        }
      );
    }
  }
};
</script>