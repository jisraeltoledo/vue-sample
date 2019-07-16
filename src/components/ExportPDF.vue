<template>
  <div>
    <button @click="descargar" class="btn btn-primary pull-right">Descargar</button>
    <img id="img_bio" :src="bio" style="display: none;" />
    <img id="img_prod" :src="prod" style="display: none;" />
  </div>
</template>


<script>
import { db } from "@/main";
import router from "@/router";
import jsPDF from "jspdf";
import firebase from "firebase";
import { inspect } from "util";
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
      cert: null,
      config: {
        header: {
          fontSize: 24,
          logoHeight: 16,
          modelSize: 18,
          font: "Avant Garde Gothic"
        },
        margins: {
          left: 36,
          right: 36,
          top: 46
        },
        descripcion: {
          y: 132,
          textLength: 140,
          fontSize: 8,
          fontColor: "#2D2E2D"
        },
        titles: {
          fontColor: "#B6B6B5",
          fontSize: 10,
          fontType: "bold"
        },
        paragraph: {
          fontColor: "#2D2E2D",
          fontSize: 8,
          fontType: "normal"
        },
        designer: {
          textLength: 70,
          fontSize: 8,
          fontColor: "#2D2E2D",
          y: 282,
          imageWidth: 254,
          marginImage: 276 + 40
        },
        banner: {
          y: 94,
          height: 335
        },
        specifications: {
          y: 453,
          fontSize: 8,
          fontColor: "#2D2E2D"
        },
        ledModule: {
          y: 600,
          fontSize: 8,
          fontColor: "#2D2E2D"
        },
        moduleColors: {
            y: 453
        }
      }
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
  computed: {},
  methods: {
    header(doc, x, y) {
      doc.setTextColor("#000000");
      doc.setFontSize(this.config.header.fontSize);
      doc.setFontType("bold");

      var w = doc.getStringUnitWidth(".DECIMAL") * this.config.header.fontSize;
      var width = doc.internal.pageSize.getWidth();
      doc.setFontSize(24);
      doc.text(
        ".DECIMAL",
        width - w - this.config.margins.left,
        this.config.margins.top
      );

      //Texto Modelo del diseño
      doc.setFontType("normal");
      doc.setFontSize(24);
      doc.setTextColor("#000000");
      if (this.project.modelo) {
        doc.text(
          this.project.modelo,
          this.config.margins.left,
          this.config.margins.top
        );
      }

      //Texto nombre del diseñador
      doc.setFontType("normal");
      doc.setFontSize(10);
      doc.setTextColor("#676767");
      if (this.project.disenador) {
        doc.text(
          this.config.margins.left,
          64 + y,
          "by " + this.project.disenador
        );
      }

      return doc;
    },
    setDescription(doc, x, y) {
      doc.setFontSize(this.config.titles.fontSize);
      doc.setTextColor(this.config.titles.fontColor);
      doc.text(x, y, "DESCRIPTION");

      doc.setFontType("normal");
      doc.setFontSize(this.config.descripcion.fontSize);
      doc.setTextColor(this.config.descripcion.fontColor);
      if (this.project.descripcion) {
        doc.text(
          x,
          y + 15,
          this.insertLineBreaks(
            this.project.descripcion,
            this.config.descripcion.textLength
          )
        );
      }
      return doc;
    },
    setDesignerBlock(doc, x, y) {
      doc.setFontSize(this.config.titles.fontSize);
      doc.setTextColor(this.config.titles.fontColor);
      doc.text(x, y, "DESIGNER");

      doc.setFontSize(this.config.designer.fontSize);
      doc.setTextColor(this.config.designer.fontColor);
      if (this.project.bio) {
        doc.text(
          x,
          y + 10,
          this.insertLineBreaks(
            this.project.bio,
            this.config.designer.textLength
          )
        );
      }

      var width = doc.internal.pageSize.getWidth();

      if (this.bio) {
        this.insertImage(
          doc,
          $("#img_bio"),
          this.config.designer.marginImage + x,
          y,
          this.config.designer.imageWidth
        );
      }

      return doc;
    },
    setSpecificationsBlock(doc, x, y) {
      doc.setFontSize(this.config.titles.fontSize);
      doc.setTextColor(this.config.titles.fontColor);
      doc.text(x, y, "SPECIFICATIONS");

      doc.setFontType("normal");
      doc.setFontSize(this.config.specifications.fontSize);
      doc.setTextColor(this.config.specifications.fontColor);
      if (this.project.type) {
        doc.text(x, y + 22, "Type: " + this.project.type);
      }

      doc.text(x, y + 40, "Materials: ");

      if (this.project.materials) {
        doc.text(
          x + 5,
          y + 50,
          this.insertLineBreaks(this.project.materials, 60)
        );
      }

      var h = this.getHeight(
        doc,
        this.insertLineBreaks(this.project.materials, 60),
        this.config.specifications.fontSize
      );

      if (this.project.cordLength)
        doc.text(x, y + 50 + h + 20, "Cord length: " + this.project.cordLength);
      doc.text(
        x + 15,
        y + 50 + h + 30,
        "*custom length available upon request"
      );
    },
    setLedModuleBlock(doc, x, y) {
      doc.setFontType("bold");
      doc.setTextColor(this.config.titles.fontColor);
      doc.setFontSize(this.config.titles.fontSize);
      doc.text(x, y, "LED MODULE");

      doc.setFontType("normal");
      doc.setTextColor(this.config.ledModule.fontColor);
      doc.setFontSize(this.config.ledModule.fontSize);
      if (this.project.input) {
        doc.text(x, y + 20, "Input: " + this.project.input);
      }
      if (this.project.voltage) {
        doc.text(x, y + 32, "Voltage: " + this.project.voltage);
      }

      if (this.project.dimming) {
        doc.text(x, y + 44, "Dimming: " + this.project.dimming);
      }

      if (this.project.lumenOutput) {
        doc.text(x, y + 56, "Lumen output: " + this.project.lumenOutput);
      }

      if (this.project.colorTemperature) {
        doc.text(
          x,
          y + 68,
          "Color temperature: " + this.project.colorTemperature
        );
      }

      if (this.project.cri) {
        doc.text(x, y + 80, "CRI: " + this.project.cri);
      }
      if (this.project.lifeSpan) {
        doc.text(x, y + 92, "Lifespan: " + this.project.lifeSpan);
      }
    },
    setFontTitle(doc) {
      doc.setFontType(this.config.titles.fontType);
      doc.setTextColor(this.config.titles.fontColor);
      doc.setFontSize(this.config.titles.fontSize);
    },
    setFontNormal(doc) {
      doc.setFontType(this.config.paragraph.fontType);
      doc.setTextColor(this.config.paragraph.fontColor);
      doc.setFontSize(this.config.paragraph.fontSize);
    },
    getHeight(doc, str, fontSize) {
      var lineHeight = doc.internal.getLineHeightFactor();
      console.log(lineHeight);
      var numberOfLines = str.split(/\r\n|\r|\n/).length;
      console.log(numberOfLines);
      var height = fontSize * numberOfLines * lineHeight;
      console.log(height);
      return height;
    },
    insertImage(doc, img, x, y, width) {
      var h = img.height();
      var w = img.width();
      var nh = (h * width) / w;
      console.log(h, w, nh, width, img.attr("src"));
      doc.addImage(img.attr("src"), "JPEG", x, y, width, nh);
    },
    insertLineBreaks(sentence, x) {
      var regexp = new RegExp("(.{" + x + "}[^ ]*) ", "g");
      return sentence.replace(regexp, "$1\n");
    },
    descargar() {
      if (!this.project) {
        alert("No hay datos");
        return;
      }
      var doc = new jsPDF("p", "pt", "letter");

      this.header(doc, 0, 0);

      this.setDescription(
        doc,
        this.config.margins.left,
        this.config.descripcion.y
      );

      this.setDesignerBlock(
        doc,
        this.config.margins.left,
        this.config.designer.y
      );

      doc.addPage();

      this.header(doc, 0, 0);

      if (this.prod) {
        doc.addImage(
          this.prod,
          "JPEG",
          0,
          this.config.banner.y,
          doc.internal.pageSize.getWidth(),
          this.config.banner.height
        );
      }

      this.setSpecificationsBlock(
        doc,
        this.config.margins.left,
        this.config.specifications.y
      );

      this.setLedModuleBlock(
        doc,
        this.config.margins.left,
        this.config.ledModule.y
      );

      this.setFontTitle(doc);
      doc.text(this.config.margins.left, 730, "WARRANTY");

      this.setFontNormal(doc);
      doc.text(this.config.margins.left, 750, "5 years limited warranty");

      doc.setFontSize(6);
      doc.text(
        this.config.margins.left,
        770,
        "© Decimal Industries Inc. All rights reserved."
      );

      this.setFontTitle(doc);
      doc.text(352, this.config.specifications.y, "CERTIFICATIONS");

      if (this.cert) {
        doc.addImage(
          this.cert,
          "JPEG",
          352,
          this.config.specifications.y + 20,
          30,
          30
        );
      }

      this.setFontTitle(doc);
      doc.text(352, this.config.ledModule.y, "DIMENSIONS");

      if (this.dim) {
        doc.addImage(
          this.dim,
          "JPEG",
          352,
          this.config.ledModule.y + 10,
          180,
          180
        );
      }

      doc.addPage();

      this.header(doc, 0, 0);

      this.setFontTitle(doc);
      doc.text(
        this.config.margins.left,
        this.config.moduleColors.y,
        "MODULE COLORS"
      );

      var offset = 0;
      if (this.images.gold && this.project.moduleColors.includes("gold")) {
        doc.addImage(
          this.images.gold,
          "JPEG",
          this.config.margins.left,
          this.config.moduleColors.y + 20,
          70,
          70
        );
        offset += 75;
      }

      if (this.images.black && this.project.moduleColors.includes("black")) {
        doc.addImage(
          this.images.black,
          "JPEG",
          this.config.margins.left + offset,
          this.config.moduleColors.y + 20,
          70,
          70
        );
        offset += 75;
      }

      if (this.images.silver && this.project.moduleColors.includes("silver"))
        doc.addImage(
          this.images.silver,
          "JPEG",
          this.config.margins.left + offset,
          this.config.moduleColors.y + 20,
          70,
          70
        );

      if (this.est) {
          doc.addImage(this.est, "JPEG", 352, this.config.moduleColors.y , 150, 150);
      }

      if (this.project.nombre) doc.save(this.project.nombre + ".pdf");
      else doc.save("unnamed.pdf");
    }
  }
};
</script>