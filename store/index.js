import Vuex from "vuex";
import Axios from "axios";

const axios = require('axios')

const createStore = () => {
  return new Vuex.Store({
    state: {
      access_token: null,
      user: {
        informations: null,
        repos: null
      },
      activeRepo: null,
      authUser: null
    },
    getters: {
      access_token(state) {
        return state.access_token;
      },
      user(state) {
        return state.user;
      },
      active_repo(state) {
        return state.active_repo;
      }
    },
    mutations: {
      SET_ACCESSTOKEN(state, access_token) {
        state.access_token = access_token;
      },
      SET_USERINFORMATIONS(state, informations) {
        state.user.informations = informations;
      },
      SET_USERREPOS(state, repos) {
        state.user.repos = repos;
      },
      SET_ACTIVEREPO(state, activeRepo) {
        state.active_repo = activeRepo;
      },
      SET_USER: function (state, user) {
        state.authUser = user
      }
    },
    actions: {
      nuxtServerInit ({ commit }, { req }) {
        let user = {}
        if (req.session && req.session.authUser){
          user.username = req.session.authUser.username
          user.access_token = req.session.authUser.access_token
        }
        else{
          user.username = ''
          user.access_token = ''
        }
        return axios.post('http://localhost:3000/api/login', {
          user
        })
        .then((res) => {
          if(req.session.authUser){
            commit('SET_USER', res.data)
          }
        });
      },
      setAccessToken({ commit }, access_token) {
        commit("SET_ACCESSTOKEN", access_token);
      },
      setUserInformations({ commit }, informations) {
        commit("SET_USERINFORMATIONS", informations);
      },
      setUserRepos({ commit }, repos) {
        commit("SET_USERREPOS", repos);
      },
      setActiveRepo({ commit }, activeRepo) {
        commit("SET_ACTIVEREPO", activeRepo);
      }
    }
  });
};

export default createStore;
