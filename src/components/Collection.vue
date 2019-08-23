<template>
  <div class="container" v-if="collection">
    <h3 >{{collection.name}}</h3>
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
    <p>
    <button class="btn btn-primary" @click="agregarProducto"> <i class="fas fa-plus-circle"></i> Producto </button>
    </p>
    <modal-add-product :show="showModal" @hideModal="showModal=false" @guardar="guardarProductos"></modal-add-product>
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import { db } from "@/main";
import ModalAddProductVue from './ModalAddProduct.vue';

export default {
  name: "collection",
  components: {
    "modal-add-product": ModalAddProductVue
  },
  data() {
    return {
      collection: null,
      products: [],
      showModal: false
    };
  },
  created() {
    return db
      .collection("collections")
      .doc(this.$route.params.id)
      .get()
      .then(doc => {
        this.collection = doc.data();
        this.collection["id"] = doc.id;
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
            console.log (doc);
          if (doc.exists){
            var p = doc.data();
            p["id"] = doc.id;
            this.products.push(p);
          }          
        });
        return true;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    agregarProducto (){
      this.showModal = true;
    },
    guardarProductos (productos){
      console.log ("guardar productos", productos);
      console.log ("antes", this.collection.products);
      this.collection.products = Array.from (new Set (this.collection.products.concat (productos)));
      console.log ("despues", this.collection.products);
      this.loadProducts ();
      db.collection ("collections").doc (this.collection.id).update ({products: this.collection.products})
      this.showModal = false;
    },
    loadProducts (){
      this.products = [];
      this.collection.products.forEach (p=>{
        db.collection("projects").doc (p).get ().then (doc => {
          if (doc.exists){
            var data = doc.data ();
            data["id"] = doc.id;
            this.products.push (data);
          }
        });
      });      
    }
  }
};
</script>