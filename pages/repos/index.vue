<template>
  <section class="container">
      <!-- <button @click="logout">Logout</button> -->
    <div class="repos__logoContainer">
      <img class="repos__logo" src="~assets/img/accio_logo_fat.png">
      <div class="repos__logoCircle"></div>
    </div>
    <h1 class="repos__title">Hi ! Welcome to Accio</h1>
    <h2 class="repos__subtitle">To join, please select one of your accio workspaces.</h2>
    <form ref="form" name="createRepo"  @submit.prevent="submitRepo">
      <input type="text" name="repoName" />
      <button type="submit">Create</button>
    </form>
    <div class="repos__reposList">
      <div v-for="(repo, name) in repos" :key="name" class="repos__repoCard">
        <router-link :to="`/repos/${repo.name}`">
          <div class="repos__repoContent">
            <div class="repos__repoTextContainer">
              <div class="repos__repoName">{{ repo.name.substring(0, 10) + '...' }}</div>
              <div class="repos__repoPrivate">{{ repo.private === true ? "Private" : "Public" }}</div>
            </div>
            <div class="repos__repoPicContainer">
              <img class="repos__repoPic" :src="repo.owner.avatar_url">
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "~/plugins/axios";
import logoutMixin from '~/mixins/logoutMixin'

export default {
  data() {
    return { 
      repos: '',
    }
  },
  head() {
    return {
      title: "Repos"
    };
  },
  mounted() {
    this.init();
  },
  mixins: [logoutMixin],
  methods: {
    init() {
      axios
        .get(
          "https://api.github.com/user/repos?access_token=" +
            this.$store.getters.access_token
        )
        .then(res => {
          this.$store.dispatch("setUserRepos", res.data);
          this.repos = res.data
        })
        .catch(e => {
          this.logoutMixin()
        })
    },
    async logout() {
      axios.get('/api/logout')
      .then(res => {
        this.logoutMixin()
      })
      .catch(e => {
        console.log(e)
      })
    },
    submitRepo() {
      return axios({
        method: "post",
        url:
          "https://api.github.com/user/repos?access_token=" +
          this.$store.getters.access_token,
        data: {
          name: "Accio-" + this.$refs.form.repoName.value,
          private: false,
          auto_init: true,
        },
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res => {
        alert("repo created");
      })
      .catch(e =>{
        
      })
    }
  },
  fetch ({ store, redirect }) {
    if (store.state.authUser != 'logged') {
      return redirect('/login')
    }
  }
};
</script> 

<style scoped>
.container{
  background-color: #F5F6FA;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding-bottom: 80px;
}
.repos__logoContainer{
  margin-top: 160px;
  position: relative;
  width: 130px;
  height: 130px;
}
.repos__logo{
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

.repos__title{
  margin-top: 70px;
  width: 280px;
  font-size: 31px;
  line-height: 39px;
  text-align: center;
}
.repos__subtitle{
  margin-top: 24px;
  font-size: 14px;
  line-height: 1.5;
}
.repos__reposList{
  display: flex;
  width: 700px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.repos__repoCard{
  width: 256px;
  padding: 23px 21px 32px 19px;
  margin-top: 20px;
  box-sizing: border-box;
  background-color: white;
}
.repos__repoPicContainer{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}
.repos__repoPic{
  width: 100%;
}

.repos__repoContent{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.repos__repoName{
  font-size: 21px;
  width: 70%;
}
.repos__repoPrivate{
  font-size: 11px;
  margin-top: 11px;
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
