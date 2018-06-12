<template>
    <div class="sidebar">
        <div class="sidebar__header">
            <div class="sidebar__logoContainer">
                <img class="sidebar__logo" src="~assets/img/accio_logo_mini.png" alt="">
            </div>
        </div>
        <h1 v-if="repo" class="sidebar__repoName">{{repo.name}}</h1>
        <div v-if="categories !== null" class="sidebar__count">Categories folders <span class="sidebar__categoriesCount">{{ categories.length }}</span></div>
        <div class="sidebar__categoriesContainer">
            <div v-if="categories !== null" v-for="(category, name) in categories" :key="name">
                <div class="sidebar__categoryButton" v-bind:class="{'sidebar__categoryButton--active': category.name == $store.getters.active_category}" @click="toggleActiveCategory(category.name)">
                    <span><i v-bind:class="{'fa-folder': category.name !== $store.getters.active_category,'fa-folder-open': category.name === $store.getters.active_category}" class="fa fa-inverse"></i></span>
                    <!-- <i v-if="category.name == $store.getters.active_category" class="fa fa-folder-open-o"></i> -->
                    <span class="sidebar__categoryName">{{ category.name }}</span>
                </div>
                <!-- <sidebar-chapter :chapter="category"/> -->
                <!-- </router-link> -->
            </div>
        </div>
        <!-- <new-category></new-category> -->
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
            categories: null,
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
                this.categories = this.$store.getters.active_repo_categories;
            }
        });
    },
    mounted() {
        this.init();
    }, 
    methods: {
        init() {
            // console.log(this.$store.getters.active_repo.name);
        },
        toggleActiveCategory(cat) {
            this.$store.dispatch('setActiveCategory', cat);
            return axios.post('/api/update-session-active-category',{
                activeCategory: cat,
            })
            .then(res => {
              // console.log(res.data)
              this.$nuxt.$router.replace({path: `/repos/${this.$store.getters.active_repo.name}/${cat}`})
            })           
        }
    }
}
</script>
<style scoped>
.sidebar{
    width: 25%;
    max-width: 336px;
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
    width: 140px;
}
.sidebar__repoName{
    font-size: 16px;
    margin-top: 40px;
    width: 100%;
    padding-bottom: 50px;
    border-bottom: 1px solid grey;
    padding-left: 30px;
    box-sizing: border-box;
    display: inline-block;
}
.sidebar__count{
    margin-left: 30px;
    text-transform: uppercase;
}
.sidebar__categoriesCount{
    display: inline-block;
    margin-left: 30px;
    padding: 5px 10px;
    background-color: #fff;
    color: #8A8CA2;
}
.sidebar__categoriesContainer{
    margin-top: 25px;
    height: 70vh;
    width: 100%;
    overflow: scroll;
}
.sidebar__categoryButton{
    cursor: pointer;
    padding: 20px 0px 20px 30px;
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

.fa{
    color: black;
}
</style>