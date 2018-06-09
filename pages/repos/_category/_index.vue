<template>
  <section class="container">
    <h1 class="title">
      List of all 
    </h1>
    <form ref="form" name="createComponent"  @submit.prevent="createComponent">
      <input type="text" name="componentName" />
      <button type="submit">Create component</button>
    </form>
    <ul class="repos">
      <li v-for="(component, name) in $store.getters.active_category" :key="name" class="repos">
         <span v-if="component.type === 'dir'"><i class="fa fa-folder-o"></i></span>
         <span v-else><i class="fa fa-file-o"></i></span>
         {{ component.name }}
         <p><i class="fa fa-clock"></i>{{component.content.devTime}}</p>
         <p><i class="fa fa-tachometer-alt"></i>{{component.content.difficulty}}</p>
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
    return axios
      .get(
        "https://api.github.com/repos/" +
          store.store.getters.active_repo.owner +
          "/" +
          store.store.getters.active_repo.name +
          "/contents/" +
          categoryName +
          "?access_token=" +
          store.store.getters.access_token
      )
      .then(res => {
        res.data.forEach(function(component) {
          // this is to not make a query on the readme file
          if (component.name.indexOf("README")) {
            axios
              .get(
                `https://api.github.com/repos/${
                  store.store.getters.active_repo.owner
                }/${store.store.getters.active_repo.name}/contents/${
                  store.params.index
                }/${component.name}/config.json?access_token=${
                  store.store.getters.access_token
                }`
              )
              .then(response => {
                var decodeContent = atob(response.data.content);
                component.content = JSON.parse(decodeContent);
              });
          }
        });
        store.store.dispatch("setActiveCategory", res.data);
      });
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
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
        });
      x;
    },
    createComponent() {
      this.githubAction(this.$refs.form.componentName.value);
    }
  },
  fetch ({ store, redirect }) {
    if (store.state.authUser != 'logged') {
      return redirect('/login')
    }
  }
};
</script> 