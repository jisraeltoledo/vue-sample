
<template>
  <div class="row">
    <div :class="isImage&&!multiple?'col-md-8':'col-md-12'">
      <div class="form-group align-bottom">
        <h6>
          <strong>{{label}}</strong>
        </h6>
        <small>{{description}} {{fileType}}</small>
        <small v-if="multiple"><br />* puedes subir más de 1</small>
        <div class="form-group align-bottom">
          <div class="input-group-prepend align-bottom">
            <input
              :id="id"
              :multiple="multiple"
              type="file"
              class="form-control align-bottom"
              :accept="fileType===undefined?'*':fileType"
              @change="preview"
              :disabled="disabled"
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
      <div v-if="isImage && project[id]">
        <template v-for="(img, i) in project[id]">
          <img :src="img" :key="'img'+i" width="100">
        </template>
      </div>
      <!-- <small>
        <a target="blank" v-if="downloadUrl" :href="downloadUrl">{{downloadUrl}}</a>
      </small> -->
    </div>
    <div class="row" v-if="isImage">
      <div class="col-md-4" v-for="(img, idx) in imgs" :key="'prev_'+idx">
        <img :id="'img_'+idx" :src="img" alt="preview" :width="width" />
      </div>
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
    description: String,
    id: String,
    width: Number,
    path: String,
    fileType: String,
    multiple: Boolean,
    disabled: Boolean,
    project: Object
  },
  components: {},
  data: function() {
    return {
      empty: true,
      downloadUrl: null,
      urls: [],
      base64: null,
      ext: "",
      imgs: [],
      promises: [],
    };
  },
  created() {
    console.log (this.project[this.id]);
  },
  watch: {},
  computed: {
    projectid() {
      return this.$route.params.projectid;
    },
    isImage() {
      console.log ("this.fileType",this.fileType);
      return (
        this.fileType !== undefined &&
        (this.fileType === "images/*" ||
          this.fileType.includes(".jpg") ||
          this.fileType.includes(".png"))
      );
    }
  },
  methods: {
    preview() {
      console.log ("id", this.id);
      console.log ("document id", document.getElementById(this.id));
      var files = document.getElementById(this.id).files;
      console.log("files.length", files.length);
      if (files.length > 0) this.empty = false;
      else this.empty = true;
      console.log("files", files);
      Array.from(files).forEach(file => {
        this.previewFile(file);
      });
    },
    previewFile(file) {
      console.log("file", file);
      var reader = new FileReader();
      reader.onload = e => {
        this.imgs.push(e.target.result);
      };
      reader.readAsDataURL(file);
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
    uploadFile(file, cont) {
      const name = file.name;
      const lastDot = name.lastIndexOf(".");
      const fileName = name.substring(0, lastDot);
      this.ext = name.substring(lastDot + 1);
      var p;
      var ref = firebase
        .storage()
        .ref()
        .child(this.path + "/" + this.id + "/" + cont + "." + this.ext);

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
          p = uploadTask.snapshot.ref.getDownloadURL();
      });
      return uploadTask.then (snap => {
        return snap.ref.getDownloadURL ();
      });
    },
    upload() {
      this.promises = [];
      var files = document.getElementById(this.id).files;
      var cont = 1;
      Array.from(files).forEach(file => {
        this.promises.push (this.uploadFile(file, cont++));
      });
      Promise.all (this.promises).then (res => {
        console.log ("res", res);        
        this.$emit ("uploaded", res, this.id);
      }).catch (err=>{
        console.log (err);
      });      
    }
  }
};
</script>