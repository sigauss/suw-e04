<template>
  <section class="container">
    <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Login
    </h1>
    <h2>wesh c'est le callback ici!!!!!!</h2>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

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
            this.access_token = JSON.parse(res.data).access_token;
            console.log(JSON.parse(res.data))
            console.log(this.access_token);
        })
        .catch((e) => {
            // error({ statusCode: 404, message: 'User not found' })
        })
      },
    },
  }
</script>

<style scoped>
.title
{
  margin: 30px 0;
}
.users
{
  list-style: none;
  margin: 0;
  padding: 0;
}
.user
{
  margin: 10px 0;
}
</style>
