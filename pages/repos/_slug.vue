<template>
  <section class="container">
    <h1 class="title">
      SINGLE REPO PAGE
    </h1>
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
    let { data } = await axios.get(
      "https://api.github.com/repos/cytronn/" +
        store.route.params.slug +
        "/contents/?access_token=" +
        store.store.getters.access_token
    );
    console.log(data);
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
    init() {
      console.log(this.$store.getters.access_token);
    }
  }
};
</script> 