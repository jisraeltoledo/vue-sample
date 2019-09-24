<template>
  <div>
    <hr />
    <div class="row">
      <div class="col-md-6">
        <h3>Clave: {{project.C01}}</h3>
        <h4>Nombre: {{project.C03}}</h4>
      </div>
      <div class="col-md-6" v-if="project.family">
        <button @click="editFamily" class="btn btn-primary">Editar familia</button>
      </div>
    </div>
    <div v-if="message">{{message}}</div>
    <div class="row">
      <div v-for="(f, idx) in fields" v-bind:key="'f'+idx" class="form-group col-md-6">
        <strong>{{f.id}}</strong>
        <!--  ************ TEXTO ************ -->
        <div v-if="f.tipo==='texto'">
          <div>
            <label for="formGroupExampleInput">
              <strong>{{f.nombre}}</strong>
              <small v-if="f.obligatorio">*</small>
            </label>
            <input
              :id="f.id"
              :required="f.obligatorio"
              type="text"
              class="form-control"
              :placeholder="f.descripcion"
              :value="project[f.id]?project[f.id]:''"
              :disabled="project.family && !f.editableIfFamily"
            />
          </div>
        </div>
        <!--  ************ TEXTAREA ************ -->
        <div v-else-if="f.tipo==='textarea'">
          <div>
            <label for="formGroupExampleInput">
              <strong>{{f.nombre}}</strong>
              <small v-if="f.obligatorio">*</small>
            </label>
            <ckeditor :editor="editor" v-model="editorData[f.id]" :config="editorConfig"></ckeditor>
          </div>
        </div>
        <!--  ************ NUMERO ************ -->
        <div v-else-if="f.tipo==='numero'">
          <div>
            <label for="formGroupExampleInput">
              <strong>{{f.nombre}}</strong>
              <small v-if="f.obligatorio">*</small>
            </label>
            <input
              :id="f.id"
              :required="f.obligatorio"
              type="number"
              class="form-control"
              :placeholder="f.descripcion"
              :value="project[f.id]?project[f.id]:''"
              :disabled="project.family && !f.editableIfFamily"
            />
          </div>
        </div>
        <!--  ************ barcode ************ -->
        <div v-else-if="f.tipo==='barcode'">
          <div>
            <label for="formGroupExampleInput">
              <strong>{{f.nombre}}</strong>
              <small v-if="f.obligatorio">*</small>
            </label>
            <input
              :id="f.id"
              :required="f.obligatorio"
              type="text"
              class="form-control"
              :placeholder="f.descripcion"
              :value="project[f.id]?project[f.id]:''"
              :disabled="project.family && !f.editableIfFamily"
            />
            <barcode :value="project[f.id]?project[f.id]:''" :options="{ displayValue: true }"></barcode>
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
              :disabled="project.family && !f.editableIfFamily"
            />
            <label class="form-check-label" :for="f.id">
              <strong>{{f.nombre}}</strong>
            </label>
          </div>
        </div>
        <!--  ************ Check ************ -->
        <div v-else-if="f.tipo==='check'">
          <strong>{{f.nombre}}</strong>
          <div class="form-check" v-for="(o, idy) in f.options" v-bind:key="'o'+idy">
            <input
              class="form-check-input"
              type="checkbox"
              value="true"
              :checked="project[f.id]!== undefined && project[f.id].includes(o)"
              :id="f.id+'_'+o"
              :disabled="project.family && !f.editableIfFamily"
            />
            <label class="form-check-label" :for="f.id+'_'+o">{{o}}</label>
          </div>
        </div>
        <!--  ************ Radio ************ -->
        <div v-else-if="f.tipo==='radio'">
          <strong>{{f.nombre}}</strong>
          <div class="form-check" v-for="(o, idy) in f.options" v-bind:key="'o'+idy">
            <input
              class="form-check-input"
              :name="f.id"
              type="radio"
              value="true"
              :checked="project[f.id]!== undefined && project[f.id].includes(o)"
              :id="removeSpecialChars(f.id+'_'+o)"
              :disabled="project.family && !f.editableIfFamily"
            />
            <label class="form-check-label" :for="f.id+'_'+o">{{o}}</label>
          </div>
        </div>
        <!--  ************ File ************ -->
        <div v-else-if="f.tipo==='file'">
          <upload-file
            v-bind:id="f.id"
            v-bind:project="project"
            v-bind:path="projectid"
            v-bind:label="f.nombre"
            v-bind:fileType="f.fileType"
            v-bind:description="f.descripcion"
            v-bind:width="100"
            @uploaded="uploaded"
            :disabled="project.family && !f.editableIfFamily"
          ></upload-file>
        </div>
        <!--  ************ Files ************ -->
        <div v-else-if="f.tipo==='files'">
          <upload-file
            v-bind:id="f.id"
            v-bind:project="project"
            v-bind:path="projectid"
            v-bind:label="f.nombre"
            v-bind:fileType="f.fileType"
            v-bind:width="100"
            v-bind:multiple="true"
            v-bind:description="f.descripcion"
            @uploaded="uploaded"
            :disabled="project.family && !f.editableIfFamily"
          ></upload-file>
        </div>
        <!--  ************ Json ************ -->
        <div v-else-if="f.tipo==='json'">
          <strong>{{f.nombre}}</strong>
          <div v-if="project.family && !f.editableIfFamily">
            <pre>
              {{JSON.stringify (jsonData, null, 2).replace ("{", "").replace ("}", "")}}
            </pre>
          </div>
          <JsonEditor v-if="!(project.family && !f.editableIfFamily)"
            :options="{
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            }"
            :objData="jsonData"
            v-model="jsonData"
          ></JsonEditor>
        </div>
        <div v-else>{{f}}</div>
      </div>
    </div>
    <div v-if="fields.length > 0" class="row">
      <button class="btn btn-primary form-control col-md-2 offset-5" @click="guardar">Guardar</button>
    </div>
  </div>
