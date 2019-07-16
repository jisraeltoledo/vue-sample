<template>
  <div>
    <h1>Progreso de proyectos</h1>
    <div class="col-md-8 offset-md-2">
      <table class="table thead-dark">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Progreso</th>
            <th scope="col">ExportPDF</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(project, idx) in projects"
            :key="idx"
          >
            <td>{{project.nombre}}</td>
            <td>
              <div class="progress">
                <div
                  :id="'progress_'+project.id"
                  class="progress-bar"
                  role="progressbar"
                  :aria-valuenow="progress[project.id]"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :style="'width:'+progress[project.id]+'%'"
                ></div>
              </div>
            </td>
            <td class="text-center"><export-pdf v-bind:projectid="project.id"></export-pdf></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
import ExportPDFVue from './ExportPDF.vue';

export default {
  name: "list-project-progress",
  props: {},
  components: {
      "export-pdf": ExportPDFVue
  },
  data() {
    return {
      projects: [],
      progress: {}
    };
  },
  created() {
    db.collection("projects")
      .get()
      .then(snap => {
        snap.forEach(element => {
          let p = element.data();
          p["id"] = element.id;
          this.progress[element.id] = this.getProgress(p);
          this.projects.push(p);
        });
      });
      console.log ("progress", this.progress);
  },

  methods: {
    getProgress(project) {
      var progress = this.getProgressCreate(project);
      progress += this.getProgressDisenoG(project);
      progress += this.getProgressDisenoI(project);
      progress += this.getProgressIngElec(project);
      return progress;
    },
    setProgress(project) {
      console.log("project", project);
      var progress = this.getProgressCreate(project);
      progress += this.getProgressDisenoG(project);
      progress += this.getProgressDisenoI(project);
      progress += this.getProgressIngElec(project);
      console.log("progress", $("#" + "progress_" + project.id));
      $("#" + "progress_" + project.id)
        .css("width", progress + "%")
        .attr("aria-valuenow", progress);
    },
    clickList(project) {
      this.$router.push("/" + this.$route.params.next_path + "/" + project.id);
    },
    getProgressCreate(project) {
      var progress = 0;
      if (project.nombre) {
        progress += 5;
      }
      if (project.modelo) {
        progress += 5;
      }
      if (project.descripcion) {
        progress += 5;
      }
      if (project.disenador) {
        progress += 5;
      }
      if (project.bio) {
        progress += 5;
      }
      console.log ("progress create", progress);
      return progress;
    },
    getProgressDisenoG(project) {
      var progress = 0;
      if (project[project.id + "-bio"]) {
        progress += 6;
      }
      if (project[project.id + "-dim"]) {
        progress += 6;
      }
      if (project[project.id + "-est"]) {
        progress += 6;
      }
      if (project[project.id + "-prod"]) {
        progress += 7;
      }
console.log ("progress DG", progress);
      return progress;
    },
    getProgressDisenoI(project) {
      var progress = 0;
      if (project.moduleColors) {
        progress += 5;
      }
      if (project[project.id + "-di-dim"]) {
        progress += 5;
      }
      if (project.type) {
        progress += 5;
      }
      if (project.materials) {
        progress += 5;
      }
      if (project.cordLength) {
        progress += 5;
      }
      console.log ("progress DI", progress);
      return progress;
    },
    getProgressIngElec(project) {
      var progress = 0;
      if (project.input) {
        progress += 3.5;
      }
      if (project.voltage) {
        progress += 3.5;
      }
      if (project.dimming) {
        progress += 3.5;
      }
      if (project.lumenOutput) {
        progress += 3.5;
      }
      if (project.colorTemperature) {
        progress += 3.5;
      }
      if (project.cri) {
        progress += 3.5;
      }
      if (project.lifeSpan) {
        progress += 4;
      }
      console.log ("progress IngEle", progress);
      return progress;
    }
  }
};
</script>