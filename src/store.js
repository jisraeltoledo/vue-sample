/*jshint esversion: 6 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userRole: "guest"
  },
  mutations: {
    setUserRol(state, rol) {
      console.log("seting rol", rol);
      state.userRole = rol;
    }
  },
  actions: {}
});
