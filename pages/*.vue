<template>
   <div class="page_404"></div> 
</template>

<script>
export default {
  asyncData ({ redirect }) {
    return redirect('/login');
  }
}
</script>