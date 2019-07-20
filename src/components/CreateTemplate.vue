<template>
  <div class="row">
    <div class="col-md-6">
      <canvas
        @click="click"
        id="myCanvas"
        :width="zoomw"
        :height="zoomh"
        style="border:1px solid #000000;"
      ></canvas>
    </div>
    <div class="col-md-6">
      <div v-for="(field, idx) in fields" v-bind:key="idx"></div>
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
    this.rectangle(36, 46, 522, 100);
  },
  data() {
    return {
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
        { x: 300, y: 50, w: 40, h: 50, type: "img", src: "nombre-imagen"}
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
    mm(points) {
      return points * 0.352;
    },
    ps(points) {
      return this.mm(points) * this.zoom;
    },
    rectangle(x, y, w, h) {
      var canvas = document.getElementById("myCanvas");
      console.log(canvas);
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#000000";

      this.fields.forEach(f => {
        ctx.fillRect(this.ps(f.x), this.ps(f.y), this.ps(f.w), this.ps(f.h));
      });
    },
    click(event) {
      console.log(event.offsetX, event.offsetY);
    }
  }
};
</script>