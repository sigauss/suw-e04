<template>
  <section class="container">
    <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Login success
    </h1>
    <h2>Veuillez patienter le temps de l'authentification</h2>
  </section>
</template>

<script>
import axios from "~/plugins/axios";
import logoutMixin from '~/mixins/logoutMixin'

export default {
    mixins: [logoutMixin],
    data() {
      return { 
        access_token: '',
      }
    },
    components: {
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        return axios.get(`/api/auth/${this.$route.query.code}`)
        .then((res) => {
            this.access_token = JSON.parse(res.data).access_token
            this.$store.dispatch('setAccessToken', this.access_token)
            return axios.get(`/api/github/user/${this.access_token}`)
            .then((res) => {
                this.username = JSON.parse(res.data).login
                this.avatar = JSON.parse(res.data).avatar_url
                this.github_id = JSON.parse(res.data).id
                // TODO add email to store
                this.$store.dispatch('setUserInformations', JSON.parse(res.data));
                return axios.get(`/api/github/email/${this.access_token}`)
                .then((res) => {
                  return axios.post('/api/users', {
                    username: this.username,
                    access_token: this.access_token,
                    avatar: this.avatar,
                    email: res.data,
                    github_id: this.github_id
                  })
                  .then((res) => {
                    this.$store.commit('SET_USER', 'logged')
                    this.$nuxt.$router.replace({ path: '/repos' })
                  })
                })
                .catch((error) => {
                  console.log(error.response)
                })
            });
        })
        .catch((e) => {
          this.logoutMixin()
        })
        .catch(e => {
          this.logoutMixin()
        });
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
