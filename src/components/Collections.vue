<template>
  <div class="container">
    <table class="table thead-dark table-striped table-hover">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">No. de productos</th>
          <th scope="col">Fecha</th>
          <th scope="col">Usuario</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(collection, idx) in collections"
          :key="idx"
          class="clickable-row"
          v-on:click="click(collection)"
          style="cursor: pointer; "
        >
          <td>{{collection.name}}</td>
          <td>{{collection.products.length}}</td>
          <td>{{new Date(collection.created)}}</td>
          <td>{{collection.user}}</td>
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
      collections: []
    };
  },
  components: {},
  created() {
    db.collection("collections")
      .get()
      .then(snap => {
        snap.forEach(element => {
          var data = element.data();
          data["id"] = element.id;
          this.collections.push(data);
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    click(collection) {
      this.$router.push("/collection/" + collection.id);
    }
  }
};
</script>