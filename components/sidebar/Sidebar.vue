<template>
    <div class="sidebar">
        <div class="sidebar__header">
          <div class="sidebar__logoContainer">
            <img class="sidebar__logo" src="~assets/img/accio_logo_mini.png" alt="">
          </div>
        </div>
        <div class="sidebar__repoNameContainer">
          <router-link to="/repos"><div class="sidebar__backToRepos"></div></router-link>
          <h1 v-if="repo" class="sidebar__repoName">{{repo.name}}</h1>
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
import NewCategory from '~/components/sidebar/NewCategory';
import SidebarChapter from '~/components/sidebar/SidebarChapter';
import axios from "~/plugins/axios";

export default {
    components: {
        SidebarChapter
    },
    data() {
        return {
            repo: null,
            categories: [],
        }
    },
    created() {
        let repo = this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'SET_ACTIVEREPO') {
                this.repo = this.$store.getters.active_repo;
            }
        });
        let categories = this.$store.subscribe((mutation, state) => {
          if (mutation.type === 'SET_ACTIVEREPOCATEGORIES') {
            this.categories = this.$store.getters.active_repo_categories.filter(repo => repo.type == 'dir');
          }
        });
    },
    mounted() {
        this.init();
    }, 
    methods: {
        init() {
            console.log(this.$store.getters)
            if (!this.$store.getters.active_repo_categories) {
                if (this.$store.state.authUser != 'logged') {
                return redirect('/login')
                }
                console.log(this.$route)
                if(this.$route.name === 'repos-category'){
                  this.$store.dispatch('setSlug', this.$route.params.category)
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
                      console.log(repo.name, repoOwner)
                      this.$store.dispatch("setActiveRepo", {
                        name: repo.name,
                        owner: repoOwner
                      });
                    }
                  });
                  axios.get(
                    "https://api.github.com/repos/" +
                    this.$store.getters.active_repo.owner +
                    "/" +
                    this.$store.getters.active_repo.name +
                    "/contents/?access_token=" +
                    this.$store.getters.access_token
                  )
                  .then(res => {
                    this.$store.dispatch('setActiveRepoCategories', res.data);
                  });
                });
            }
        },
        toggleActiveCategory(cat){
          this.$store.dispatch('setActiveCategory', cat);
          return axios.post('/api/update-session-active-category',{
            activeCategory: cat,
          })
          .then(res => {
            this.$nuxt.$router.replace({path: `/repos/${this.$store.getters.active_repo.name}/${cat}`})
          })           
        },
        openCategoryModal(){
            this.$store.dispatch('setCategoryModalState', !this.$store.getters.category_modal_state);
        }
    }
}
</script>
<style scoped>
.sidebar{
  position: fixed;
  min-width: 301px;
  height: 100vh;
  background-color: #F5F6FA;
}
.sidebar__logoContainer{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.sidebar__logo{
  margin-top: 40px;
  width: 70px;
}

.sidebar__repoNameContainer{
  padding: 50px 0;
  margin-top: 30px;
  padding-left: 30px;
  border-bottom: 1px solid grey;
  border-top: 1px solid grey;
  padding-left: 30px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.sidebar__repoName{
  position: relative;
  font-size: 16px;    
  width: 100%;
  margin-left: 20px;
  color: #574BEB;
  display: inline-block;
}
.sidebar__backToRepos{
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 7.5px 13.0px 7.5px 0;
  border-color: transparent #574BEB transparent transparent;
}
.sidebar__count{
    margin-left: 30px;
}
.sidebar__categoriesCount{
    display: inline-block;
    margin-left: 150px;
    padding: 5px 10px;
    background-color: #574BEB;
    color: #fff;
}
.sidebar__categoriesContainer{
    margin-top: 25px;
    height: 40vh;
    width: 100%;
    overflow: scroll;
}
.sidebar__categoryButton{
    cursor: pointer;
    padding: 20px 0px 20px 32px;
    /* display: flex;
    justify-content: space-between; */
}
.sidebar__categoryButton--active{
    background-color: #fff;
}
.sidebar__categoryName{
    display: inline-block;
    margin-left: 40px;
    font-size: 14px;
}
.sidebar__newCategory{
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
    color: #574BEB;
    cursor: pointer;
    background-color: #FFFFFF;
}
.sidebar__newCategoryText{
    display: inline-block;
    margin-left: 10px;
}
.fa{
    color: black;
}

::-webkit-scrollbar{
  -webkit-appearance: none;
  width: 5px;
}

::-webkit-scrollbar-thumb{
  background-color: #E3E7EE;
}
</style>