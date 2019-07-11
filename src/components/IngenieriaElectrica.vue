<template>
  <div>
    <h1>Ingeniería Eléctrica</h1>
    <div class="col-md-8 offset-md-2">
      <div>
        <div class="form-group">
          <label for="input">Input</label>
          <input
            v-model="input"
            type="text"
            class="form-control"
            id="input"
            aria-describedby="inputHelp"
            placeholder="Input in wats"
          />
          <small id="inputHelp" class="form-text text-muted">ej. 6.4 W</small>
        </div>

        <div class="form-group">
          <label for="voltage">Voltage</label>
          <input
            v-model="voltage"
            type="text"
            class="form-control"
            id="voltage"
            aria-describedby="voltage-help"
            placeholder="Voltage"
          />
          <small id="voltage-help" class="form-text text-muted">ej. 120 V</small>
        </div>

        <div class="form-group">
          <label for="dimming">Dimming</label>
          <input
            v-model="dimming"
            type="text"
            class="form-control"
            id="dimming"
            aria-describedby="dimming-help"
            placeholder="dimming"
          />
          <small id="dimming-help" class="form-text text-muted">ej. Phase</small>
        </div>

        <div class="form-group">
          <label for="lumen-output">Lumen Output</label>
          <input
            v-model="lumenOutput"
            type="text"
            class="form-control"
            id="lumen-output"
            aria-describedby="lumen-output-help"
            placeholder="lumen output"
          />
          <small id="lumen-output-help" class="form-text text-muted">ej. 500 lm</small>
        </div>

        <div class="form-group">
          <label for="color-temperature">Color Temperature</label>
          <input
            v-model="colorTemperature"
            type="text"
            class="form-control"
            id="color-temperature"
            aria-describedby="color-temperature-help"
            placeholder="color temperature"
          />
          <small id="color-temperature-help" class="form-text text-muted">ej. 2700 K</small>
        </div>

        <div class="form-group">
          <label for="cri">CRI</label>
          <input
            v-model="cri"
            type="text"
            class="form-control"
            id="cri"
            aria-describedby="cri-help"
            placeholder="cri"
          />
          <small id="cri-help" class="form-text text-muted">ej. 93</small>
        </div>

        <div class="form-group">
          <label for="life-span">Life Span</label>
          <input
            v-model="lifeSpan"
            type="text"
            class="form-control"
            id="life-span"
            aria-describedby="life-span-help"
            placeholder="life span"
          />
          <small id="life-span-help" class="form-text text-muted">ej. +70.000 hrs</small>
        </div>

        <button @click="guardar" class="btn btn-primary">Guardar</button>
      </div>
    </div>
    <br />
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
import firebase from "firebase";
import UploadFileVue from "./UploadFile.vue";
export default {
  name: "diseno-grafico",
  props: {},
  components: {
    "upload-file": UploadFileVue
  },
  data() {
    return {
      input: "",
      voltage: "",
      dimming: "",
      lumenOutput: "",
      colorTemperature: "",
      cri: "",
      lifeSpan: ""
    };
  },
  created() {
    console.log(this.$route.params.projectid);
  },
  computed: {
    projectid() {
      return this.$route.params.projectid;
    }
  },
  methods: {
    guardar() {
      db.collection("projects")
        .doc(this.projectid)
        .update({
          input: this.input,
          voltage: this.voltage,
          dimming: this.dimming,
          lumenOutput: this.lumenOutput,
          colorTemperature: this.colorTemperature,
          cri: this.cri,
          lifeSpan: this.lifeSpan
        })
        .then(() => {
          alert("Proyecto Actualizado");
          this.$router.push("/home");
        });
    }
  }
};
</script>