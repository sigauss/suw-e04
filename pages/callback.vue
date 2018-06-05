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
    asyncData ({ params, error }) {
    return axios.get('/api/fetch_auth_token/' + this.$route.query.code)
      .then((res) => {
        return { user: res.data }
      })
      .catch((e) => {
        // error({ statusCode: 404, message: 'User not found' })
      })
  },
    data() {
      return { 
        idCode: this.$route.query.code,        
      }
    },
    components: {
    },
    mounted() {
      this.init();
    },
    methods: {

      init() {
        console.log(this.idCode);
        // axios.post('https://github.com/login/oauth/access_token', {
        //     headers: {
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Expose-Headers': '*',
        //     'Content-Type': 'application/json',
        //     'Accept': 'application/x-www-form-urlencoded',
        //     },
        //     params: {
        //     client_id: '6512280b0626a7722d81',
        //     client_secret: '71182dca741cb055c14ef5b3705a1f14627e294c',
        //     code: this.idCode,
        //     }
        // },
        // )
        // .then(function (response) {
        //     console.log('hariba');
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
        var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://github.com/login/oauth/access_token?client_id=6512280b0626a7722d81&client_secret=71182dca741cb055c14ef5b3705a1f14627e294c&code=f04d7e409cdae663c95d");
xhr.setRequestHeader("cache-control", "no-cache");
xhr.setRequestHeader("postman-token", "eae30cd0-5612-dc13-b7dd-6076b77fdb17");

xhr.send(data);
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
