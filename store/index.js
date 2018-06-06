import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      access_token: null,
    },
    getters: {
        access_token (state) {
          return state.access_token
        },
    },
    mutations: {
        SET_ACCESSTOKEN (state, access_token) {
          state.access_token = access_token;
        },
      },
    actions: {
      setAccessToken ({ commit }, access_token) {
        commit('SET_ACCESSTOKEN', access_token);
      },
    }
    })
  };

  export default createStore;
