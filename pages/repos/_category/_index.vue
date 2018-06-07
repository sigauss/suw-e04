<template>
  <section class="container">
    <h1 class="title">
      List of all "{{categoryName}}"
    </h1>
    <ul class="repos">
      <li v-for="(file, name) in components" :key="name" class="repos">
        {{ file.name }}
      </li>
    </ul>
  </section>
</template>

<script>
import axios from "~/plugins/axios";

export default {
  async asyncData(store) {
    let categoryName = null;
    categoryName = store.params.index;
    let { data } = await axios.get(
      "https://api.github.com/repos/" +
        store.store.getters.active_repo.owner +
        "/" +
        store.store.getters.active_repo.name +
        "/contents/" +
        categoryName +
        "?access_token=" +
        store.store.getters.access_token
    );
    return {
      components: data,
      categoryName
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {}
  }
};
</script> 