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
      <li class="nav-item" v-for="(project, idx) in openedProjects" :key="idx">
        <a
          class="nav-link"
          :id="'tab-'+project"
          data-toggle="tab"
          :href="'#content-'+project"
          role="tab"
          :aria-controls="'content-'+project"
          aria-selected="true"
        >{{project}}</a>
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
        <form-base :projectidSource="project2"></form-base>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import ProgressVue from "@/components/Progress.vue";
import { db } from "@/main";
import FormBase from "@/components/FormBase";
export default {
  name: "tab-screen",
  components: {
    "list-projects": ProgressVue,
    "form-base": FormBase
  },
  data() {
    return {
      openedProjects: [
      ]
    };
  },
  created() {},
  watch: {
  },
  methods: {
      listClick (data){
          console.log (data);
          this.openedProjects.push (data.id);
          console.log ('.nav-tabs a[href="#content-'+data.id+'"]');
          console.log ("document", $('.nav-tabs a[href="#content-'+data.id+'"]'));
          $('.nav-tabs a[href="#content-'+data.id+'"]').tab('show');
      },
  }
};
</script>