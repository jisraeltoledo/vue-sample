<template>
  <div class="home">
    <button :disabled="!ready" @click="exportPdf" class="btn btn-primary"><i class="fas fa-download"></i></button>
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import { db } from "@/main";
import store from "@/store";
import jsPDF from "jspdf";
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
  created() {
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
        this.ready = true;
        console.log(this.ready);
        this.registerFonts();
      });
  },
  mounted() {},
  methods: {
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
    exportPdf() {
      this.exportData.sections.forEach(sec => {
        if (sec.type === "text-field") {
          this.addText(sec, this.project[sec.field]);
        }
        if (sec.type === "image-field") {
          this.addImage(sec, this.project[sec.field]);
        }
        if (sec.type === "image") {
          this.addImage(sec, sec.src);
        }
        if (sec.type === "text") {
          this.addText(sec, sec.text);
        }
      });
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
    },
    addText(section, text) {
      if (!text) return;
      text = "" + text;
      console.log("addtext", section, text);
      this.doc.setTextColor(section.fontColor);
      this.doc.setFont(section.font, section.fontType);
      this.doc.setFontSize(section.fontSize);
      if (section.textLength) {
        text = this.insertLineBreaks(text, section.textLength);
      }
      if (section.x < 0) {
        // Margen derecho
        var w = this.doc.getStringUnitWidth(text) * section.fontSize;
        var width = this.doc.internal.pageSize.getWidth();
        section.x = width - w + section.x;
      }
      this.doc.text(text, section.x, section.y);
    },
    insertLineBreaks(text, x) {
      var regexp = new RegExp("(.{" + x + "}[^ ]*) ", "g");
      return text.replace(regexp, "$1\n");
    },
    registerFonts (){
        Object.keys(store.state.fonts).forEach (fontName=>{
            this.registerFont (fontName, store.state.fonts[fontName]);
        });
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
    },
    // loadFont(fontName) {
    //   fontName = fontName.substring(2); // Remove './' from name
    //   var reader = new FileReader();
    //   reader.onload = e => {
    //     // .split(",").pop() => remove first part data:[<mediatype>][;base64],<data>
    //     var x = e.target.result.split(",").pop();
    //     console.log ("reader.onload", x);
    //     this.registerFont(fontName, x);
    //   };
    //   var xhr = new XMLHttpRequest();
    //   // fonts in public/assets
    //   xhr.open("GET", window.location.origin+"/assets/fonts/" + fontName);
    //   xhr.responseType = "blob"; //force the HTTP response, response-type header to be blob
    //   xhr.onload = function() {
    //     console.log ("get assets fonts", xhr.response);
    //     reader.readAsDataURL(xhr.response); //xhr.response is now a blob object
    //   };
    //   xhr.send();
    // },
    // loadFonts() {
    //   // Iterate over folder to find fonts
    //   require
    //     .context("../../public/assets/fonts/", false, /\.ttf$/)
    //     .keys()
    //     .forEach(key => {
    //       console.log ("key", key);
    //       this.loadFont(key);
    //       });
    // },
  }
};
</script>