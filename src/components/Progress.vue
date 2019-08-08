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
            <th scope="col">Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(project, idx) in projects" :key="idx">
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
              <table>
                <tr>
                  <td>
                    <a @click="clickList(project, 'edit')" style="cursor: pointer;">
                      <i class="fas fa-edit"></i>
                    </a>
                  </td>
                  <td>
                    <a @click="clickList(project, 'see')" style="cursor: pointer;">
                      <i class="fas fa-eye" style="color: black;"></i>
                    </a>
                  </td>
                  <td>
                    <i
                      :id="'heart-'+project.id"
                      class="fas fa-heart"
                      @click="like(project)"
                      :style="'cursor: pointer;'+colorHeart(project.id)"
                    ></i>
                  </td>
                  <td>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="project.id"
                        :id="'chk_'+project.id"
                      />
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Crear colección</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label for="colectionName">Nombre de la colección:</label>
            <input class="form-control" id="colectionName" placeholder="Escribe el nombre aquí" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="guardaColeccion">Guardar</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
import store from "@/store";
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
        console.log("status", status);
        if (status === "all") this.status = null;
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
    guardaColeccion() {
      var checked = [];
      var nombre = $("#colectionName").val();
      if (nombre === "") alert("El nombre está vacío");
      else {
        $(".form-check-input:checked").each(function() {
          checked.push($(this).val());
        });
        db.collection("collections").add({
          name: nombre,
          products: checked,
          created: new Date().getTime(),
          user: store.state.user.email
        });
        $("#exampleModal").modal("hide");
      }
    },
    crearColeccion() {
      $("#exampleModal").modal("show");
    },
    colorHeart(projectid) {
      return store.state.user.likes.includes(projectid)
        ? "color: red;"
        : "color: black;";
    },
    like(project) {
      var projectid = project.id;
      var user = store.state.user;
      if (!user.likes) user["likes"] = [];
      if (user.likes.includes(projectid)) {
        user.likes = user.likes.filter(item => item !== projectid);
        $("#heart-" + projectid).css("color", "black");
      } else {
        user.likes.push(projectid);
        $("#heart-" + projectid).css("color", "red");
      }
      store.commit("setUser", user);
      db.collection("users")
        .doc(user.id)
        .update(user);
    },
    clickList(project, type) {
      this.$emit("click", { project: project, type: type });
    },
    getProjects() {
      var ref = db.collection("projects");
      if (this.status) {
        ref = ref.where("status", "==", this.status);
      }
      if (this.step) {
        ref = ref.where("step", "==", this.step);
      }
      ref = ref.orderBy("created", "asc");
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