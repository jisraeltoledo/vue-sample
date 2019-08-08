<template>
  <div class="home">
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
          <div class="col-md-4 offset-md-8">
            <button class="btn btn-primary" @click="crearColeccion">Crear colección</button>
          </div>
        </div>
        <list-projects :filterStatus="'proceso'" @click="listClick" ref="listProjects"></list-projects>
      </div>
      <div
        v-for="(p, idx2) in openedProjects"
        :key="'content-'+p.type+'-'+idx2"
        class="tab-pane fade"
        :id="'content-'+p.type+'-'+p.project.id"
        role="tabpanel"
        :aria-labelledby="'tab-'+p.type+'-'+p.project.id"
      >
        
        <form-base v-if="p.type==='edit'" :projectidSource="p.project.id" @created="tabCreated"></form-base>
        
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
      openedProjects: []
    };
  },
  created() {},
  watch: {},
  methods: {
    crearColeccion() {
      console.log("listprojects", this.$refs.listProjects);
    },
    closeTab(p) {
      console.log ("closing", p);
      console.log (this.openedProjects);
      this.openedProjects = jQuery.grep(this.openedProjects, (value)=> {
        return ! this.same (value, p);
      });
      console.log (this.openedProjects);
      $("#home-tab").tab("show");
    },
    same (o1, o2){
      return o1.project.id === o2.project.id && o1.type === o2.type;
    },
    tabCreated(id) {
      var data = this.openedProjects[this.openedProjects.length-1];
      $("#tab-"+data.type+'-'+data.project.id).tab("show");
    },
    listClick(data) {
      console.log("listclick", data);
      this.openedProjects.push(data);
    }
  }
};
</script>