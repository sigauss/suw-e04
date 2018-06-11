<template>
  <section class="container">
    <h1 class="title">
      My component
    </h1>
    <div v-if="configFile !== null" class="meta__informations">
      <h2>Description</h2>
      <p>{{ configFile.content.description }}</p>
      <h2>Dev time:</h2>
      <p>{{ configFile.content.devTime }}</p>
      <h2>Price</h2>
      <p>{{ configFile.content.pricing }}</p>
      <h2>Tags:</h2>
      <ul class="tags">
        <li v-for="(tag) in configFile.content.tags" :key="tag">
          {{tag}}
          </li>
        </ul>
    </div>
    <ul class="snippets">
      <li v-for="(file, name) in files" :key="name" class="repos">
        <span><b>{{file.name }}</b></span>
        <div v-if="file.content !== null" class="snippet-content">
          <pre>{{file.content}}</pre>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import axios from "~/plugins/axios";

export default {
  async asyncData() {},
  data() {
    return {
      configFile: null,
      files: []
    };
  },
  head() {
    return {
      title: "Component"
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.files = [];
      this.getComponentInformations();
    },
    getComponentInformations() {
      return axios
        .get(
          `/api/github/${this.$store.getters.active_repo.owner}/${
            this.$store.getters.active_repo.name
          }/${this.$store.getters.active_category}/${
            this.$route.params.slug
          }/component/${this.$store.getters.access_token}`
        )
        .then(res => {
          this.files = JSON.parse(res.data);
          this.getComponentFilesContent();
        });
    },
    getComponentFilesContent() {
      for (let file in this.files) {
        axios
          .get(
            `/api/github/${this.$store.getters.active_repo.owner}/${
              this.$store.getters.active_repo.name
            }/${this.$store.getters.active_category}/${
              this.$route.params.slug
            }+${this.files[file].name}/component/${
              this.$store.getters.access_token
            }`
          )
          .then(res => {
            if (JSON.parse(res.data).name === "config.json") {
              this.configFile = JSON.parse(res.data);
              this.configFile.content = JSON.parse(
                atob(this.configFile.content)
              );
            } else {
              this.files.forEach(file => {
                if (file.name === JSON.parse(res.data).name) {
                  file.content = atob(JSON.parse(res.data).content);
                }
              });
            }
          });
      }
    }
  }
};
</script>

<style scoped>
.tags li {
  display: inline;
}
ul {
  display: flex;
  justify-content: space-between;
}
li {
  list-style-type: none;
}
pre {
  text-align: left;
}
</style>
