<template>
  <div>
    <h1>Proyectos</h1>
    <div class="col-md-6 offset-md-3">
      <table>
          <tr v-for="(project, idx) in projects" :key="idx">
              <td>{{project.nombre}}</td>
              <td>{{project.modelo}}</td>
              <td>{{project.descripcion}}</td>
              <td>{{project.bio}}</td>
          </tr>
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
  create (){
      db.collection ("projects").onSnapshot (snap=>{
          snap.forEach(element => {
            this.projects.push (element.data ()); 
          });          
      });
      console.log (projects);
  },
  methods: {
    
  }
};
</script>