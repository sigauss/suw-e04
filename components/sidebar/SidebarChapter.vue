<template>
    <!-- Example -->
    <div v-if="itemCategory !== null" class="sidebar-chapter">{{ itemCategory.name }}</div>
</template>
<script>
export default {
    props: [
        'chapter'
    ],
    data() {
        return {
            itemCategory: null,
        }
    },
    watch: {
        chapter: (val) => {
            console.log(val);
            this.itemCategory = val;
            // console.log(this.itemCategory.name)
        },
    },
    mounted(){
        this.init();
    },
    methods: {
        init() {
            // console.log(this.itemCategory);
        }
    }

}
</script>

