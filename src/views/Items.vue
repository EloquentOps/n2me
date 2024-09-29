<template>
    <div>
        <h1>Items</h1>
        <ul>
            <li v-for="item in items" :key="item.id">
                <span>{{ item.content }} [{{ item.category_name }}] <button @click="deleteItem(item.id)">x</button></span>
            </li>
        </ul>
    </div>
</template>

<script>
import { getItems, deleteItem } from '../db'

export default {
    data() {
        return {
            items: []
        }
    },
    async mounted() {
        this.items = await getItems()
        console.log(this.items)
    },
    methods: {
        async deleteItem(id) {
            await deleteItem(id)
            this.items = await getItems()
        }
    }
}
</script>