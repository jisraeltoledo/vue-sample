<template>
  <div>
    <h1>{{project.nombre}}</h1>
    <div class="row">
      <div v-for="(f, idx) in fields" v-bind:key="'f'+idx" class="form-group col-md-6">
        <!--  ************ TEXTO ************ -->
        <div v-if="f.tipo==='texto'">
          <div>
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
        <!--  ************ NUMERO ************ -->
        <div v-else-if="f.tipo==='numero'">
          <div>
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
        <!--  ************ Boolean ************ -->
        <div v-else-if="f.tipo==='boolean'">
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
        <!--  ************ Check ************ -->
        <div v-else-if="f.tipo==='check'">
          {{f.nombre}}
          <div class="form-check" v-for="(o, idy) in f.options" v-bind:key="'o'+idy">
            <input
              class="form-check-input"
              type="checkbox"
              value="true"
              :checked="project[f.id]!== undefined && project[f.id].includes(o.id)"
              :id="f.id+'_'+o.id"
            />
            <label class="form-check-label" :for="f.id+'_'+o.id">{{o.value}}</label>
          </div>
        </div>
        <!--  ************ Radio ************ -->
        <div v-else-if="f.tipo==='radio'">
          {{f.nombre}}
          <div class="radio" v-for="(o, idy) in f.options" v-bind:key="'o'+idy">
            <input
              :name="f.id"
              type="radio"
              value="true"
              :checked="project[f.id]!== undefined && project[f.id].includes(o.id)"
              :id="f.id+'_'+o.id"
            />
            <label :for="f.id+'_'+o.id">{{o.value}}</label>
          </div>
        </div>
        <!--  ************ File ************ -->
        <div v-else-if="f.tipo==='file'">
          <upload-file
            v-bind:id="f.id"
            v-bind:path="projectid"
            v-bind:label="f.nombre"
            v-bind:fileType="f.fileType"
            v-bind:width="100"
            @uploaded:url="files[f.id] = $event"
          ></upload-file>
        </div>
        <!--  ************ Files ************ -->
        <div v-else-if="f.tipo==='files'">
          <upload-file
            v-bind:id="f.id"
            v-bind:path="projectid"
            v-bind:label="f.nombre"
            v-bind:fileType="f.fileType"
            v-bind:width="100"
            v-bind:multiple="true"
            @uploaded:url="files[f.id] = $event"
          ></upload-file>
        </div>
        <div v-else>{{f}}</div>
      </div>
      <button class="btn btn-primary form-control col-md-2 offset-2" @click="guardar">Guardar</button>
    </div>
  </div>
</template>

<script>
import { db } from "@/main";
import UploadFileVue from "./UploadFile.vue";

export default {
  name: "form-base",
  props: {},
  data() {
    return {
      fields: [],
      rol: "diseño grafico",
      projectid: "4FyMEQx6ZECw07cFxnTt",
      project: {},
      files: []
    };
  },
  components: {
    "upload-file": UploadFileVue
  },
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
        if (f.tipo === "boolean") {
          if ($("#" + f.id).is(":checked")) values[f.id] = true;
        } else if (f.tipo === "texto" || f.tipo === "numero") {
          if ($("#" + f.id).val()) values[f.id] = $("#" + f.id).val();
        } else if (f.tipo === "check") {
          values[f.id] = [];
          f.options.forEach(o => {
            if ($("#" + f.id + "_" + o.id).is(":checked"))
              values[f.id].push(o.id);
          });
        } else if (f.tipo === "radio") {
          f.options.forEach(o => {
            if ($("#" + f.id + "_" + o.id).is(":checked")) values[f.id] = o.id;
          });
        } else if (f.tipo === "file") {
          if (this.files[f.id]) {
            values[f.id] = this.files[f.id];
          }
        }
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