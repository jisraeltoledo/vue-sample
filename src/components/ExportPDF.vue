<template>
  <div>
    <button @click="descargar">Descargar</button>
    <img id="img" />
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
import jsPDF from "jspdf";
import firebase from "firebase";
export default {
  name: "list-project",
  props: {
    projectid: String
  },
  data() {
    return {
      project: null,
      images: null,
      bio: null,
      dim: null,
      est: null,
      prod: null,
      cert: null
    };
  },
  created() {
    console.log("projectid", this.projectid);
    db.collection("projects")
      .doc(this.projectid)
      .get()
      .then(doc => {
        this.project = doc.data();
      });
    db.collection("images")
      .doc("KzvYfrrXDFrYIuDPDqQi")
      .get()
      .then(doc => {
        if (doc.exists) this.images = doc.data();
      });
    db.collection("images")
      .doc(this.projectid + "-bio")
      .get()
      .then(doc => {
        if (doc.exists) this.bio = doc.data().img;
      });
    db.collection("images")
      .doc(this.projectid + "-dim")
      .get()
      .then(doc => {
        if (doc.exists) this.dim = doc.data().img;
      });
    db.collection("images")
      .doc(this.projectid + "-est")
      .get()
      .then(doc => {
        if (doc.exists) this.est = doc.data().img;
      });
    db.collection("images")
      .doc(this.projectid + "-prod")
      .get()
      .then(doc => {
        if (doc.exists) this.prod = doc.data().img;
      });
    db.collection("images")
      .doc("cert")
      .get()
      .then(doc => {
        if (doc.exists) this.cert = doc.data().img;
      });
  },
  methods: {
    descargar() {
      if (!this.project) {
        alert("No hay datos");
        return;
      }
      var doc = new jsPDF();

      doc.setFontSize(18);
      doc.setFontType("bold");
      if (this.project.modelo) doc.text(this.project.modelo, 10, 20);
      doc.text(".DECIMAL", 170, 20);

      doc.setFontSize(10);
      doc.setTextColor("#C0C0C0");
      doc.text(10, 25, "by Jorge Diego");

      doc.setFontSize(10);
      doc.setTextColor("#DCDCDC");
      doc.text(10, 60, "DESCRIPTION");

      doc.setFontType("normal");
      doc.setFontSize(10);
      doc.setTextColor("#000000");
      if (this.project.descripcion)
        doc.text(10, 70, this.project.descripcion.replace(/(.{100})/g, "$1\n"));

      doc.setFontSize(10);
      doc.setTextColor("#DCDCDC");
      doc.text(10, 130, "DESIGNER");

      doc.setFontSize(10);
      doc.setTextColor("#000000");
      if (this.project.bio)
        doc.text(10, 140, this.project.bio.replace(/(.{50})/g, "$1\n"));

      if (this.bio) doc.addImage(this.bio, "JPEG", 110, 130, 90, 100);

      doc.addPage();

      doc.setFontSize(18);
      doc.setFontType("bold");
      if (this.project.modelo) doc.text(this.project.modelo, 10, 20);
      doc.text(".DECIMAL", 170, 20);

      doc.setFontSize(10);
      doc.setTextColor("#C0C0C0");
      doc.text(10, 25, "by Jorge Diego");

      if (this.prod) doc.addImage(this.prod, "JPEG", 5, 30, 200, 100);

      doc.setFontSize(10);
      doc.setFontType("bold");
      doc.setTextColor("#DCDCDC");
      doc.text(10, 140, "SPECIFICATIONS");

      doc.setFontType("normal");
      doc.setFontSize(10);
      doc.setTextColor("#000000");
      if (this.project.type) doc.text(10, 150, "Type: " + this.project.type);

      doc.text(10, 160, "Materials: ");

      if (this.project.materials) doc.text(15, 165, this.project.materials);

      if (this.project.cordLength)
        doc.text(10, 180, "Cord length: " + this.project.cordLength);
      doc.text(15, 185, "*custom length available upon request");

      doc.setFontType("bold");
      doc.setTextColor("#DCDCDC");
      doc.text(10, 200, "LED MODULE");

      doc.setFontType("normal");
      doc.setTextColor("#000000");
      if (this.project.input) doc.text(10, 205, "Input: " + this.project.input);
      if (this.project.voltage)
        doc.text(10, 210, "Voltage: " + this.project.voltage);
      if (this.project.dimming)
        doc.text(10, 215, "Dimming: " + this.project.dimming);
      if (this.project.lumenOutput)
        doc.text(10, 220, "Lumen output: " + this.project.lumenOutput);
      if (this.project.colorTemperature)
        doc.text(
          10,
          225,
          "Color temperature: " + this.project.colorTemperature
        );
      if (this.project.cri) doc.text(10, 230, "CRI: " + this.project.cri);
      if (this.project.lifeSpan)
        doc.text(10, 235, "Lifespan: " + this.project.lifeSpan);

      doc.setFontType("bold");
      doc.setTextColor("#DCDCDC");
      doc.text(10, 255, "WARRANTY");

      doc.setFontType("normal");
      doc.setTextColor("#000000");
      doc.text(10, 260, "5 years limited warranty");

      doc.setFontType("bold");
      doc.setTextColor("#DCDCDC");
      doc.text(130, 140, "CERTIFICATIONS");

      if (this.cert) doc.addImage(this.cert, "JPEG", 130, 150, 20, 20);

      doc.setFontType("bold");
      doc.setTextColor("#DCDCDC");
      doc.text(130, 200, "DIMENSIONS");

      if (this.dim) doc.addImage(this.dim, "JPEG", 130, 205, 70, 70);

      doc.addPage();

      doc.setTextColor("#000000");
      doc.setFontSize(18);
      doc.setFontType("bold");
      if (this.project.modelo) doc.text(this.project.modelo, 10, 20);
      doc.text(".DECIMAL", 170, 20);

      doc.setFontSize(10);
      doc.setTextColor("#C0C0C0");
      doc.text(10, 25, "by Jorge Diego");

      doc.setFontType("bold");
      doc.setTextColor("#DCDCDC");
      doc.text(10, 60, "MODULE COLORS");

      if (this.images.gold)
        doc.addImage(this.images.gold, "JPEG", 10, 70, 20, 20);
      if (this.images.black)
        doc.addImage(this.images.black, "JPEG", 35, 70, 20, 20);
      if (this.images.silver)
        doc.addImage(this.images.silver, "JPEG", 60, 70, 20, 20);

      if (this.est) doc.addImage(this.est, "JPEG", 130, 60, 70, 70);

      if (this.project.nombre) doc.save(this.project.nombre + ".pdf");
      else doc.save("unnamed.pdf");
    }
  }
};
</script>