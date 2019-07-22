
<template>
  <div class="row">
    <div :class="isImage?'col-md-8':'col-md-12'">
      <div class="form-group align-bottom">
        <h5>
          <label>{{label}}</label>
        </h5>
        <div class="form-group align-bottom">
          <div class="input-group-prepend align-bottom">
            <input
              :id="id"
              type="file"
              class="form-control align-bottom"
              :accept="fileType===undefined?'*':fileType"
              @change="previewFile($event, 'img_'+id)"
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
      <small>
        <a target="blank" v-if="downloadUrl" :href="downloadUrl">{{downloadUrl}}</a>
      </small>
    </div>
    <div class="col-md-4" v-if="isImage">
      <img
        :id="'img_'+id"
        :src="'https://via.placeholder.com/'+width"
        alt="your image"
        :width="width"
      />
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
    path: String,
    fileType: String
  },
  components: {},
  data: function() {
    return {
      empty: true,
      downloadUrl: null,
      base64: null,
      ext: ""
    };
  },
  created() {
    console.log(this.downloadUrl);
  },
  watch: {},
  computed: {
    projectid() {
      return this.$route.params.projectid;
    },
    isImage() {
      return (
        this.fileType !== undefined &&
        (this.fileType === "image/*" ||
          this.fileType.includes(".jpg") ||
          this.fileType.includes(".png"))
      );
    }
  },
  methods: {
    previewFile() {
      var preview = document.getElementById("img_" + this.id);
      var file = document.getElementById(this.id).files[0];
      const name = file.name;
      const lastDot = name.lastIndexOf(".");
      const fileName = name.substring(0, lastDot);
      this.ext = name.substring(lastDot + 1);

      var reader = new FileReader();
      var _this = this;

      reader.addEventListener(
        "load",
        function() {
          if (preview != null) {
            preview.src = reader.result;
          }
          _this.base64 = reader.result;
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
        this.empty = false;
      } else {
        this.empty = true;
      }
    },
    store() {
      var data = {};
      data["img"] = this.base64;
      db.collection("images")
        .doc(this.projectid + "-" + this.id)
        .set(data)
        .then(() => {
          var progress = 100;

          $("#" + "progress_" + this.id)
            .css("width", progress + "%")
            .attr("aria-valuenow", progress);
        })
        .then(() => {
          var data = {};
          data[this.projectid + "-" + this.id] = true;
          return db
            .collection("projects")
            .doc(this.projectid)
            .update(data);
        });
    },
    upload() {
      //var _this = this;
      var storageRef = firebase.storage().ref();
      var ref = storageRef.child(
        this.path + "/" + this.id +'.'+ this.ext
      );
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
            this.$emit ('uploaded:url', downloadURL);
          });
        }
      );
    }
  }
};
</script>