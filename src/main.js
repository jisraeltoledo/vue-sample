/*jshint esversion: 6 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";

Vue.config.productionTip = false;

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
  return db
    .collection("users")
    .doc(user.uid)
    .get()
    .then(userdb => {
      store.commit("setUserRol", userdb.data().rol);
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
