<template>
  <section class="container">
    <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Login
    </h1>
    <h2>coucou</h2>
  </section>
</template>

<script>
import axios from "~/plugins/axios";

export default {
  async asyncData () {
  },
  data () {
      return {
          files: null,
      }
  },
  head () {
    return {
      title: "Users"
    };
  },
  mounted () {
      this.init();
  },
  methods: {
    init() {
        console.log(this.$store)
        this.getComponentInformations()
    },
    getComponentInformations() {
        return axios.get(`/api/github/${this.$store.getters.active_repo.owner}/${this.$store.getters.active_repo.name}/${this.$store.getters.active_category}/${this.$route.params.slug}/component/${this.$store.getters.access_token}`)
        .then(res => {            
            this.files = JSON.parse(res.data);
            console.log(this.files)
            this.getComponentFilesContent();
        });
    },
    getComponentFilesContent() {
        for (let file in this.files) {
            console.log(this.files, file);
            axios.get(`/api/github/${this.$store.getters.active_repo.owner}/${this.$store.getters.active_repo.name}/${this.$store.getters.active_category}/${this.$route.params.slug}+${this.files[file].name}/component/${this.$store.getters.access_token}`)
            .then(res => {
                console.log(atob(JSON.parse(res.data).content));
            });
        }
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
