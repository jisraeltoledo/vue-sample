<template>
  <div v-if="project && fields">
    <h2>
      <div v-if="project.isFamily">Familia</div>
      <div v-else>Producto</div>
      <i
        :id="'heart-see-'+project.id"
        class="fas fa-heart"
        @click="like(project)"
        :style="'cursor: pointer;'+colorHeart(project.id)"
      ></i>
    </h2>
    <div class="row" v-if="project.isFamily">
      <div class="col-md-6">
        Productos en la Familia:
        <ul>
          <li v-for="(p, i) in products" :key="i">
            <a href @click="clickProduct(p, $event)">[{{p.C01}}] - {{p.C03}}</a>
          </li>
        </ul>
      </div>
      <div class="col-md-6">
        <button class="btn btn-primary" @click="agregarProducto">Agregar producto</button>
      </div>
    </div>
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
              <a :href="project[k]" target="blank">
                <i class="fas fa-download fa-5x"></i>
              </a>
            </div>
            <div v-else-if="fields[k].tipo && fields[k].tipo  === 'barcode'">
              <barcode :value="project[k]" :options="{ displayValue: true }"></barcode>
            </div>
            <div v-else-if="fields[k].tipo && fields[k].tipo  === 'boolean'">
              <i v-if="project[k]" class="fas fa-check-square fa-5x"></i>
              <i v-else class="fas fa-times-circle fa-5x"></i>
            </div>
            <div v-else>{{project[k]}}</div>
          </div>
          <!-- <div class="card-footer small text-muted">Updated yesterday at 11:59 PM</div> -->
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="modalAddProduct"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalAddProductLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalAddProductLabel">Agrega productos</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="col-md-12 form-group">
              <div class="input-group">
                <input
                  id="searchField"
                  type="text"
                  class="form-control"
                  placeholder="Search for..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  v-model="searchInput"
                />
                <div class="input-group-append">
                  <button class="btn btn-primary" type="button">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <br />
            <div class="col-md-12 form-group">
              <select multiple size="6" class="form-control" id="select-products">
                <option
                  :value="p.id"
                  v-for="(p, i) in searchProjects"
                  :key="i"
                >{{p.C01 + ' '+ p.C03}}</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="guardar">Guardar</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          </div>
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
import store from "@/store";
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
      fields: null,
      products: [],
      searchProjects: [],
      searchInput: ""
    };
  },
  computed: {
    keys() {
      var keys = Object.keys(this.project);
      console.log("keys", keys);
      return keys;
    }
  },
  created() {},
  mounted() {
    this.projectid = this.$route.params.projectid
      ? this.$route.params.projectid
      : this.productId
      ? this.productId
      : "";
    this.loadProject();
    console.log("fields mounted", this.fields);
    this.$emit("created", this.projectid);
    this.searching();
  },
  watch: {
    fields(newValue) {
      console.log("fields whatch:", this.fields);
    },
    searchInput(newValue) {
      this.searching();
    }
  },
  methods: {
    guardar() {
      var arr = [];
      $("#select-products").val().forEach((element) => {
        arr.push(element);
      });
      console.log ("before", this.project.products);
      this.project.products = Array.from(new Set (this.project.products.concat (arr)));
      console.log ("after",this.project.products);
      db.collection ("projects").doc(this.project.id).update ({products: this.project.products});
      this.loadProducts (this.project.products);
      $("#modalAddProduct").modal("hide");
      $("#select-products option:selected").prop("selected", false);
    },
    searching() {
      var ref = db.collection("projects");
      if (this.searchInput != "") {
        console.log("searching", this.searchInput);
        ref = ref.where(
          "keywords",
          "array-contains",
          this.searchInput.toLowerCase()
        );
      }
      ref.get().then(docs => {
        this.searchProjects = [];
        docs.forEach(doc => {
          var p = doc.data();
          p["id"] = doc.id;
          this.searchProjects.push(p);
        });
      });
      console.log("search", this.searchProjects);
    },
    agregarProducto() {
      $("#modalAddProduct").modal("show");
    },
    clickProduct(p, e) {
      this.$emit("clickProduct", { project: p, type: "see" });
      e.preventDefault();
    },
    colorHeart(projectid) {
      return store.state.user.likes.includes(projectid)
        ? "color: red;"
        : "color: black;";
    },
    like(project) {
      console.log("like", project);
      var projectid = project.id;
      var user = store.state.user;
      console.log("user", user);
      if (!user.likes) user["likes"] = [];
      if (user.likes.includes(projectid)) {
        console.log("includes");
        user.likes = user.likes.filter(item => item !== projectid);
        $("#heart-see-" + projectid).css("color", "black");
        $("#heart-" + projectid).css("color", "black");
      } else {
        console.log("else");
        user.likes.push(projectid);
        $("#heart-see-" + projectid).css("color", "red");
        $("#heart-" + projectid).css("color", "red");
      }
      store.commit("setUser", user);
      console.log(user);
      db.collection("users")
        .doc(user.id)
        .update(user);
    },
    loadProducts(products) {
      console.log("loading products", products);
      this.products = [];
      products.forEach(p => {
        db.collection("projects")
          .doc(p)
          .get()
          .then(d => {
            var data = d.data();
            data["id"] = d.id;
            this.products.push(data);
          });
      });
      console.log("loaded products", this.products);
    },
    loadProject() {
      return db
        .collection("projects")
        .doc(this.projectid)
        .get()
        .then(doc => {
          this.project = doc.data();
          this.project["id"] = doc.id;
          console.log("project", this.project);
          if (this.project.products) {
            this.loadProducts(this.project.products);
          }
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
            if (doc.data()) this.fields[doc.data().id] = doc.data();
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