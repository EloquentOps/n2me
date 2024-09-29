<template>
    <div class="ask">
        <h1>Ask</h1>
        <input type="text" v-model="question" placeholder="Ask a question">
        <button @click="ask">Ask</button>
    </div>
</template>

<script>
//import { askQuestion } from '../db'

export default {
    data() {
        return {
            question: ''
        }
    },
    methods: {
        async ask() {
            // const answer = await askQuestion(this.question)
            // console.log(answer)
        }
    }
}
</script>