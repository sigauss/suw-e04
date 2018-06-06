<template>
  <section class="container">
    <h1 class="title">
      new repo created
    </h1>
  </section>
</template>

<script>
import axios from "~/plugins/axios";

export default {
  async asyncData(store) {
    axios({
      method: "post",
      url:
        "https://api.github.com/user/repos?access_token=" +
        store.store.getters.access_token,
      data: {
        name: "testaccioapi"
      },
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
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
