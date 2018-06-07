<template>
  <section class="container">
    <h1 class="title">
      SINGLE REPO PAGE
    </h1>
    <button v-on:click="createFolder">Create category</button>
    <ul class="repos">
      <li v-for="(file, name) in contents" :key="name" class="repos">
        <nuxt-link to="/">
          <span v-if="file.type === 'dir'">Folder ->  </span>
          {{ file.name }}
        </nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script>
import axios from "~/plugins/axios";

export default {
  async asyncData(store) {
    let repoOwner = null;
    const repos = store.store.getters.user.repos;
    repos.forEach(repo => {
      if (repo.name === store.params.slug) {
        repoOwner = repo.owner.login;
        store.store.dispatch("setActiveRepo", {
          name: repo.name,
          owner: repoOwner
        });
      }
    });
    let { data } = await axios.get(
      "https://api.github.com/repos/" +
        repoOwner +
        "/" +
        store.params.slug +
        "/contents/?access_token=" +
        store.store.getters.access_token
    );
    return { contents: data };
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
    init() {},
    githubAction() {
      return axios
        .put(
          `https://api.github.com/repos/${
            this.$store.getters.active_repo.owner
          }/${
            this.$store.getters.active_repo.name
          }/contents/test/test.php?access_token=${
            this.$store.getters.access_token
          }`,
          {
            message: "accio-commit",
            content: btoa("<h1>Salut</h1>")
          }
        )
        .then(res => {
          store.store.dispatch("setUserRepos", res.data);
          return { repos: res.data };
        });
      x;
    },
    createFolder() {
      this.githubAction();
    }
  }
};
</script> 