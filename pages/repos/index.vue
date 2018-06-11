<template>
  <section class="container">
    <h1 class="title">
      REPOS LIST
    </h1>
    <h2>{{ $store.getters.access_token }}</h2>
    <button @click="logout">Logout</button>
    <form ref="form" name="createRepo"  @submit.prevent="submitRepo">
      <input type="text" name="repoName" />
      <button type="submit">Create</button>
    </form>
    <ul class="repos">
      <li v-for="(repo, name) in repos" :key="name" class="repos">
        <router-link :to="`/repos/${repo.name}`">{{ repo.name }}</router-link>
      </li>
    </ul>
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
          private: true,
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
.title {
  margin: 30px 0;
}
.users {
  list-style: none;
  margin: 0;
  padding: 0;
}
.user {
  margin: 10px 0;
}
</style>
