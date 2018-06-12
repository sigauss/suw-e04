<template>
    <div v-if="$store.getters.category_modal_state" class="category__modalLayout">
        <div class="category__modal">
            <h3 class="category__modalTitle">Create a new category</h3>
            <div class="category__modalLabelContainer">
                <label class="category__modalLabel" for="">Component name</label>
                <input type="text" class="category__modalInput" v-on:keyup.stop="updateField($event.target.value)">
            </div>
            <div class="category__modalButtonContainer">
                <div @click="closeModal" class="category__modalCancelButton">Cancel</div>
                <div @click="createCategory" class="category__modalSubmitButton">Create</div>
            </div>
            <div class="category__modalMessage">{{ creationMessage }}</div>
        </div>
    </div>
</template>
<script>
    import axios from "~/plugins/axios";
    import logoutMixin from '~/mixins/logoutMixin';
    export default {
        props: [
            'visible',
        ],
        mixins: [logoutMixin],
        data() {
            return {
                isOpen: false,
                creationMessage: null,
                categoryName: null,
            }
        },
        methods: {
            closeModal() {
                this.$store.dispatch('setCategoryModalState', !this.$store.getters.category_modal_state);
            },
            updateField(value){
                this.categoryName = value;
            },
            createCategory() {
                this.creationMessage = 'Your category is being created..'
                return axios
                    .put(
                        `https://api.github.com/repos/${
                            this.$store.getters.active_repo.owner
                        }/${
                            this.$store.getters.active_repo.name
                        }/contents/${this.categoryName}/README.md?access_token=${
                            this.$store.getters.access_token
                        }`,
                        {
                            message: `:octopus: Accio :tophat: • ${Date.now()}`,
                            content: btoa("<h1>Hello</h1>Congratulations you just created your category of component")
                        }
                    )
                    .then(res => {
                        setTimeout(() => {
                            axios.get(
                                "https://api.github.com/repos/" +
                                this.$store.getters.active_repo.owner +
                                "/" +
                                this.$store.getters.slug +
                                "/contents/?access_token=" +
                                this.$store.getters.access_token
                            )
                            .then(res => {
                                this.$store.dispatch('setActiveRepoCategories', res.data);
                                console.log(this.$store.getters.active_repo_categories);
                                this.closeModal();
                            })
                            .catch(e => {
                                this.logoutMixin()
                            })                            
                        }, 5000);
                    })
                    .catch(e => {
                        console.log(e);
                        this.logoutMixin()
                    });
            }
        }
    }
</script>
<style scoped>
    .category__modalLayout{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 301px;
        width: calc(100% - 301px);
        height: 100vh;
        background-color: rgba(0,0,0,0.15);
    }
    .category__modal{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 600px;
        height: 360px;
        background-color: #fff;
    }
    .category__modalTitle{
        margin-top: 70px;
        font-size: 21px;
        color: #122F4D;
    }
    .category__modalLabelContainer{
        width: 80%;
    }
    .category__modalLabel{
        font-size: 12px;
        margin-top: 20px;
    }
    .category__modalInput{
        width: 100%;
        height: 40px;
        margin-top: 10px;
        border: 1px solid #C4CDD5;
        background-color: #F5F6FA;
        border: none;
    }
    .category__modalButtonContainer{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 60%;
        min-width: 300px;
        margin-top: 30px;
    }
    .category__modalCancelButton{
        margin-top: 17px;
        padding: 14px 60px;
        box-sizing: border-box;
        border-radius: 2px;
        border: 2px solid #574BEB;
        cursor: pointer;
    }
    .category__modalSubmitButton{
        margin-top: 17px;
        padding: 14px 60px;
        box-sizing: border-box;
        border-radius: 2px;
        color: white;
        background-color: #574BEB;
        cursor: pointer;
    }
</style>
