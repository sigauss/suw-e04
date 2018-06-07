<template>
  <section class="container">
    <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Login success
    </h1>
    <h2>wesh c'est le callback ici!!!!!!</h2>
   <nuxt-link to="/repos">repos</nuxt-link>
  </section>
</template>

<script>
import axios from "~/plugins/axios";

export default {
//     asyncData ({ params, error }) {
//     console.log(params);
//     return axios.get('/api/fetch_auth_token/' + this.$route.query.code)
//       .then((res) => {
//         return { user: res.data }
//       })
//       .catch((e) => {
//         // error({ statusCode: 404, message: 'User not found' })
//       })
//   },
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
                  });
                })
                .catch((error) => {
                  console.log(error.response)
                })
            });
        })
        .catch((e) => {
            // error({ statusCode: 404, message: 'User not found' })
        })
        .catch(e => {
          // error({ statusCode: 404, message: 'User not found' })
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
