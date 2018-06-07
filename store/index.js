import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      access_token: null,
      user: {
        informations: null,
        repos: null
      },
    },
    getters: {
      access_token(state) {
        return state.access_token;
      },
      user(state) {
        return state.user;
      }
    },
    mutations: {
        SET_ACCESSTOKEN (state, access_token) {
          state.access_token = access_token;
        },
        SET_USERINFORMATIONS (state, informations) {
          state.user.informations = informations;
        },
        SET_USERREPOS (state, repos) {
          state.user.repos = repos;
        },
      },
    actions: {
      setAccessToken ({ commit }, access_token) {
        commit('SET_ACCESSTOKEN', access_token);
      },
      setUserInformations ({ commit }, informations) {
        commit('SET_USERINFORMATIONS', informations);
      },
      setUserRepos ({ commit }, repos) {
        commit('SET_USERREPOS', repos);
      },
    }
  });
};

export default createStore;
