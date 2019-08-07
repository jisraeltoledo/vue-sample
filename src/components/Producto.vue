<template>
  <div v-if="project && fields">
    <h2>Producto</h2>
    <div class="row">
      <div class="col-md-6" v-for="(k, idx) in keys" :key="idx">
        <div class="card mb-3" v-if="fields[k]">
          <div class="card-header">
            <strong>{{k}} - {{fields[k].nombre}}</strong>
          </div>
          <div class="card-body">
            <div v-if="fields[k].fileType && fields[k].fileType === 'images/*'">
              <img class="img-fluid" :src="project[k]" />
            </div>
            <div v-else-if="fields[k].fileType && fields[k].fileType !== 'images/*'">
              <a :href="project[k]" target="blank"><i class="fas fa-download fa-5x"></i></a>
            </div>
            <div v-else-if="fields[k].tipo && fields[k].tipo  === 'barcode'">
              <barcode :value="project[k]" :options="{ displayValue: true }"></barcode>
            </div>
            <div v-else-if="fields[k].tipo && fields[k].tipo  === 'boolean'">              
              <i  v-if="project[k]" class="fas fa-check-square fa-5x"></i>
              <i v-else  class="fas fa-times-circle fa-5x"></i>
            </div>
            <div v-else>
              {{project[k]}}
            </div>
          </div>
          <!-- <div class="card-footer small text-muted">Updated yesterday at 11:59 PM</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import ProgressVue from "@/components/Progress.vue";
import { db } from "@/main";
import fields from "@/assets/fields.json";
import mock from "@/assets/MOCK_DATA.json";
import TabsScreenVue from "../components/TabsScreen.vue";
import VueBarcode from "@xkeshi/vue-barcode";
export default {
  name: "product",
  components: {
    barcode: VueBarcode
  },
  props: {
    productId: String
  },
  data() {
    return {
      projectid: String,
      project: null,
      form: null,
      fields: null
    };
  },
  computed: {
    keys() {
      var keys = Object.keys(this.project);
      console.log("keys", keys);
      return keys;
    }
  },
  
  mounted() {
    this.projectid = this.$route.params.projectid
      ? this.$route.params.projectid
      : this.productId
      ? this.productId
      : "";
    this.loadProject();
    console.log("fields mounted", this.fields);
  },
  watch: {
    fields(newValue) {
      console.log("fields whatch:", this.fields);
    }
  },
  methods: {
    loadProject() {
      return db
        .collection("projects")
        .doc(this.projectid)
        .get()
        .then(doc => {
          this.project = doc.data();
          return this.project.form;
        })
        .then(formid => {
          return db
            .collection("forms")
            .doc(formid)
            .get();
        })
        .then(doc => {
          this.form = doc.data();
          return this.getFields(this.form.fields);
        })
        .then(docs => {
          this.fields = {};
          docs.forEach(doc => {
            this.fields[doc.data().id] = doc.data();
          });
          return true;
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    getFields(fields) {
      var promises = [];
      fields.forEach(field => {
        promises.push(
          db
            .collection("fields")
            .doc(field)
            .get()
        );
      });

      return Promise.all(promises);
    }
  }
};
</script>