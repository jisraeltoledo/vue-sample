<template>
  <div>
    <h1>Listado de proyectos</h1>
    <div class="col-md-8 offset-md-2">
      <table class="table thead-dark">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Modelo</th>
            <th scope="col">Descripción</th>
            <th scope="col">Biografía</th>
            <th scope="col">ExportPDF</th>
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
            <td>{{project.nombre}}</td>
            <td>{{project.modelo}}</td>
            <td v-if="project.descripcion">{{project.descripcion.substring (0, 10)}}</td>
            <td v-if="!project.descripcion"></td>
            <td v-if="project.bio">{{project.bio.substring(0, 10)}}</td>
            <td v-if="!project.bio"></td>
            <td>{{project.id}}<export-pdf v-bind:projectid="project.id"></export-pdf></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
import ExportPDFVue from '../ExportPDF.vue';
export default {
  name: "list-project",
  props: {},
  components: {
      "export-pdf": ExportPDFVue
  },
  data() {
    return {
      projects: []
    };
  },
  created() {
    console.log("proyectos", this.projects);
    db.collection("projects").onSnapshot(snap => {
      snap.forEach(element => {
          let p = element.data();
          p["id"] = element.id;
        this.projects.push(p);
      });
    });
    console.log(this.projects);
  },
  methods: {
    clickList(project) {
      this.$router.push('/'+this.$route.params.next_path+'/'+project.id);
    }
  }
};
</script>