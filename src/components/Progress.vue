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
            <th scope="col">Días en proceso</th>
            <th scope="col">Status</th>
            <th scope="col">PDF</th>
            <th scope="col">Opciones</th>
            <th scope="col">Progreso</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(project, idx) in projects" :key="idx">
            <td>{{project.C01}}</td>
            <td>{{project.C03}}</td>
            <td>{{project.C02}}</td>
            <td>{{project.version}}</td>
            <td>{{Math.round((new Date().getTime()-project.created)/(1000*60*60*24)) }}</td>

            <td>{{project.status}}</td>
            <td>
              <pdf-export :project="project"></pdf-export>
            </td>
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
                      class="fas fa-star"
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
            <td>
              <progress-bar :project="project"></progress-bar>
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
            <h5 class="modal-title" id="exampleModalLabel">{{titleModal}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label for="colectionName">{{labelModal}}</label>
            <input class="form-control" id="colectionName" placeholder="Escribe el nombre aquí" v-if="flagModalColeccion"/>
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
import { db } from "@/main";
import router from "@/router";
import store from "@/store";
import ExportPDFVue from "./ExportPDF.vue";
import ProgressBarVue from "./ProgressBar.vue";
import PDFExportVue from "./PDFExport.vue";

export default {
  name: "list-project-progress",
  props: {
    filterStatus: String,
    filterStep: String,
    products: Array
  },
  components: {
    "export-pdf": ExportPDFVue,
    "progress-bar": ProgressBarVue,
    "pdf-export": PDFExportVue
  },
  data() {
    return {
      projects: [],
      status: null,
      step: null,
      titleModal: "",
      labelModal: "",
      flagModalColeccion: false
    };
  },
  created() {
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
    if (this.$route.params.status === "favorites") {
      //this.getFavorites ();
      return;
    }
    this.getProjects();
  },
  watch: {
    products: function(newV, oldV) {
      this.projects = newV;
      if (this.projects === null) {
        this.getProjects();
      }
    },
    "$route.params.status": {
      handler: function(status) {
        if (status === "favorites") {
          this.getFavorites();
          return;
        }
        if (status === "all") this.status = null;
        else this.status = status;
        this.getProjects();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getFavorites() {
      var promises = [];
      store.state.user.likes.forEach(like => {
        var p = db
          .collection("projects")
          .doc(like)
          .get();
        promises.push(p);
      });
      this.projects = [];
      Promise.all(promises).then(docs => {
        docs.forEach(doc => {
          if (doc.exists) {
            var p = doc.data();
            p["id"] = doc.id;
            this.projects.push(p);
          }
        });
      });
    },
    changeStatus(status) {
      var _this = this;
      var data = { status: status };
      data[status] = new Date().getTime();
      $(".form-check-input:checked").each(function() {
        db.collection("projects")
          .doc($(this).val())
          .update(data);
        for (var i = 0; i < _this.projects.length; i++) {
          if (_this.projects[i].id === $(this).val()) {
            _this.projects[i].status = status;
          }
        }
        $(this).prop("checked", false);
      });
    },
    guardar() {
      if (this.flagModalColeccion) {
        this.guardaColeccion();
      } else {
        this.guardaFamilia();
      }
    },
    guardaFamilia() {
      var data = this.getModalData();
      var project = this.projects.filter(e => {
        return e.id === data.checks[0];
      })[0];
      let newRef = db.collection('projects').doc();
      project["C01"] = newRef.id;
      project["products"] = data.checks;
      project["created"] = new Date().getTime();
      project["user"] = store.state.user.email;
      project["isFamily"] = true;
      project.keywords = project.keywords.concat(this.createKey(data.nombre));
      delete project["id"];
      newRef.set(project)
        .then(() => {
          data.checks.forEach(id => {
            db.collection("projects")
              .doc(id)
              .update({ family: newRef.id });
          });
          return true;
        })
        .then(() => {
          $("#exampleModal").modal("hide");
          console.log ("familia:", newRef.id);
          this.$router.replace(`/home`);
        });
    },
    createKey(name) {
      if (name === undefined || name === null || name === "") return "";
      const arrName = [];
      let curName = "";
      name
        .toLowerCase()
        .split("")
        .forEach(letter => {
          curName += letter;
          arrName.push(curName);
        });
      return arrName;
    },
    getModalData() {
      var checked = [];
      var nombre = $("#colectionName").val();
      if (nombre === "" && this.flagModalColeccion) alert(this.labelModal + " está vacío");
      else {
        $(".form-check-input:checked").each(function() {
          checked.push($(this).val());
          $(this).prop("checked", false);
        });
        return {
          nombre: nombre,
          checks: checked
        };
      }
    },
    guardaColeccion() {
      var data = this.getModalData();
      db.collection("collections")
        .add({
          name: data.nombre,
          products: data.checks,
          created: new Date().getTime(),
          user: store.state.user.email
        })
        .then(ref => {
          this.$router.replace(`/collection/${ref.id}`);
        });
      $("#exampleModal").modal("hide");
    },
    crearColeccion() {
      this.titleModal = "Crear colección";
      this.labelModal = "Nombre";
      this.flagModalColeccion = true;
      $("#exampleModal").modal("show");
    },
    crearFamilia() {
      this.titleModal = "Crear familia";
      this.labelModal = "¿Estás seguro de crear la familia?";
      this.flagModalColeccion = false;
      $("#exampleModal").modal("show");
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
        $("#heart-" + projectid).css("color", "#FFD700");
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
      console.log ("getProjects");
      var ref = db.collection("projects");
      //ref = ref.where("isFamily", "==", undefined);
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
          if (p.isFamily){}else{
            this.projects.push(p);
          }          
        });
      });
    }
  }
};
</script>