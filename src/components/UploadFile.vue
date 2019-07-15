
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
    <div class="col-md-4">
      <img :id="'img_'+id" :src="'https://via.placeholder.com/'+width" alt="your image" :width="width" />
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
      downloadUrl: null,
      base64: null
    };
  },
  created() {
    console.log(this.downloadUrl);
  },
  watch: {},
  computed: {
    projectid() {
      return this.$route.params.projectid;
    }
  },
  methods: {
    previewFile() {
      var preview = document.getElementById("img_" + this.id);
      var file = document.getElementById(this.id).files[0];
      var reader = new FileReader();
      var _this = this;

      reader.addEventListener(
        "load",
        function() {
          preview.src = reader.result;
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
    
    upload() {
        var data = {};
        data["img"] = this.base64;
        db.collection ("images").doc(this.projectid+"-"+this.id).set (data).then (()=>{
            var progress = 100;

          $("#" + "progress_" + this.id)
            .css("width", progress + "%")
            .attr("aria-valuenow", progress);
        }).then (()=>{
            var data = {};
            data [this.projectid+"-"+this.id] = true;
            return db.collection ("projects").doc (this.projectid).update (data)
        });
    
    }
  }
};
</script>