<template>
  <section class="container">
    <h1 class="title">
      SINGLE REPO PAGE
    </h1>
    <form ref="form" name="createFile"  @submit.prevent="createFile">
      <input type="text" name="fileName" />
      <button type="submit">Create file</button>
    </form>
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
    githubAction(fileName) {
      return axios
        .put(
          `https://api.github.com/repos/${
            this.$store.getters.active_repo.owner
          }/${
            this.$store.getters.active_repo.name
          }/contents/${fileName}?access_token=${
            this.$store.getters.access_token
          }`,
          {
            message: "accio-commit",
            content: btoa("<h1>comment tu vas</h1>")
          }
        )
        .then(res => {
          store.store.dispatch("setUserRepos", res.data);
          return { repos: res.data };
        });
      x;
    },
    createFile() {
      this.githubAction(this.$refs.form.fileName.value);
    }
  }
};
</script> 