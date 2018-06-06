<template>
  <section class="container">
    <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Login
    </h1>
    <h2>OAOO</h2>
    <a href="https://github.com/login/oauth/authorize?scope=user,repo,repo:invite,&client_id=6512280b0626a7722d81">Click here to begin!</a>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  async asyncData () {
  },
  head () {
    return {
      title: 'Users'
    }
  }
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
