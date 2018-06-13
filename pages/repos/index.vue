<template>
  <section class="container">
      <!-- <button @click="logout">Logout</button> -->
    <div class="repos__logoContainer">
      <img class="repos__logo" src="~assets/img/accio_logo_fat.png">
      <div class="repos__logoCircle"></div>
    </div>
    <h1 class="repos__title">Hi ! Welcome to Accio</h1>
    <h2 class="repos__subtitle">To join, please select one of your accio workspaces.</h2>
    <form ref="form" name="createRepo"  @submit.prevent="submitRepo">
      <input type="text" name="repoName" />
      <button type="submit">Create</button>
    </form>
    <div class="repos__reposList">
      <div v-for="(repo, name) in repos" :key="name" class="repos__repoCard">
        <router-link :to="`/repos/${repo.name}`">
          <div class="repos__repoContent">
            <div class="repos__repoTextContainer">
              <div class="repos__repoName">{{ repo.name.substring(0, 10) + '...' }}</div>
              <div class="repos__repoPrivate">{{ repo.private === true ? "Private" : "Public" }}</div>
            </div>
            <div class="repos__repoPicContainer">
              <img class="repos__repoPic" :src="repo.owner.avatar_url">
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "~/plugins/axios";
import logoutMixin from '~/mixins/logoutMixin'

