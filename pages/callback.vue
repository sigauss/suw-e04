<template>
  <section class="container">
    <div class="repos__logoContainer">
      <img class="repos__logo" src="~assets/img/accio_logo_fat.gif">
      <div class="repos__logoCircle"></div>
    </div>
  </section>
</template>

<script>
import axios from "~/plugins/axios";
import logoutMixin from "~/mixins/logoutMixin";

export default {
  mixins: [logoutMixin],
  data() {
    return {
      access_token: ""
    };
  },
  components: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      return axios
        .get(`/api/auth/${this.$route.query.code}`)
        .then(res => {
          this.access_token = JSON.parse(res.data).access_token;
          this.$store.dispatch("setAccessToken", this.access_token);
          axios.post('/api/update-session-access-token',{
            access_token: this.access_token,
          })
          return axios
            .get(`/api/github/user/${this.access_token}`)
            .then(res => {
              this.username = JSON.parse(res.data).login;
              this.avatar = JSON.parse(res.data).avatar_url;
              this.github_id = JSON.parse(res.data).id;
              // TODO add email to store
              this.$store.dispatch("setUserInformations", JSON.parse(res.data));
              axios.post('/api/update-session-user-infos',{
                  userInfos: JSON.parse(res.data),
              })
              return axios
                .get(`/api/github/email/${this.access_token}`)
                .then(res => {
                  return axios
                    .post("/api/users", {
                      username: this.username,
                      access_token: this.access_token,
                      avatar: this.avatar,
                      email: res.data,
                      github_id: this.github_id
                    })
                    .then(res => {
                      this.$store.commit("SET_USER", "logged");
                      axios
                        .post('/api/update-session-logged', {})
                      this.$nuxt.$router.replace({ path: "/repos" });
                    });
                })
                .catch(error => {
                  console.log(error.response);
                });
            });
        })
        .catch(e => {
          this.logoutMixin();
        })
        .catch(e => {
          this.logoutMixin();
        });
    }
  }
};
</script>

<style scoped>
.container{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.repos__logoContainer{
  margin-top: 160px;
  position: relative;
  width: 130px;
  height: 130px;
}
.repos__logo{
  position: absolute;
  width: 130px;
  top: 50%;
  left: 50%;
  z-index: 10;
  transform: translate3d(-50%, -50%, 0);
}
.repos__logoCircle{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3D(-50%, -50%, 0);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid #C6D2D6;
  animation-name: circleFade;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}
.repos__logoCircle:before, .repos__logoCircle:after{
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3D(-50%, -50%, 0);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid #C6D2D6;
  animation-name: circleFade;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}

.repos__logoCircle:before{
  animation-delay: 0.3s;
}

.repos__logoCircle:after{
  animation-delay: 0.6s;
}

@keyframes circleFade {
  0% {
    width: 10px;
    height: 10px;
    opacity: 1;
  }
  70% {
    width: 224px;
    height: 224px;
    opacity: 0.7;
  }
  80% {
    width: 224px;
    height: 224px;
    opacity: 0;
  }
  100% {
    width: 10px;
    height: 10px;
    opacity: 0;
  }
}
</style>
