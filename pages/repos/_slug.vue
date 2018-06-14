<template>
  <section class="container">
    <div v-if="!$store.getters.isLoading" class="welcome-text">
      <div class="flex align-center justify-center">
        <div class="left">
          <h1>Hello 🖐🏼 🐙</h1>
          <p>
            Invite your collaborators via github and start creating your categories and components.<br />
            Dont forget to add a config.json if you commit a new component in order to have it listed in your category !
          </p>
        </div>
        <div class="right">
          <img src="../../assets/img/illu.png"/>
        </div>
      </div>
      <div class="center-link">
        <p>You can find the repo of your components at this url: <br /> <a :href="repoUrl">{{repoUrl}}</a> </p>
      </div>
    </div>
    <div v-bind:class="{'repos__logoContainer--hidden':!$store.getters.isLoading}" class="repos__logoContainer">
      <img class="repos__logo" src="~assets/img/accio_logo_fat.gif">
      <div class="repos__logoCircle"></div>
    </div>
  </section>
</template>

<script>
import axios from "~/plugins/axios";
import logoutMixin from "~/mixins/logoutMixin";

export default {
  mixins: [logoutMixin],
  fetch({ store, params, route, redirect }) {
  //   if (store.state.authUser != "logged") {
  //     return redirect("/login");
  //   }
    store.dispatch("setSlug", route.params.slug);
  },
  data() {
    return {
      contents: "",
      slug: "",
      repoUrl: null
    };
  },
  async asyncData(route) {
    let slug = route.params.slug;
    return {
      slug: slug
    };
  },
  head() {
    return {
      title: "Repos"
    };
  },
  mounted() {
    this.init();
    this.$store.dispatch("setActiveCategory", null);
  },
  methods: {
    init() {
      let repoOwner;
      // TODO Factoriser
      if (!this.$store.getters.user.repos) {
        axios
          .get(
            "https://api.github.com/user/repos?access_token=" +
              this.$store.getters.access_token
          )
          .then(res => {
            this.$store.dispatch("setUserRepos", res.data);
            res.data.forEach(repo => {
              if (repo.name === this.$store.getters.slug) {
                repoOwner = repo.owner.login;
                console.log(repo.name, repoOwner);
                this.$store.dispatch("setActiveRepo", {
                  name: repo.name,
                  owner: repoOwner
                });
              }
            });
            axios
              .get(
                "https://api.github.com/repos/" +
                  repoOwner +
                  "/" +
                  this.$store.getters.slug +
                  "/contents/?access_token=" +
                  this.$store.getters.access_token
              )
              .then(res => {
                this.$store.dispatch("setActiveRepoCategories", res.data);
                this.repoUrl = `https://github.com/${repoOwner}/${
                  this.$store.getters.slug
                }`;
                this.contents = res.data;
              })
              .catch(e => {
                console.log(e);
                // this.logoutMixin();
              });
          })
          .catch(e => {
            console.log(e);
            // this.logoutMixin();
          });
      } else {
        const repos = this.$store.getters.user.repos;
        axios
          .get(
            "https://api.github.com/user/repos?access_token=" +
              this.$store.getters.access_token
          )
          .then(res => {
            this.$store.dispatch("setUserRepos", res.data);
            repos.forEach(repo => {
              if (repo.name === this.$store.getters.slug) {
                repoOwner = repo.owner.login;
                this.$store.dispatch("setActiveRepo", {
                  name: repo.name,
                  owner: repoOwner
                });
                return axios
                  .post("/api/update-session-active-repo", {
                    name: repo.name,
                    owner: repoOwner
                  })
                  .then(res => {
                    console.log(res.data);
                  })
                  .catch(e => {
                    console.log(e);
                  });
              }
            });
            axios
              .get(
                "https://api.github.com/repos/" +
                  repoOwner +
                  "/" +
                  this.$store.getters.slug +
                  "/contents/?access_token=" +
                  this.$store.getters.access_token
              )
              .then(res => {
                this.$store.dispatch("setActiveRepoCategories", res.data);
                this.repoUrl = `https://github.com/${repoOwner}/${
                  this.$store.getters.slug
                }`;
                this.contents = res.data;
              })
              .catch(e => {
                // this.logoutMixin();
                console.log(e)
              });
          })
          .catch(e => {
            // this.logoutMixin();
            console.log(e)
          });
      }
    },
    githubAction(categoryName) {
      return axios
        .put(
          `https://api.github.com/repos/${
            this.$store.getters.active_repo.owner
          }/${
            this.$store.getters.active_repo.name
          }/contents/${categoryName}/README.md?access_token=${
            this.$store.getters.access_token
          }`,
          {
            message: `:octopus: Accio :tophat: • ${Date.now()}`,
            content: btoa(
              "<h1>Hello</h1>Congratulations you just created your category of component"
            )
          }
        )
        .then(res => {
          store.store.dispatch("setUserRepos", res.data);
          return { repos: res.data };
        });
    },
    createCategory() {
      this.githubAction(this.$refs.form.categoryName.value);
    }
  }
};
</script> 

<style scoped>
.container {
  width: calc(100% - 301px);
  min-height: 100vh;
  margin-left: 301px;
  padding-top: 40px;
}
.welcome-text {
  padding-left: 30px;
  padding-right: 30px;
  width: 80%;
  margin: auto;
}
.welcome-text h1 {
  font-size: 32px;
  color: #574beb;
}
.welcome-text p {
  color: #9e9e9e;
  line-height: 22px;
}
.justify-center {
  justify-content: center;
}
.welcome-text img {
  width: 400px;
}
.welcome-text .right img {
  width: 80%;
}
.welcome-text .center-link {
  width: 100%;
  text-align: center;
  margin-top: 100px;
}
.welcome-text .center-link a {
  color: #6183ff;
  font-size: 14px;
}
.repos__logoContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 130px;
  height: 130px;
}
.right {
  text-align: right;
}
.repos__logoContainer--hidden {
  display: none;
}
.repos__logo {
  width: 130px;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  transform: translate3d(-50%, -50%, 0);
}
.repos__logoCircle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3D(-50%, -50%, 0);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid #c6d2d6;
  animation-name: circleFade;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}
.repos__logoCircle:before,
.repos__logoCircle:after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3D(-50%, -50%, 0);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid #c6d2d6;
  animation-name: circleFade;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}

.repos__logoCircle:before {
  animation-delay: 0.3s;
}

.repos__logoCircle:after {
  animation-delay: 0.6s;
}

@keyframes circleFade {
  0% {
    width: 10px;
    height: 10px;
    opacity: 1;
  }
  70% {
    width: 224px;
    height: 224px;
    opacity: 0.7;
  }
  80% {
    width: 224px;
    height: 224px;
    opacity: 0;
  }
  100% {
    width: 10px;
    height: 10px;
    opacity: 0;
  }
}
</style>