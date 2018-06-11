import axios from "~/plugins/axios";

const logoutMixin = {
  methods: {
    logoutMixin: function () {
      console.log('hello from mixin!')
      axios.get('/api/logout')
      .then (res => {
        this.$store.dispatch("setAccessToken", null)
        this.$store.dispatch("setUserInformations", null)
        this.$store.dispatch("setUserRepos", null)
        this.$store.dispatch("setActiveRepo", null)
        this.$store.dispatch("setActiveCategory", null)
        this.$store.dispatch("setSlug", null)
        this.$store.dispatch("setComponentContent", null)
        this.$store.dispatch("setUserAuth", null)
        return this.$nuxt.$router.replace({ path: '/login' })
      })
    }
  }
}

export default logoutMixin