</template>

<script>
import { db } from "@/main";
import UploadFileVue from "./UploadFile.vue";
import store from "@/store";
import VueBarcode from "@xkeshi/vue-barcode";
import { roles } from "@/router";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
  name: "form-base",
  props: {
    projectidSource: String
  },
  data() {
    return {
      jsonData: {
        "2.1 Cuerpo":"...",
        "2.2 Pantalla":"...",
      },
      fields: [],
      rol: null,
      projectid: "",
      project: {},
      files: {},
      message: "No hay datos para ti",
      editor: ClassicEditor,
      editorData: {},
      editorConfig: {
        // The configuration of the rich-text editor.
      }
    };
  },
  components: {
    "upload-file": UploadFileVue,
    barcode: VueBarcode
  },
  watch: {
    fields() {
      if (this.fields.length === 0) {
        this.message = "No hay datos para ti";
      } else {
        this.message = "";
      }
    }
  },
  created() {
    this.rol = store.state.userRole;
    if (this.$route.params.projectid)
      this.projectid = this.$route.params.projectid;
    else if (this.projectidSource) this.projectid = this.projectidSource;
    db.collection("projects")
      .doc(this.projectid)
      .get()
      .then(doc => {
        this.project = doc.data();
        this.project["id"] = doc.id;
        if (this.project["C84"]){
          this.jsonData = this.project["C84"];
        }        
      })
      .then(() => {
        return db
          .collection("forms")
          .doc(this.project.form)
          .get();
      })
      .then(doc => {
        return doc.data().fields;
      })
      .then(fields => {
        fields.forEach(f => {
          this.addField(f);
        });
      })
      .then(() => {
        this.$emit("created", this.projectid);
      });
  },
  methods: {
    uploaded(urls, id) {
      this.files[id] = urls;
    },
    editFamily() {
      this.$emit("editFamily", this.project);
    },
    removeSpecialChars(cadena) {
      return cadena.replace(/[^A-Z0-9]/gi, "_");
    },
    guardar() {
      var values = {};
      this.fields.forEach(f => {
        if (f.tipo === "boolean") {
          if ($("#" + f.id).is(":checked")) values[f.id] = true;
        } else if (f.tipo === "textarea") {
          values[f.id] = this.editorData[f.id];
        } else if (f.tipo === "texto" || f.tipo === "numero") {
          if ($("#" + f.id).val()) values[f.id] = $("#" + f.id).val();
        } else if (f.tipo === "check") {
          values[f.id] = [];
          f.options.forEach(o => {
            if ($("#" + f.id + "_" + o).is(":checked")) values[f.id].push(o);
          });
        } else if (f.tipo === "radio") {
          f.options.forEach(o => {
            if ($("#" + this.removeSpecialChars(f.id + "_" + o)).is(":checked"))
              values[f.id] = o;
          });
        } else if (f.tipo === "file" || f.tipo === "files") {
          console.log("files", this.files);
          if (this.files[f.id]) {
            values[f.id] = this.files[f.id];
          }
        } else if (f.tipo === "json"){
          values[f.id] = this.jsonData;
        }
      });
      db.collection("projects")
        .doc(this.projectid)
        .update(values);
      if (this.project.isFamily) {
        if (values.C01) delete values.C01;
        if (values.C02) delete values.C02;
        if (values.C03) delete values.C03;
        if (values.C04) delete values.C04;
        this.project.products.forEach(p => {
          db.collection("projects")
            .doc(p)
            .update(values);
        });
      }
      alert("Los cambios se han guardado");
    },
    addField(f) {
      db.collection("fields")
        .doc(f)
        .get()
        .then(doc => {
          if (!doc.exists) return;
          if (
            doc.data().departamento === this.rol ||
            this.rol == roles.super_admin
          ) {
            this.editorData[doc.id] = this.project[doc.id];
            this.fields.push(doc.data());
          }
          return true;
        });
    }
  }
};
</script>