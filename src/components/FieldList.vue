<template>
  <div class="container">
    <table class="table thead-dark table-striped table-hover">
      <thead class="thead-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">Tipo</th>
          <th scope="col">Departamento</th>
          <th scope="col">Descripción</th>
          <th scope="col">Obligatorio</th>       
          <th scope="col">Editable si tiene familia</th>    
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(field, idx) in fields"
          :key="idx"
          class="clickable-row"
          v-on:click="click(field)"
          style="cursor: pointer; "
        >
          <td>{{field.id}}</td>
          <td>{{field.nombre}}</td>
          <td>{{field.tipo}}</td>
          <td>{{field.departamento}}</td>
          <td>{{field.descripcion}}</td>
          <td>{{field.obligatorio}}</td>
          <td>{{field.editableIfFamily}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "@/main";

export default {
  name: "home",
  data() {
    return {
      fields: []
    };
  },
  components: {},
  created() {
    db.collection("fields")
      .get()
      .then(snap => {
        snap.forEach(element => {
          var data = element.data();
          data["id"] = element.id;
          this.fields.push(data);
        });
        console.log (this.fields);
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    click(field) {
      this.$router.push("/fields/" + field.id);
    }
  }
};
</script>