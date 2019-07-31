<template>
  <div>
    <div class="col-md-12 table-responsive">
      <table class="table thead-dark table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Clave</th>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
            <th scope="col">Versión</th>
            <th scope="col">Días publicado</th>
            <th scope="col">Progreso</th>
            <th scope="col">Status</th>
            <th scope="col">Exportar PDF</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(project, idx) in projects"
            :key="idx"
            class="clickable-row"
            v-on:click="clickList(project)"
            style="cursor: pointer; "
          >
            <td>{{project.C01}}</td>
            <td>{{project.C03}}</td>
            <td>{{project.C02}}</td>
            <td>{{project.version}}</td>
            <td>{{Math.round((new Date().getTime()-project.created)/(1000*60*60*24)) }}</td>
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
            <td>{{project.status}}</td>
            <td class="text-center">
              <!-- <export-pdf v-bind:projectid="project.id"></export-pdf> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
import ExportPDFVue from "./ExportPDF.vue";

export default {
  name: "list-project-progress",
  props: {
    filterStatus: String,
    filterStep: String
  },
  components: {
    "export-pdf": ExportPDFVue
  },
  data() {
    return {
      projects: [],
      progress: {},
      status: null,
      step: null
    };
  },
  created() {
    console.log(new Date().getTime());

    if (this.filterStatus) {
      this.status = this.filterStatus;
    } else if (this.$route.params.status) {
      this.status = this.$route.params.status;
    }
    if (this.filterStep) {
      this.step = this.filterStep;
    } else if (this.$route.params.step) {
      this.step = this.$route.params.step;
    }
    this.getProjects();
  },
  watch: {
    "$route.params.status": {
      handler: function(status) {
        console.log ("status", status);
        if (status === 'all') this.status = null;
        else this.status = status;
        this.getProjects();
      },
      deep: true,
      immediate: true
    },
    status() {
      this.getProjects();
    }
  },
  methods: {
    clickList(project) {
      this.$emit('click', project);
    },
    getProjects() {
      var ref = db.collection("projects");
      if (this.status) {
        ref = ref.where("status", "==", this.status);
      }
      if (this.step) {
        ref = ref.where("step", "==", this.step);
      }
      ref = ref.orderBy('created', 'asc');
      ref.get().then(snap => {
        this.projects = [];
        snap.forEach(element => {
          let p = element.data();
          p["id"] = element.id;
          this.progress[element.id] = this.getProgress(p);
          this.projects.push(p);
        });
      });
    },
    getProgress(project) {
      var progress = this.getProgressCreate(project);
      progress += this.getProgressDisenoG(project);
      progress += this.getProgressDisenoI(project);
      progress += this.getProgressIngElec(project);
      return progress;
    },
    setProgress(project) {
      var progress = this.getProgressCreate(project);
      progress += this.getProgressDisenoG(project);
      progress += this.getProgressDisenoI(project);
      progress += this.getProgressIngElec(project);

      $("#" + "progress_" + project.id)
        .css("width", progress + "%")
        .attr("aria-valuenow", progress);
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

      return progress;
    }
  }
};
</script>