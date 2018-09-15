import Vue from 'vue';
import Vuex from 'vuex';
import { getTodoModule } from './modules/todo';

Vue.use(Vuex);

const mainStore = new Vuex.Store({
  state: {
    loginUser: null,
  },
  modules: {
    todo: getTodoModule(),
  },
  mutations: {
    setLoginUser(state, user) {
      state.loginUser = user;
    },
  },
});

export { mainStore };
