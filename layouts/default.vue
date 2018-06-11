<template>
  <div class="container">
    <sidebar v-if="$route.path.includes('repos/')"/>
    <nuxt/>
    <!-- <my-footer/> -->
  </div>
</template>

<script>
import Sidebar from '~/components/sidebar/Sidebar.vue'

export default {
  components: {
    Sidebar
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log(this.$route)
    }
  }
}
</script>

<style>
.container
{
  display: flex;
  flex-direction: row;
  margin: 0;
  width: 100%;
  /* padding: 100px 0; */
  /* text-align: center; */
}

.button, .button:visited
{
  display: inline-block;
  color: black;
  letter-spacing: 1px;
  background-color: #fff;
  border: 2px solid #000;
  text-decoration: none;
  text-transform: uppercase;
  padding: 15px 45px;
}

.button:hover, .button:focus
{
  color: #fff;
  background-color: #000;
}

.title
{
  color: #000;
  font-weight: 300;
  font-size: 2.5em;
  margin: 0;
}
</style>
