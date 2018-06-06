<template>
  <section class="container">
    <h1 class="title">
      CREATE REPO
    </h1>
    <a @click="createRepo" href="#">Create</a>
  </section>
</template>

<script>
import axios from "~/plugins/axios";

const token = "b7ca31bece98e7e48b3831e4f29e89372e1ff81a";

function createRepo() {
  axios.post("https://api.github.com/user/repos?name='testtt'");
}

export default {
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
