<template>
    <div class="container">
        <h1>Categories</h1>
        <ul class="categories">
            <li class="category" v-for="category in categories" :key="category.id">
                {{ category.name }}
                <button v-if="category.id !== 1" @click="deleteCategory(category.id)">x</button>
            </li>
        </ul>
        <input type="text" v-model="newCategory" @keyup.enter="addCategory" placeholder="New Category" />
        <button @click="addCategory">Add Category</button>
    </div>
</template>

<script>
    import { getCategories, addCategory, deleteCategory } from '../db'

    export default {
        data() {
            return {
                categories: [],
                newCategory: ''
            }
        },  
        async mounted() {
            this.categories = await getCategories()
        },
        methods: {
            async addCategory() {
                if (this.newCategory.trim() === '') return
                try {
                    await addCategory(this.newCategory)
                    this.categories = await getCategories()
                    this.newCategory = ''
                } catch (error) {
                    console.error(error)
                }
            },
            async deleteCategory(id) {
                try {
                    await deleteCategory(id)
                    this.categories = await getCategories()
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }
</script>