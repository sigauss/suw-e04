<template>
  <section class="container">
    <!-- <h1 class="title">
      CATEGORIES
    </h1>
    <form ref="form" name="createCategory"  @submit.prevent="createCategory">
      <input type="text" name="categoryName" />
      <button type="submit">Create category</button>
    </form>
    <ul class="repos">
      <li v-for="(file, name) in contents" :key="name" class="repos">
        <router-link :to="`./${$store.getters.active_repo.name}/${file.name}`">
          <span v-if="file.type === 'dir'"><i class="fa fa-folder-o"></i></span>
          <span v-else><i class="fa fa-file-o"></i></span>
          {{ file.name }}
        </router-link>
      </li>
    </ul> -->
    <div v-bind:class="{'repos__logoContainer--hidden':!$store.getters.isLoading}" class="repos__logoContainer">
      <img class="repos__logo" src="~assets/img/accio_logo_fat.gif">
      <div class="repos__logoCircle"></div>
    </div>
  </section>
</template>

<script>
import axios from "~/plugins/axios";
import logoutMixin from '~/mixins/logoutMixin';

export default {
  mixins: [logoutMixin],
  fetch ({ store, params, route, redirect }) {
    if (store.state.authUser != 'logged') {
      return redirect('/login')
    }
    store.dispatch('setSlug', route.params.slug)
  },
  data() {
    return { 
      contents: '',
      slug: ''
    }
  },
  async asyncData(route) {
  let slug = route.params.slug
  return {slug: slug}
  },
  head() {
    return {
      title: "Repos"
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let repoOwner;      
      // TODO Factoriser
      if(!this.$store.getters.user.repos){
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
              console.log(repo.name, repoOwner)
              this.$store.dispatch("setActiveRepo", {
                name: repo.name,
                owner: repoOwner
              });
            }
          });
          axios.get(
                "https://api.github.com/repos/" +
                  repoOwner +
                  "/" +
                  this.$store.getters.slug +
                  "/contents/?access_token=" +
                  this.$store.getters.access_token
          )
          .then(res => {
            this.$store.dispatch('setActiveRepoCategories', res.data);
            this.contents = res.data
          })
          .catch(e => {
            console.log(e)
            this.logoutMixin()
          })
        })
        .catch( e => {
          console.log(e)
          this.logoutMixin()
        })
      }
      else{
        const repos = this.$store.getters.user.repos
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
              console.log(repo.name, repoOwner)
              this.$store.dispatch("setActiveRepo", {
                name: repo.name,
                owner: repoOwner
              });
              return axios.post('/api/update-session-active-repo',{
                  name: repo.name,
                  owner: repoOwner
              })
              .then(res => {
                console.log(res.data)
              })
              .catch(e =>{
                console.log(e)
              })
            }
          });
          axios.get(
                "https://api.github.com/repos/" +
                  repoOwner +
                  "/" +
                  this.$store.getters.slug +
                  "/contents/?access_token=" +
                  this.$store.getters.access_token
          )
          .then(res => {
            this.$store.dispatch('setActiveRepoCategories', res.data);
            this.contents = res.data
          })
          .catch(e => {
            this.logoutMixin()
          })
        })
        .catch(e => {
          this.logoutMixin()
        })
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
      ;
    },
    createCategory() {
      this.githubAction(this.$refs.form.categoryName.value);
    }
  }
};
</script> 

<style scoped>
.container{
  width: calc(100% - 301px);
  min-height: 100vh;
  margin-left: 301px;
}
.repos__logoContainer{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 130px;
  height: 130px;
}

.repos__logoContainer--hidden{
  display: none;
}
.repos__logo{
  width: 130px;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  transform: translate3d(-50%, -50%, 0);
}
.repos__logoCircle{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3D(-50%, -50%, 0);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid #C6D2D6;
  animation-name: circleFade;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}
.repos__logoCircle:before, .repos__logoCircle:after{
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3D(-50%, -50%, 0);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid #C6D2D6;
  animation-name: circleFade;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}

.repos__logoCircle:before{
  animation-delay: 0.3s;
}

.repos__logoCircle:after{
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