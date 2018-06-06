<template>
  <section class="container">
    <h1 class="title">
      REPOS LIST
    </h1>
    <h2>{{ $store.getters.access_token }}</h2>
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

export default {
  async asyncData(store) {
    let { data } = await axios.get(
      "https://api.github.com/user/repos?access_token=" +
        store.store.getters.access_token
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
  methods: {
    init() {
      console.log(this.$store.getters.access_token);
    },
    submitRepo() {
      return axios({
        method: "post",
        url:
          "https://api.github.com/user/repos?access_token=" +
          this.$store.getters.access_token,
        data: {
          name: "Accio-" + this.$refs.form.repoName.value,
          private: true
        },
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res => {
        alert("repo created");
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
