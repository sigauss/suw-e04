<template>
  <section class="container">
    <h1 class="title">
      SINGLE REPO PAGE
    </h1>
    <form ref="form" name="createCategory"  @submit.prevent="createCategory">
      <input type="text" name="categoryName" />
      <textarea name="readmeContent" placeholder="Your readme content"></textarea>
      <button type="submit">Create category</button>
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
    githubAction(categoryName, readmeContent) {
      return axios
        .put(
          `https://api.github.com/repos/${
            this.$store.getters.active_repo.owner
          }/${
            this.$store.getters.active_repo.name
          }/contents/${categoryName}/README.md?access_token=${
            this.$store.getters.access_token
          }`,
          {
            message: "accio-commit",
            content: btoa(readmeContent)
          }
        )
        .then(res => {
          store.store.dispatch("setUserRepos", res.data);
          return { repos: res.data };
        });
      x;
    },
    createCategory() {
      this.githubAction(
        this.$refs.form.categoryName.value,
        this.$refs.form.readmeContent.value
      );
    }
  }
};
</script> 