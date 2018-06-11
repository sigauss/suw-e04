<template>
  <section class="container">
    <h1 class="title">
      My component
    </h1>
    <div v-if="configFile !== null" class="meta__informations">
      <form ref="form" name="saveConfigFile"  @submit.prevent="saveConfigFile">
        <button @click.prevent="displayInputs">Edit</button>
        <h2>Description</h2>
        <input v-if="editMode" name="description" v-model="configFile.content.description"/>
        <p>{{ configFile.content.description }}</p>
        <h2>Difficulty:</h2>
        <input v-if="editMode" name="difficulty" v-model="configFile.content.difficulty"/>
        <p>{{ configFile.content.difficulty }}</p>
        <h2>Devtime:</h2>
        <input v-if="editMode" name="devTime" v-model="configFile.content.devTime"/>
        <p>{{ configFile.content.devTime }}</p>
        <h2>Price</h2>
        <input v-if="editMode" name="pricing" v-model="configFile.content.pricing"/>
        <p>{{ configFile.content.pricing }}</p>
        <h2>Tags:</h2>
        <ul class="tags">
          <input id="newTag" v-if="editMode" name="newTag" placeholder="enter a tag"/>
          <p v-on:click="addTag" v-if="editMode">Add</p>
          <li class="tag" v-for="(tag) in configFile.content.tags" :key="tag">
            {{tag}}
          </li>
        </ul>
        <button v-if="editMode" type="submit"> Save</button>
      </form>
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
      files: [],
      editMode: false,
      configValues: []
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
    displayInputs() {
      if (!this.editMode) {
        this.editMode = true;
      } else {
        this.editMode = false;
      }
    },
    addTag() {
      var newTag = document.querySelector("#newTag").value;
      var list = document.querySelector(".tags");
      var tag = document.createElement("li");

      tag.setAttribute("class", "tag");
      tag.appendChild(document.createTextNode(newTag));
      list.appendChild(tag);

      var tags = document.querySelectorAll(".tag");
      tags.forEach(tag => {
        this.configValues.push(tag.innerText);
      });
    },
    saveConfigFile() {
      let configJson = {
        devTime: this.$refs.form.devTime.value,
        pricing: this.$refs.form.pricing.value,
        difficulty: this.$refs.form.difficulty.value,
        description: this.$refs.form.description.value,
        tags: this.configValues
      };
      axios.put(
        `https://api.github.com/repos/${
          this.$store.getters.active_repo.owner
        }/${this.$store.getters.active_repo.name}/contents/${
          this.$store.getters.active_category
        }/${this.$route.params.slug}/config.json?access_token=${
          this.$store.getters.access_token
        }`,
        {
          message: `:octopus: Accio :tophat: • ${Date.now()}`,
          content: btoa(JSON.stringify(configJson)),
          sha: this.configFile.sha
        }
      );
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
.tags {
  padding: 0;
}
.tag {
  background: #dedede;
  padding: 10px;
  margin: 5px;
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
