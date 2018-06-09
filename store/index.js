import Vuex from "vuex";
import Axios from "axios";

const axios = require("axios");

const createStore = () => {
  return new Vuex.Store({
    state: {
      access_token: null,
      user: {
        informations: null,
        repos: null
      },
      activeCategory: null,
      activeRepo: null,
      authUser: null,
      slug: null
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
      },
      active_category(state) {
        return state.active_category;
      },
      slug(state) {
        return state.slug;
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
      SET_ACTIVECATEGORY(state, activeCategory) {
        state.active_category = activeCategory;
      },
      SET_USER: function(state, user) {
        state.authUser = user;
      },
      SET_SLUG: function(state, slug) {
        state.slug = slug;
      }
    },
    actions: {
      nuxtServerInit({ commit }, { req }) {
        let user = {};
        if (req.session && req.session.authUser) {
          user.username = req.session.authUser.username;
          user.access_token = req.session.authUser.access_token;
        } else {
          user.username = "";
          user.access_token = "";
        }
        return axios
          .post("http://localhost:3000/api/login", {
            user
          })
          .then(res => {
            if (req.session.authUser) {
              commit("SET_USER", "logged");
              return axios
                .get(
                  `http://localhost:3000/api/github/user/${
                    req.session.authUser.access_token
                  }`
                )
                .then(res => {
                  commit("SET_USERINFORMATIONS", res.data);
                  commit("SET_ACCESSTOKEN", req.session.authUser.access_token);
                })
                .catch(error => {
                  console.log(error.response);
                });
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
      },
      setActiveCategory({ commit }, activeCategory) {
        commit("SET_ACTIVECATEGORY", activeCategory);
      },
      setSlug({ commit }, slug) {
        commit("SET_SLUG", slug);
      }
    }
  });
};

export default createStore;
