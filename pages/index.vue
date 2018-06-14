<template>
  <section class="container">
    <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      HOME
    </h1>
  </section>
</template>

<script>

export default {
  asyncData({ fillStore }) {
    return {
      fillStore
    }
  },
  fetch ({ store, redirect }) {
    // if (store.state.authUser == 'logged') {
      // uncomment if we went to redirect directly from landing
      return redirect('/login')
    // }
  }
}
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