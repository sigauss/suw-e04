<template>
  <section class="container">
    <h1 class="title">
      REPOS LIST
    </h1>
    <nuxt-link to="/repos/create">
      Create repo
    </nuxt-link>
    <ul class="repos">
      <li v-for="(repo) in repos" :key="repo.name" class="repos">
        <nuxt-link :to="{ name: 'name', params: { name: name }}">
          {{ repo.name }}
        </nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script>
import axios from "~/plugins/axios";

export default {
  async asyncData() {
    // this.$store.getters.accessToken get accesstoken
    console.log(this);
    let { data } = await axios.get(
      "https://api.github.com/user/repos?access_token=d70fd7b0123e01cbff71dd7cffe51809eabba827"
    );
    return { repos: data };
  },
  head() {
    return {
      title: "Repos"
    };
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
