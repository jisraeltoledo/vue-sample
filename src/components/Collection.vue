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
        this.loadProducts ();
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
      this.collection.products = Array.from (new Set (this.collection.products.concat (productos)));
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