const axios = require("axios");

export default function () {
  // let user = {};
  // if (req.session && req.session.authUser) {
  //   user.username = req.session.authUser.username;
  //   user.access_token = req.session.authUser.access_token;
  // } else {
  //   user.username = "";
  //   user.access_token = "";
  // }
  // if (req.session && req.session.activeRepo){
  //   commit("SET_ACTIVEREPO", req.session.activeRepo);
  // }
  // if (req.session && req.session.activeCategory){
  //   commit("SET_ACTIVECATEGORY", req.session.activeCategory);
  // }
  // return axios
  // .post(`/api/login`, {
  //   user
  // })
  // .then(res => {
  //   if (req.session.authUser) {
  //     commit("SET_USER", "logged");
  //     return axios
  //       .get(
  //         `/api/github/user/${
  //           req.session.authUser.access_token
  //         }`
  //       )
  //       .then(res => {
  //         commit("SET_USERINFORMATIONS", res.data);
  //         commit("SET_ACCESSTOKEN", req.session.authUser.access_token);
  //       })
  //       .catch(error => {
  //         console.log(error.response);
  //       });
  //   }
  // });
}