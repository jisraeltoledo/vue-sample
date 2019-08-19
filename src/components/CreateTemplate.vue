<template>
  <div class="container">
    <div class="row">
      <button class="btn btn-primary"> + </button>
    </div>
    <div class="row" style="margin-top: 20px;">
    <div class="col-md-6">
      <canvas
        @click="click"
        @mousedown="mouseDown"
        @mouseup="mouseUp"
        @mousemove="mouseMove"
        id="myCanvas"
        :width="zoomw"
        :height="zoomh"
        style="border:1px solid #000000;"
      ></canvas>
    </div>
    <div class="col-md-6">
      <div v-for="(field, idx) in fields" v-bind:key="idx">
        {{field.x}}
      </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateTemplate",
  props: {
    msg: String
  },
  mounted() {
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      isDown: false,
      origin: {
        x: 0,
        y: 0
      },
      w: 216,
      h: 279,
      zoom: 2,
      fields: [
        {
          x: 200,
          y: 10,
          w: 100,
          h: 50,
          field: "field-id",
          type: "text",
          length: "300",
          font: "Helvetica",
          fontSize: "10",
          fontColor: "#000000",
          fontType: "bold"
        },
        { x: 300, y: 50, w: 40, h: 50, type: "img", src: "nombre-imagen" }
      ]
    };
  },
  computed: {
    zoomw() {
      return this.w * this.zoom;
    },
    zoomh() {
      return this.h * this.zoom;
    }
  },
  methods: {
    mouseMove(event) {
      console.log("mouseUp");
      if (this.isDown) {
        this.ctx.fillRect(this.origin.x, this.origin.y, event.offsetX, event.offsetY);
      }
    },
    mouseUp() {
      this.isDown = false;
      console.log("mouseUp");
    },
    mouseDown(event) {
      this.isDown = true;
      this.origin.x = event.offsetX;
      this.origin.y = event.offsetY;
      console.log("mouseDown");
    },
    mm(points) {
      return points * 0.352;
    },
    ps(points) {
      return this.mm(points) * this.zoom;
    },
    rectangle(x, y, w, h) {
      this.ctx.fillStyle = "#000000";

      this.fields.forEach(f => {
        this.ctx.fillRect(this.ps(f.x), this.ps(f.y), this.ps(f.w), this.ps(f.h));
      });
    },
    click(event) {
      console.log(event.offsetX, event.offsetY);
    }
  }
};
</script>