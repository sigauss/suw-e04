<template>
  <div class="container">
    <sidebar v-if="$route.path.includes('repos/') || $route.path.includes('component/')"/>
    <nuxt/>
    <category-modal :visible="categoryModalOpen"/>
    <!-- <my-footer/> -->
  </div>
</template>

<script>
import Sidebar from "~/components/sidebar/Sidebar.vue";
import CategoryModal from "~/components/CategoryModal.vue";

export default {
  components: {
    Sidebar,
    CategoryModal
  },
  data() {
    return {
      categoryModalOpen: false,
      keys: {37: 1, 38: 1, 39: 1, 40: 1}
    }
  },
  created() {
    let categoryModal = this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'SET_CATEGORYMODALSTATE') {
          if (this.$store.getters.category_modal_state === false){
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
  },
  methods: {
    init() {

    },
    preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault)
          e.preventDefault();
      e.returnValue = false;  
    },
    disableScroll() {
      console.log('disabling');
      if (process.browser) {
        console.log(window)
        window.onwheel = this.preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
        window.ontouchmove  = this.preventDefault; // mobile
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
.container {
  display: flex;
  position: relative;
  flex-direction: row;
  margin: 0;
  width: 100%;
  /* padding: 100px 0; */
  /* text-align: center; */
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
