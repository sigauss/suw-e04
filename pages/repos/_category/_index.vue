<template>
  <section class="components">
    <h1 class="components__categorytitle">{{ $store.getters.active_category }}</h1>
    <div class="components__componentsCount">{{ $store.getters.components.length }} {{$store.getters.components.length > 1 ? 'components' : 'component'}} </div>
    <form ref="form" name="createComponent"  @submit.prevent="createComponent">
      <input type="text" name="componentName" />
      <button type="submit">Create component</button>
    </form>
    <div class="components__componentsContainer">
      <div v-for="(component, name) in $store.getters.components" :key="name" class="components__componentCard">
        <template v-if="component.component.type === 'dir'">
          <router-link class="components__componentLink" :to="`/component/${component.component.name}`">
            <span><i class="fa fa-folder-o"></i>{{ component.component.name }}</span>
            <p><i class="fa fa-clock"></i>{{ component.content.pricing }}€</p>
            <p v-if="component.content.difficulty === '1'"><i class="fa fa-tachometer-alt"></i>Low</p>
            <p v-if="component.content.difficulty === '2'"><i class="fa fa-tachometer-alt"></i>Easy</p>
            <p v-if="component.content.difficulty === '3'"><i class="fa fa-tachometer-alt"></i>Medium</p>
            <p v-if="component.content.difficulty === '4'"><i class="fa fa-tachometer-alt"></i>Hard</p>
            <p v-if="component.content.difficulty === '5'"><i class="fa fa-tachometer-alt"></i>Insane</p>
          </router-link>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "~/plugins/axios";
import logoutMixin from '~/mixins/logoutMixin';

export default {
  data() {
    return {
        components: null,
    }
  },
  mixins: [logoutMixin],
  mounted() {
    this.init();
  },
  methods: {
    init() {

    if (this.$store.getters.components.length > 0){
      this.$store.dispatch('deleteComponents');
    }
    let categoryName = null;

    return axios
      .get(
        "https://api.github.com/repos/" +
          this.$store.getters.active_repo.owner +
          "/" +
          this.$store.getters.active_repo.name +
          "/contents/" +
          this.$store.getters.active_category +
          "?access_token=" +
          this.$store.getters.access_token
      )
      .then(res => {
        res.data.forEach(function(component) {
          // this is to not make a query on the readme file
          if (component.name.indexOf("README")) {
            return axios
              .get(
                `https://api.github.com/repos/${
                this.$store.getters.active_repo.owner
                }/${this.$store.getters.active_repo.name}/contents/${
                  this.$store.getters.active_category
                }/${component.name}/config.json?access_token=${
                  this.$store.getters.access_token
                }`
              )
              .then(response => {
                var decodeContent = atob(response.data.content);
                let content = JSON.parse(decodeContent);
                this.components += {component: component, content: content};
                this.$store.dispatch("setComponentContent", {component: component, content: content});
              })
              .catch(e => {
                console.log(e)
              });
          }
        }, this);
      })
      .catch(e => {
        // this.logoutMixin()
      })
    },
    githubAction(componentName) {
      const configJson = {
        devTime: "days: 3, hours: 2",
        pricing: "350",
        difficulty: "2",
        description: "lorem ipsum dolor sit amet",
        tags: ["slider", "animation", "responsive"]
      };
      return axios
        .put(
          `https://api.github.com/repos/${
            this.$store.getters.active_repo.owner
          }/${this.$store.getters.active_repo.name}/contents/${
            this.$route.params.index
          }/${componentName}/index.js?access_token=${
            this.$store.getters.access_token
          }`,
          {
            message: `:octopus: Accio :tophat: • ${Date.now()}`,
            content: btoa("console.log('hello wolrd')")
          }
        )
        .then(res => {
          axios.put(
            `https://api.github.com/repos/${
              this.$store.getters.active_repo.owner
            }/${this.$store.getters.active_repo.name}/contents/${
              this.$route.params.index
            }/${componentName}/config.json?access_token=${
              this.$store.getters.access_token
            }`,
            {
              message: `:octopus: Accio :tophat: • ${Date.now()}`,
              content: btoa(JSON.stringify(configJson))
            }
          );
        })
        .catch(e => {
          // this.logoutMixin()
        })
      ;
    },
    createComponent() {
      this.githubAction(this.$refs.form.componentName.value);
    }
  },
  fetch ({ store, redirect, params }) {
    if (store.state.authUser != 'logged') {
      return redirect('/login')
    }
  }
};
</script>

<style scoped>
  .components {
    display: flex;
    width: 75%;
    padding: 0px 30px;
    box-sizing: border-box;
    flex-direction: column;
  }
  .components__componentsContainer{
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
  }
  .components__componentCard{
    width: 232px;
    padding: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    box-sizing: border-box;
    background-color: #F5F6FA;
  }
  .components__componentCard:hover{
    transition: all 0.2s ease-in;
    -webkit-box-shadow: 10px 10px 12px -8px rgba(0,0,0,0.36);
    -moz-box-shadow: 10px 10px 12px -8px rgba(0,0,0,0.36);
    box-shadow: 10px 10px 12px -8px rgba(0,0,0,0.36);
  }
  .components__componentLink{
    text-decoration: none;
  }
</style>