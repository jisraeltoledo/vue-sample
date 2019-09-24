/*jshint esversion: 6 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import { roles } from "@/router";
import CKEditor from "@ckeditor/ckeditor5-vue";
import JsonEditor from "vue-json-edit";

Vue.use(JsonEditor);
Vue.use(CKEditor);
Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.mixin({
  created: function() {},
  methods: {
    hasRol(rol) {
      return (
        store.state.userRole === rol ||
        store.state.userRole === roles.super_admin
      );
    },
    notHasRol(rol) {
      return store.state.userRole !== rol;
    },
    colorHeart(projectid) {
      if (store.state.user.likes) {
        return store.state.user.likes.includes(projectid)
          ? "color: #FFD700;"
          : "color: black;";
      }
      return "color: black;";
    },
    removeHTMLTags(text) {
      text = text.replace(/<p>/g, "\n");
      text = text.replace(/<\/p>/g, "\n");
      text = text.replace(/<\/li>/g, "\n");
      text = text.replace(/<\/ul>/g, "");
      text = text.replace(/<ul>/g, "");
      text = text.replace(/<li>/g, "   •");
      return text;
    }
  }
});

let app = "";
const firebaseConfig = {
  apiKey: "AIzaSyCb0lXfuHx5yQTzKb40gsLKvVo0dVqAfpk",
  authDomain: "decimal-fic-tec.firebaseapp.com",
  databaseURL: "https://decimal-fic-tec.firebaseio.com",
  projectId: "decimal-fic-tec",
  storageBucket: "decimal-fic-tec.appspot.com",
  messagingSenderId: "465869946229",
  appId: "1:465869946229:web:c7281894f9eafe0a"
};
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    store.commit("setUserRol", "guest");
    initApp();
    return;
  }
  console.log(user.email);
  return db
    .collection("users")
    .where("email", "==", user.email)
    .get()
    .then(snap => {
      if (snap.empty) {
        store.commit("setUserRol", "guest");
        initApp();
        return;
      }
      console.log();
      var userdata = snap.docs[0].data();
      userdata.id = user.uid;
      store.commit("setUserRol", userdata.rol);
      store.commit("setUser", userdata);
      initApp();
    });
});

function initApp() {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount("#app");
  }
}
