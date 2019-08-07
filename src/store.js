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
      state.userRole = rol;
    },
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {}
});
