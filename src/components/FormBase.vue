<template>
  <div>
    Form base
    <div v-for="(f, idx) in fields" v-bind:key="idx">
      {{f}}
      <div v-if="f.tipo==='texto'">
        <div class="form-group col-md-6">
          <label for="formGroupExampleInput">
            {{f.nombre}}
            <small v-if="f.obligatorio">*</small>
          </label>
          <input
            :id="f.id"
            :required="f.obligatorio"
            type="text"
            class="form-control"
            :placeholder="f.descripcion"
            :value="project[f.id]?project[f.id]:''"
          />
        </div>
      </div>
      <div v-if="f.tipo==='numero'">
        <div class="form-group col-md-6">
          <label for="formGroupExampleInput">
            {{f.nombre}}
            <small v-if="f.obligatorio">*</small>
          </label>
          <input
            :id="f.id"
            :required="f.obligatorio"
            type="number"
            class="form-control"
            :placeholder="f.descripcion"
            :value="project[f.id]?project[f.id]:''"
          />
        </div>
      </div>
      <div v-if="f.tipo==='boolean'">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value="true"
            :checked="project[f.id]!==undefined"
            :id="f.id"
          />
          <label class="form-check-label" :for="f.id">{{f.nombre}}</label>
        </div>
      </div>
    </div>
    <button class="btn btn-primary" @click="guardar">Guardar</button>
  </div>
</template>

<script>
import { db } from "@/main";

export default {
  name: "form-base",
  props: {},
  data() {
    return {
      fields: [],
      rol: "estructuras",
      projectid: "4FyMEQx6ZECw07cFxnTt",
      project: {}
    };
  },
  components: {},
  created() {
    const formid = this.$route.params.formid;
    db.collection("projects")
      .doc(this.projectid)
      .get()
      .then(doc => {
        this.project = doc.data();
      });
    db.collection("forms")
      .doc(formid)
      .get()
      .then(doc => {
        return doc.data().fields;
      })
      .then(fields => {
        fields.forEach(f => {
          this.addField(f);
        });
      });
  },
  methods: {
    guardar() {
      var values = {};
      this.fields.forEach(f => {
        if ($("#" + f.id).val()) values[f.id] = $("#" + f.id).val();
      });
      db.collection("projects")
        .doc(this.projectid)
        .update(values);
      console.log(values);
    },
    addField(f) {
      db.collection("fields")
        .doc(f)
        .get()
        .then(doc => {
          if (doc.data().departamento === this.rol) {
            this.fields.push(doc.data());
          }
          return true;
        });
    }
  }
};
</script>