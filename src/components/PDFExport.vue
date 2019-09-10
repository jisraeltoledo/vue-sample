<template>
  <div class="home">
    <button @click="click" class="btn btn-primary">
      <i class="fas fa-download"></i>
    </button>
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import { db } from "@/main";
import store from "@/store";
// import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as jsPDF from "jspdf";
export default {
  name: "pdf-export",
  props: {
    project: Object
  },
  data() {
    return {
      //projectid: "007I6UXe2kS44cIVYZ2v",
      //project: null,
      doc: null,
      exportId: "GPRhnpTy77demsHh1tHB",
      exportData: null,
      ready: false,
      promises: []
    };
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    click() {
      return db
        .collection("export")
        .doc(this.exportId)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.exportData = doc.data();
            this.exportData["id"] = doc.id;
          }
          return true;
        })
        .then(() => {
          this.doc = new jsPDF("p", "pt", "letter");
          this.registerFonts();
          this.exportPdf();
        });
    },
    readFile(file) {
      return new Promise((resolve, reject) => {
        let fr = new FileReader();
        fr.onload = x => resolve(fr.result);
        fr.readAsDataURL(file); // or readAsText(file) to get raw content
      });
    },
    makeRequest(url, method) {
      // Create the XHR request
      var request = new XMLHttpRequest();
      // Return it as a Promise
      return new Promise(function(resolve, reject) {
        // Setup our listener to process compeleted requests
        request.onreadystatechange = function() {
          // Only run if the request is complete
          if (request.readyState !== 4) return;
          // Process the response
          if (request.status >= 200 && request.status < 300) {
            // If successful
            //resolve(request.response);
            let fr = new FileReader();
            fr.onload = x => resolve(fr.result);
            fr.readAsDataURL(request.response); // or readAsText(file) to get raw content
          } else {
            // If failed
            reject({
              status: request.status,
              statusText: request.statusText
            });
          }
        };
        // Setup our HTTP request
        request.open(method || "GET", url, true);
        // Send the request
        request.responseType = "blob";
        request.send();
      });
    },
    async exportPdf() {
      // this.exportData.sections.forEach(async sec => {
      for (let sec of this.exportData.sections) {
        console.log("type:", sec.type);
        if (sec.type === "text-field") {
          this.addText(sec, this.project[sec.field]);
        }
        if (sec.type === "image-field") {
          await this.addImage(sec, this.project[sec.field]);
        }
        if (sec.type === "image") {
          this.addImage(sec, sec.src);
        }
        if (sec.type === "text") {
          this.addText(sec, sec.text);
        }
        if (sec.type === "line") {
          this.doc.line(sec.x, sec.y, sec.w, sec.h);
        }
        if (sec.type === "newPage") {
          this.doc.addPage();
        }
      }
      Promise.all(this.promises).then(res => {
        this.doc.save("export.pdf");
      });
    },
    addImage(section, src) {
      if (!src) return;
      if (section.x < 0) {
        // Margen derecho
        var width = this.doc.internal.pageSize.getWidth();
        section.x = width + section.x;
      }
      var _this = this;
      var p = this.makeRequest(src, "GET")
        .then(result => {
          this.doc.addImage(
            result,
            "JPEG",
            section.x,
            section.y,
            section.w,
            section.h
          );
          return true;
        })
        .catch(function(error) {
          return false;
        });
      this.promises.push(p);
      return p;
    },
    addText(section, text) {
      if (!text) return;
      text = "" + text;
      console.log("addtext", section, text, dim);
      this.doc.setTextColor(section.fontColor);
      this.doc.setFont(section.font, section.fontType);
      this.doc.setFontSize(section.fontSize);
      var dim = this.doc.getTextDimensions(text);
      text = text.replace(/\\n/g, "\n");
      if (section.textLength) {
        text = this.insertLineBreaks(text, section.textLength);
      }
      if (section.x < 0) {
        // Margen derecho
        var w = this.doc.getStringUnitWidth(text) * section.fontSize;
        var width = this.doc.internal.pageSize.getWidth();
        section.x = width - w + section.x;
      }
      if (section.bullet){
        text = section.bullet+" "+text;
      }
      this.doc.text(text, section.x, section.y + dim.h);
      if (section.underline) {
        var w = this.doc.getStringUnitWidth(text) * section.fontSize;

        console.log("w, dim", w, dim, text);
        this.doc.line(
          section.x,
          section.y + dim.h + 5,
          section.x + w,
          section.y + dim.h + 5
        );
      }
    },
    insertLineBreaks(text, x) {
      var regexp = new RegExp("(.{" + x + "}[^ ]*) ", "g");
      return text.replace(regexp, "$1\n");
    },
    registerFonts() {
      Object.keys(store.state.fonts).forEach(fontName => {
        console.log(fontName);
        this.registerFont(fontName, store.state.fonts[fontName]);
      });
      console.log("Fonts", this.doc.getFontList());
    },
    registerFont(fontName, base64) {
      // Remove extension
      const withoutExt = fontName.replace(/\.[^/.]+$/, "");
      const parts = withoutExt.split("-");
      console.log(parts);
      this.doc.addFileToVFS(fontName, base64);
      if (parts.length == 1) {
        this.doc.addFont(fontName, withoutExt, "normal");
      } else {
        this.doc.addFont(fontName, parts[0], parts[1]);
      }
    }
  }
};
</script>