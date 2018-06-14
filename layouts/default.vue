<template>
  <div class="container">
    <sidebar v-if="$route.path.includes('repos/') || $route.path.includes('component/')"/>
    <nav v-if="$route.path.includes('repos/') && $store.getters.active_category !== null">
      <div class="flex justify-between">
        <div class="search">
          <input v-on:keyup="searchComponents" autocomplete="off" placeholder="Search for a tags" type="text" name="search" id="searchbar">
          <div v-if="searchMode" class="result">
            <li v-if="resultsSearch" @click="setActiveComponent(component.name)" v-for="(component, name) in resultsSearch" :key="name" >
              <div class="flex justify-between">
                <div>
                  <i class="fa fa-folder-o icon"></i> {{component.name}}
                </div>
              </div>
            </li>
          </div>
        </div>
        <div class="user flex align-center">
          <div class="user-avatar">
            <img :src="$store.getters.user.informations.avatar_url"/>
          </div>
          <div class="user-infos">
            <span class="name">{{$store.getters.user.informations.name}}</span>
          </div>
          <div class="user-actions">
            <a v-on:click="logoutMixin()" class="logout"><i class="fa fa-sign-out"></i></a>
          </div>
        </div>
      </div>
    </nav>
    <nuxt/>
    <category-modal :visible="categoryModalOpen"/>
  </div>
</template>

<script>
import Sidebar from "~/components/sidebar/Sidebar.vue";
import CategoryModal from "~/components/CategoryModal.vue";
import logoutMixin from "~/mixins/logoutMixin";

export default {
  components: {
    Sidebar,
    CategoryModal
  },
  mixins: [logoutMixin],
  data() {
    return {
      categoryModalOpen: false,
      searchMode: false,
      resultsSearch: [],
      keys: { 37: 1, 38: 1, 39: 1, 40: 1 }
    };
  },
  created() {
    let categoryModal = this.$store.subscribe((mutation, state) => {
      if (mutation.type === "SET_CATEGORYMODALSTATE") {
        if (this.$store.getters.category_modal_state === false) {
          this.enableScroll();
        } else {
          this.disableScroll();
        }
        this.categoryModalOpen = this.$store.getters.category_modal_state;
      }
    });
  },
  mounted() {
    this.init();
    this.searchMode = false;
  },
  methods: {
    init() {
      this.searchMode = false;
    },
    preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    },
    isEmpty(str) {
      return !str.replace(/^\s+/g, "").length;
    },
    setActiveComponent(componentName) {
      this.searchMode = false;
      this.$store.dispatch("setActiveComponent", componentName);
      this.$nuxt.$router.replace({ path: `/component/${componentName}` });
    },
    searchComponents() {
      this.resultsSearch = [];
      this.searchMode = true;
      var components = this.$store.getters.components;
      var query = document.getElementById("searchbar").value;
      if (query.length === 0 || this.isEmpty(query)) {
        this.searchMode = false;
        return;
      }
      components.forEach(component => {
        if (
          component.component.name.toUpperCase().indexOf(query.toUpperCase()) >
          -1
        ) {
          this.resultsSearch.push(component.component);
        }
      });
    },
    disableScroll() {
      console.log("disabling");
      if (process.browser) {
        console.log(window);
        window.onwheel = this.preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
        window.ontouchmove = this.preventDefault; // mobile
      }
    },
    enableScroll() {
      if (process.browser) {
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
      }
    }
  }
};
</script>

<style>
nav {
  position: absolute;
  left: 331px;
  right: 30px;
  top: 25px;
  z-index: 9;
}
nav .search {
  width: 50%;
  position: relative;
}
nav .search input {
  width: 100%;
  border-radius: 3px;
  border: 1px solid #ccc9f9;
  padding: 10px;
  outline: none;
}
nav .search .result {
  background: white;
  position: absolute;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc9f9;
  border-top: none;
}
nav .search .result li {
  list-style-type: none;
  padding: 10px 0px;
  cursor: pointer;
  transition: all 0.2s ease;
}
nav .search .result li:hover {
  color: #574beb;
}
nav .search .result li:not(:first-child) {
  border-top: 1px solid #dedede;
}
nav .icon {
  color: #574beb;
}
nav .user-avatar {
  height: 42px;
  width: 42px;
}
nav .user-avatar img {
  width: 100%;
  border-radius: 50%;
}
nav .user-infos {
  margin-left: 20px;
}
nav .user-infos .name {
  color: #393571;
  font-size: 14px;
}
nav .user-actions a {
  background: #574beb;
  color: white;
  padding: 10px;
  border-radius: 3px;
  margin-left: 2rem;
  cursor: pointer;
}
@keyframes view-top {
  0% {
    opacity: 0;
    transform: translate(0, 100px);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.view-top {
  animation: view-top 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  animation-fill-mode: forwards;
}
.fade-in {
  animation: fade-in 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  animation-fill-mode: forwards;
}
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
.container {
  display: flex;
  position: relative;
  flex-direction: row;
  margin: 0;
  width: 100%;
}

.button,
.button:visited {
  display: inline-block;
  color: black;
  letter-spacing: 1px;
  background-color: #fff;
  border: 2px solid #000;
  text-decoration: none;
  text-transform: uppercase;
  padding: 15px 45px;
}

.button:hover,
.button:focus {
  color: #fff;
  background-color: #000;
}

.title {
  color: #000;
  font-weight: 300;
  font-size: 2.5em;
  margin: 0;
}
</style>