export default {
  data() {
    return { 
      repos: '',
    }
  },
  head() {
    return {
      title: "Repos"
    };
  },
  mounted() {
    this.init();
  },
  mixins: [logoutMixin],
  methods: {
    init() {
      axios
        .get(
          "https://api.github.com/user/repos?access_token=" +
            this.$store.getters.access_token
        )
        .then(res => {
          this.$store.dispatch("setUserRepos", res.data);
          this.repos = res.data
        })
        .catch(e => {
          this.logoutMixin()
        })
    },
    async logout() {
      axios.get('/api/logout')
      .then(res => {
        this.logoutMixin()
      })
      .catch(e => {
        console.log(e)
      })
    },
    submitRepo() {
      return axios({
        method: "post",
        url:
          "https://api.github.com/user/repos?access_token=" +
          this.$store.getters.access_token,
        data: {
          name: "Accio-" + this.$refs.form.repoName.value,
          private: false,
          auto_init: true,
        },
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res => {
        const repOwner = res.data.owner.login
        const repoName = res.data.name

        return axios
          .put(
            `https://api.github.com/repos/${
              repOwner
            }/${
              repoName
            }/contents/Buttons/README.md?access_token=${
              this.$store.getters.access_token
            }`,
            {
              message: `:octopus: Accio :tophat: • ${Date.now()}`,
              content: btoa(
                "<h1>Hello</h1>Congratulations you just created your category of component"
              )
            }
          )
          .then(res => {
            return axios
              .put(
                `https://api.github.com/repos/${
                  repOwner
                }/${
                  repoName
                }/contents/Buttons/Pulsing-Button/config.json?access_token=${
                  this.$store.getters.access_token
                }`,
                {
                  message: 'create sample component',
                  content: "ewogICJkZXZUaW1lIjogImRheXM6IDAsIGhvdXJzOiAwLjUiLAogICJwcmljaW5nIjogIk5DIiwKICAiZGlmZmljdWx0eSI6ICIxIiwKICAiZGVzY3JpcHRpb24iOiAiQSBuaWNlIHB1bHNpbmcgYnV0dG9uIGluIHB1cmUgY3NzIiwKICAidGFncyI6IFsKICBdCiAgfQ=="
                }
              )
              .then(res => {
              return axios
                .put(
                  `https://api.github.com/repos/${
                    repOwner
                  }/${
                    repoName
                  }/contents/Buttons/Pulsing-Button/index.html?access_token=${
                    this.$store.getters.access_token
                  }`,
                  {
                    message: 'index html',
                    content: "PCFET0NUWVBFIGh0bWw+CjxodG1sPgo8aGVhZD4KPHRpdGxlPjwvdGl0bGU+CjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgdHlwZT0idGV4dC9jc3MiIGhyZWY9InN0eWxlLmNzcyI+Cgo8L2hlYWQ+Cgo8Ym9keT4KICA8IS0tIENyZWRpdHMgdG8gVHlsZXIgQ2VjY2hpIG9uIGh0dHBzOi8vY29kZXBlbi5pby90aGNlY2NoaS9wZW4vcGdxd3piIC0tPgogIDxkaXYgY2xhc3M9ImNvbnRhaW5lciI+CiAgICA8YnV0dG9uIGlkPSJjb250YWluZXIiPgogICAgICA8ZGl2IGlkPSJjci1wdWxzZSI+CiAgICAgICAgPGEgaHJlZj0iIyI+KzwvYT4KICAgICAgPC9kaXY+CiAgICA8L2J1dHRvbj4KICA8L2Rpdj4KPC9ib2R5PgoKPC9odG1sPgo="
                  }
                )
                  .then(res => {
                  return axios
                    .put(
                      `https://api.github.com/repos/${
                        repOwner
                      }/${
                        repoName
                      }/contents/Buttons/Pulsing-Button/style.css?access_token=${
                        this.$store.getters.access_token
                      }`,
                      {
                        message: 'style',
                        content: "LmNvbnRhaW5lciB7CiAgd2lkdGg6IDEwMCU7CiAgZGlzcGxheTogYmxvY2s7CiAgbWFyZ2luLWxlZnQ6IDUwJTsKICBtYXJnaW4tdG9wOiA1JTsKfQoKI2NyLXB1bHNlIHsKICB6LWluZGV4OiAxOwogIGJvcmRlci1yYWRpdXM6IDEwMHB4OwogIGhlaWdodDogOThweDsKICB3aWR0aDogOThweDsKICBiYWNrZ3JvdW5kOiAjRjg5NDA2OwogIGJveC1zaGFkb3c6IDAgMXB4IDNweCByZ2JhKDAsMCwwLDAuMTIpLCAwIDFweCAycHggcmdiYSgwLDAsMCwwLjI0KTsKfQoKI2NvbnRhaW5lciB7CiAgcG9zaXRpb246IGFic29sdXRlOwogIGJvcmRlcjogMDsKICBiYWNrZ3JvdW5kOiBub25lOwogIG91dGxpbmU6IG5vbmU7CiAgCn0KIAoKI2NyLXB1bHNlOjphZnRlciB7CiAgei1pbmRleDogLTE7CiAgY29udGVudDogJyc7CiAgZGlzcGxheTogYmxvY2s7CiAgYm9yZGVyLXJhZGl1czogMTAwcHg7CiAgaGVpZ2h0OiAxMDBweDsKICB3aWR0aDogMTAwcHg7CiAgdG9wOiAwOwogIGJhY2tncm91bmQ6ICNFQjk1MzI7CiAgcG9zaXRpb246IGFic29sdXRlOwogIGFuaW1hdGlvbjogcHVsc2U7CiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAyczsKICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTsKICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDsKfQoKYSB7CiAgdGV4dC1kZWNvcmF0aW9uOiBub25lOwogIGRpc3BsYXk6IGJsb2NrOwogIGZvbnQtZmFtaWx5OiAnT3BlbiBTYW5zJzsKICBmb250LXNpemU6IDQ4cHg7CiAgZm9udC13ZWlnaHQ6IDEwMDsKICBjb2xvcjogI2YxZjFmMTsKICBtYXJnaW4tbGVmdDogYXV0bzsKICBtYXJnaW4tcmlnaHQ6IGF1dG87CiAgcG9zaXRpb246IHJlbGF0aXZlOwogIHRvcDogNTAlOwogIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTsKfQoKQGtleWZyYW1lcyBwdWxzZSB7CiAgMCV7dHJhbnNmb3JtOiBzY2FsZSgxKTsKICBvcGFjaXR5OiAxO30KICAxMDAle3RyYW5zZm9ybTogc2NhbGUoMS41KTsKICBvcGFjaXR5OiAwO30KfQ=="
                      }
                    )
                    .then(res => {
                      console.log('POST PREVIEW')
                      return axios
                        .put(
                          `https://api.github.com/repos/${
                            repOwner
                          }/${
                            repoName
                          }/contents/Buttons/Pulsing-Button/preview.png?access_token=${
                            this.$store.getters.access_token
                          }`,
                          {
                            message: 'preview',
                            content: process.env.img64
                          }
                        )
                        .then(res =>{
                          alert("repo created");
                        })
                        .catch(e =>{
                          console.log(e)
                        })
                    })
                    .catch(e =>{
                      console.log(e)
                    })
                })
              })
          })
          .catch(e => {
            console.log(e)
          })
      })
      .catch(e =>{
        
      })
    }
  },
  fetch ({ store, redirect }) {
    if (store.state.authUser != 'logged') {
      return redirect('/login')
    }
  }
};
</script> 

<style scoped>
.container{
  background-color: #F5F6FA;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding-bottom: 80px;
}
.repos__logoContainer{
  margin-top: 160px;
  position: relative;
  width: 130px;
  height: 130px;
}
.repos__logo{
  position: absolute;
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

.repos__title{
  margin-top: 70px;
  width: 280px;
  font-size: 31px;
  line-height: 39px;
  text-align: center;
}
.repos__subtitle{
  margin-top: 24px;
  font-size: 14px;
  line-height: 1.5;
}
.repos__reposList{
  display: flex;
  width: 700px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.repos__repoCard{
  width: 256px;
  padding: 23px 21px 32px 19px;
  margin-top: 20px;
  box-sizing: border-box;
  background-color: white;
}
.repos__repoPicContainer{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}
.repos__repoPic{
  width: 100%;
}

.repos__repoContent{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.repos__repoName{
  font-size: 21px;
  width: 70%;
}
.repos__repoPrivate{
  font-size: 11px;
  margin-top: 11px;
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
