<template>
  <section class="container">
    <h1 class="title">
      REPOS LIST
    </h1>
    <h2>{{ $store.getters.access_token }}</h2>
    <ul class="repos">
      <li v-for="(repo, index) in repos" :key="index" class="repos">
        <nuxt-link :to="{ name: 'id', params: { id: index }}">
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
    let { data } = await axios.get(
      "https://api.github.com/repositories?since=900"
    );
    return { repos: data };
  },
  head() {
    return {
      title: "Repos"
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log(this.$store.getters.access_token)
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
