<template>
  <div>
    <h1>Proyectos 2</h1>
    <div class="col-md-8 offset-md-2">
      <table class="table thead-dark">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Modelo</th>
            <th scope="col">Descripción</th>
            <th scope="col">Biografía</th>
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
            <td>{{project.descripcion}}</td>
            <td>{{project.bio}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
export default {
  name: "list-project",
  props: {},
  data() {
    return {
      projects: []
    };
  },
  created() {
    console.log("proyectos", this.projects);
    db.collection("projects").onSnapshot(snap => {
      snap.forEach(element => {
        this.projects.push(element.data());
      });
    });
    console.log(this.projects);
  },
  methods: {
    clickList(project) {
      alert(project);
    }
  }
};
</script>