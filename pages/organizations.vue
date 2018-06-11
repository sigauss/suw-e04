<template>
  <section class="container">
    <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Choose
    </h1>
    <h2>OAOO</h2>
  </section>
</template>

<script>
import axios from "~/plugins/axios";
import logoutMixin from '~/mixins/logoutMixin'

export default {
  async asyncData () {
  },
  head () {
    return {
      title: "Users"
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init(){
      return axios.get(`/api/github/organizations/${this.$store.getters.access_token}`)
      .then((res) => {
        console.log(res.body);
      })
      .catch((error) => {
        console.log(error.response)
        this.logoutMixin()
      })
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
