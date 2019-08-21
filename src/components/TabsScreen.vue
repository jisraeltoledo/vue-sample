<template>
  <div class="home" v-if="show">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link active"
          id="home-tab"
          data-toggle="tab"
          href="#home"
          role="tab"
          aria-controls="home"
          aria-selected="true"
        >Proyectos</a>
      </li>
      <li
        class="nav-item"
        v-for="(p, idx) in openedProjects"
        :key="idx"
        :id="'li-'+p.type+'-'+p.project.id"
      >
        <a
          class="nav-link"
          :id="'tab-'+p.type+'-'+p.project.id"
          data-toggle="tab"
          :href="'#content-'+p.type+'-'+p.project.id"
          role="tab"
          :aria-controls="'content-'+p.type+'-'+p.project.id"
          aria-selected="true"
        >
          <button class="close closeTab" type="button" @click="closeTab(p)">×</button>
          <i v-if="p.type==='edit'" class="fas fa-edit"></i>
          <i v-if="p.type==='see'" class="fas fa-eye" style="color: black;"></i>
          [{{p.project.C01?p.project.C01:""}}] {{p.project.C03?p.project.C03:""}}
        </a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
        <div class="row" style="margin: 20px;">
          <div class="col-md-3 ">
            <div class="input-group">
              <input
                id="searchField"
                type="text"
                class="form-control"
                placeholder="Search for..."
                aria-label="Search"
                aria-describedby="basic-addon2"
                @input="searchChange"
              />
              <div class="input-group-append">
                <button class="btn btn-primary" type="button">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-2 offset-md-3 text-center">
            <button class="btn btn-primary" @click="crearColeccion">Crear colección</button>
          </div>
          <div class="col-md-2 text-center">
            <button class="btn btn-info" @click="crearFamilia">Crear familia</button>
          </div>
          <div class="col-md-1 text-center">            
            <button class="btn btn-success" @click="changeStatus('publicado')">Publicar</button>
          </div>
          <div class="col-md-1 text-center">            
            <button class="btn btn-danger" @click="changeStatus('retirado')">Retirar</button>
          </div>
        </div>
        <list-projects :filterStatus="'proceso'" @click="listClick" ref="listProjects" :products="searchResults"></list-projects>
      </div>
      <div
        v-for="(p, idx2) in openedProjects"
        :key="'content-'+p.type+'-'+idx2"
        class="tab-pane fade"
        :id="'content-'+p.type+'-'+p.project.id"
        role="tabpanel"
        :aria-labelledby="'tab-'+p.type+'-'+p.project.id"
      >
        <form-base v-if="p.type==='edit'" :projectidSource="p.project.id" @created="tabCreated" @editFamily="editFamily"></form-base>

        <producto v-if="p.type==='see'" :productId="p.project.id" @created="tabCreated"></producto>
      </div>
    </div>
  </div>
</template>
<style>
.nav-tabs > li .close {
  margin: -2px 0 0 10px;
  font-size: 18px;
}
.marginBottom {
  margin-bottom: 1px !important;
}
.operationDiv {
  padding: 5px 10px 5px 5px;
}
.operationDivWrapper {
  margin-top: -1px;
}
.leftMenu {
  height: 70%;
  background-color: #e6e6e6;
  border-right: 2px solid #bfbfbf;
}
</style>
<script>
import firebase from "firebase";
// @ is an alias to /src
import ProgressVue from "@/components/Progress.vue";
import { db } from "@/main";
import FormBase from "@/components/FormBase";
import { without } from "underscore";
import ProductoVue from "./Producto.vue";
export default {
  name: "tab-screen",
  components: {
    "list-projects": ProgressVue,
    "form-base": FormBase,
    producto: ProductoVue
  },
  data() {
    return {
      openedProjects: [],
      show: true,
      searchResults: []
    };
  },
  created() {},
  watch: {},
  methods: {
    changeStatus (status){
      if (confirm ("Estás seguro de llevar a cabo esta acción?")){
        this.$refs.listProjects.changeStatus(status);
      }
    },
    editFamily(family){
      
      this.listClick({ project: family, type: 'edit' });
    },
    searchChange() {
      
      this.search($("#searchField").val());
    },
    search(word) {
      if (word === ''){
        this.searchResults = null;
        return;
      }
      db.collection("products")
        .where("keywords", "array-contains", word.toLowerCase ())
        .limit(10)
        .get()
        .then(docs => {
          this.searchResults = [];
          docs.forEach(doc => {
            this.searchResults.push (doc.data());
          });
        });
    },
    rerender() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
        
        this.$nextTick(() => {
          
        });
      });
    },
    crearFamilia (){
      this.$refs.listProjects.crearFamilia();
    },
    crearColeccion() {
      this.$refs.listProjects.crearColeccion();
    },
    closeTab(p) {
      this.openedProjects = jQuery.grep(this.openedProjects, value => {
        return !this.same(value, p);
      });
      this.rerender();
    },
    same(o1, o2) {
      return o1.project.id === o2.project.id && o1.type === o2.type;
    },
    tabCreated(id) {
      var data = this.openedProjects[this.openedProjects.length - 1];
      $("#tab-" + data.type + "-" + data.project.id).tab("show");
    },
    listClick(data) {
      this.openedProjects.push(data);
    }
  }
};
</script>