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
        SET_ACCESSTOKEN (state, accessToken) {
          state.access_token = accessToken;
        },
      },
    actions: {
      setAccessToken ({ commit }, accessToken) {
        commit('SET_ACCESSTOKEN', accessToken);
      },
    }
    })
  };

  export default createStore;
