<template>
    <div class="sidebar">
        <div class="sidebar__header">
          <div class="sidebar__logoContainer">
            <img class="sidebar__logo" src="~assets/img/accio_logo.png" alt="">
          </div>
        </div>
        <div class="sidebar__repoNameContainer">
          <h1 v-if="repo" class="sidebar__repoName">{{repo.name}}</h1>
          <router-link to="/repos"><i class="fa fa-caret-left"></i>Back to repos</router-link>
        </div>
        <div @click="openCategoryModal" class="sidebar__newCategory"><span>+</span><span class="sidebar__newCategoryText">New category</span></div>
        <div v-if="categories !== null" class="sidebar__count">Folders <span class="sidebar__categoriesCount">{{ categories.length }}</span></div>
        <div class="sidebar__categoriesContainer">
          <div v-if="categories !== null" v-for="(category, name) in categories" :key="name">
            <template v-if="category.name !== 'README.md'">
              <div class="sidebar__categoryButton" v-bind:class="{'sidebar__categoryButton--active': category.name == $store.getters.active_category}" @click="toggleActiveCategory(category.name)">
                <span><i v-bind:class="{'fa-folder': category.name !== $store.getters.active_category,'fa-folder-open': category.name === $store.getters.active_category}" class="fa fa-inverse"></i></span>                        
                <span class="sidebar__categoryName">{{ category.name }}</span>
              </div>
            </template>
          </div>
        </div>        
    </div>
</template>
<script>
import NewCategory from "~/components/sidebar/NewCategory";
import SidebarChapter from "~/components/sidebar/SidebarChapter";
import axios from "~/plugins/axios";

export default {
  components: {
    SidebarChapter
  },
  data() {
    return {
      repo: null,
      categories: []
    };
  },
  created() {
    let repo = this.$store.subscribe((mutation, state) => {
      if (mutation.type === "SET_ACTIVEREPO") {
        this.repo = this.$store.getters.active_repo;
      }
    });
    let categories = this.$store.subscribe((mutation, state) => {
      if (mutation.type === "SET_ACTIVEREPOCATEGORIES") {
        this.categories = this.$store.getters.active_repo_categories.filter(
          repo => repo.type == "dir"
        );
      }
    });
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log(this.$store.getters);
      if (!this.$store.getters.active_repo_categories) {
        if (this.$store.state.authUser != "logged") {
          return redirect("/login");
        }
        console.log(this.$route);
        if (this.$route.name === "repos-category") {
          this.$store.dispatch("setSlug", this.$route.params.category);
        }
        // if(this.$route.name === 'component-slug'){
        //     this.$store.dispatch('setSlug', this.$route.params.category)
        // }
        let repoOwner;
        axios
          .get(
            "https://api.github.com/user/repos?access_token=" +
              this.$store.getters.access_token
          )
          .then(res => {
            this.$store.dispatch("setUserRepos", res.data);
            res.data.forEach(repo => {
              if (repo.name === this.$store.getters.slug) {
                repoOwner = repo.owner.login;
                console.log(repo.name, repoOwner);
                this.$store.dispatch("setActiveRepo", {
                  name: repo.name,
                  owner: repoOwner
                });
              }
            });
            axios
              .get(
                "https://api.github.com/repos/" +
                  this.$store.getters.active_repo.owner +
                  "/" +
                  this.$store.getters.active_repo.name +
                  "/contents/?access_token=" +
                  this.$store.getters.access_token
              )
              .then(res => {
                this.$store.dispatch("setActiveRepoCategories", res.data);
              });
          });
      }
    },
    toggleActiveCategory(cat) {
      this.$store.dispatch("setActiveCategory", cat);
      return axios
        .post("/api/update-session-active-category", {
          activeCategory: cat
        })
        .then(res => {
          this.$nuxt.$router.replace({
            path: `/repos/${this.$store.getters.active_repo.name}/${cat}`
          });
        });
    },
    openCategoryModal() {
      this.$store.dispatch(
        "setCategoryModalState",
        !this.$store.getters.category_modal_state
      );
    }
  }
};
</script>
<style scoped>
.sidebar {
  position: fixed;
  min-width: 301px;
  height: 100vh;
  background-color: #f5f6fa;
}
.sidebar__logoContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.sidebar__logo {
  margin-top: 40px;
  width: 130px;
}

.sidebar__repoNameContainer {
  padding: 50px 0;
  margin-top: 30px;
  padding-left: 30px;
  border-bottom: 1px solid #e7e7e7;
  border-top: 1px solid #e7e7e7;
  padding-left: 30px;
  box-sizing: border-box;
}
.sidebar__repoNameContainer i {
  padding-right: 10px;
}
.sidebar__repoNameContainer a {
  padding-left: 10px;
  text-decoration: none;
}
.sidebar__repoNameContainer a:hover {
  text-decoration: underline;
}

.sidebar__repoName {
  position: relative;
  font-size: 16px;
  width: 100%;
  margin-left: 10px;
  color: #574beb;
  display: inline-block;
}
.sidebar__count {
  margin-left: 30px;
}
.sidebar__categoriesCount {
  display: inline-block;
  margin-left: 150px;
  padding: 5px 10px;
  background-color: #574beb;
  color: #fff;
}
.sidebar__categoriesContainer {
  margin-top: 25px;
  height: 40vh;
  width: 100%;
  overflow: scroll;
}
.sidebar__categoryButton {
  cursor: pointer;
  padding: 20px 0px 20px 32px;
}
.sidebar__categoryButton--active {
  background-color: #fff;
}
.sidebar__categoryName {
  display: inline-block;
  margin-left: 40px;
  font-size: 14px;
}
.sidebar__newCategory {
  width: 80%;
  height: 50px;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 17px 47px;
  box-sizing: border-box;
  color: #574beb;
  cursor: pointer;
  background-color: #ffffff;
}
.sidebar__newCategoryText {
  display: inline-block;
  margin-left: 10px;
}
.fa {
  color: black;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: #e3e7ee;
}
</style>