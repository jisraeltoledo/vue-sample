
<template>
  <div>
    <div
      class="modal fade"
      id="modalAddProduct"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalAddProductLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalAddProductLabel">Agrega productos</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="col-md-12 form-group">
              <div class="input-group">
                <input
                  id="searchField"
                  type="text"
                  class="form-control"
                  placeholder="Search for..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  v-model="searchInput"
                />
                <div class="input-group-append">
                  <button class="btn btn-primary" type="button">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <br />
            <div class="col-md-12 form-group">
              <select multiple size="6" class="form-control" id="select-products">
                <option
                  :value="p.id"
                  v-for="(p, i) in searchProjects"
                  :key="i"
                >{{p.C01 + ' '+ p.C03}}</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="guardar">Guardar</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              @click="$emit('hideModal')"
            >Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
import firebase from "firebase";
import { db } from "@/main";

export default {
  name: "modal-add-product",
  props: {
    show: Boolean
  },
  data() {
    return {
      searchProjects: [],
      searchInput: ""
    };
  },
  watch: {
    show(isShown) {
      if (isShown) {
        $("#modalAddProduct").modal("show");
      } else {
        $("#modalAddProduct").modal("hide");
      }
    },
    searchInput(newValue) {
      this.searching();
    }
  },
  components: {},
  created() {},
  mounted() {
    this.searching();
  },
  methods: {
    guardar() {
      var arr = [];
      $("#select-products")
        .val()
        .forEach(element => {
          arr.push(element);
        });
      this.$emit("guardar", arr);
    },
    searching() {
      var ref = db.collection("projects");
      if (this.searchInput != "") {
        ref = ref.where(
          "keywords",
          "array-contains",
          this.searchInput.toLowerCase()
        );
      }
      ref.get().then(docs => {
        this.searchProjects = [];
        docs.forEach(doc => {
          var p = doc.data();
          p["id"] = doc.id;
          this.searchProjects.push(p);
        });
      });
    }
  }
};
</script>