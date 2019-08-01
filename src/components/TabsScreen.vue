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
      <li class="nav-item" v-for="(project, idx) in openedProjects" :key="idx" :id="'li-'+project">
        <a
          class="nav-link"
          :id="'tab-'+project"
          data-toggle="tab"
          :href="'#content-'+project"
          role="tab"
          :aria-controls="'content-'+project"
          aria-selected="true"
        >
          <button class="close closeTab" type="button" @click="closeTab(project)">×</button>
          {{project}}
        </a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
        <list-projects :filterStatus="'proceso'" @click="listClick"></list-projects>
      </div>
      <div
        v-for="(project2, idx2) in openedProjects"
        :key="'content-'+idx2"
        class="tab-pane fade"
        :id="'content-'+project2"
        role="tabpanel"
        :aria-labelledby="'tab-'+project2"
      >
        <form-base :projectidSource="project2" @created="tabCreated"></form-base>
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
export default {
  name: "tab-screen",
  components: {
    "list-projects": ProgressVue,
    "form-base": FormBase
  },
  data() {
    return {
      openedProjects: []
    };
  },
  created() {},
  watch: {},
  methods: {
    closeTab(id) {
      this.openedProjects = jQuery.grep(this.openedProjects, function(value) {
        return value != id;
      });
      $("#home-tab").tab('show');
    },
    tabCreated(id) {
      console.log("tab created ", id);
      $("#tab-" + id).tab("show");
    },
    listClick(data) {
      console.log(data);
      this.openedProjects.push(data.id);
    }
  }
};
</script>