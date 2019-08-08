<template>
  <div class="container">
    <h3>{{collection.name}}</h3>
    <div class="form-check" v-for="(p, idy) in products" v-bind:key="'collection-product-'+idy">
       <input
        class="form-check-input"
        type="checkbox"
        value="true"
        :id="'collection-product-'+p.id"
      />
      <label class="form-check-label" :for="'collection-product-'+p.id">{{p.C03}}</label>
    </div>
    <p />
    <strong>Creado:</strong> {{new Date (collection.created).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}}
    <p />
    <strong>Usuario:</strong> {{collection.user}}
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import { db } from "@/main";

export default {
  name: "collection",
  components: {},
  data() {
    return {
      collection: null,
      products: []
    };
  },
  created() {
    return db
      .collection("collections")
      .doc(this.$route.params.id)
      .get()
      .then(doc => {
        this.collection = doc.data();
        return true;
      })
      .then(() => {
        var ref = db.collection("projects");
        var promises = [];
        this.collection.products.forEach(p => {
          promises.push(ref.doc(p).get());
        });
        return Promise.all(promises);
      })
      .then(docs => {
        docs.forEach(doc => {
            console.log (doc)
          var p = doc.data();
          p["id"] = doc.id;
          this.products.push(p);
        });
        return true;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {}
};
</script>