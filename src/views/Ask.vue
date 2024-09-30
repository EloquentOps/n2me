<template>
    <div class="ask">
        <input type="text" v-model="question" @keyup.enter="ask" placeholder="Ask a question">
        <button @click="ask" :disabled="isLoading">Ask</button>
        <a href="" @click.prevent="deleteHistory">Delete previous answers</a>
        <div class="answer">
            <p v-if="isLoading">Loading...</p>
            <div v-else v-html="answer"></div>
        </div>
    </div>
</template>

<script>
import { getLLMPayload } from '../llms'
import { getSettings, getItems } from '../db'
import axios from 'axios'
import { marked } from 'marked'
export default {
    data() {
        return {
            question: '',
            llm_provider: '',
            api_key: '',
            answer: '',
            isLoading: false,
            history: [],
            items: []
        }
    },
    async mounted() {
        const settings = await getSettings()
        this.llm_provider = settings.find(s => s.key === 'llm_provider')?.value
        this.api_key = settings.find(s => s.key === 'llm_api_key')?.value

        this.items = await getItems()
    },
    methods: {
        async ask() {
            this.isLoading = true
            const { payload, url } = getLLMPayload({
                vendor: this.llm_provider, 
                question: this.question, 
                history: this.history,
                items: this.items
            })

            const res = await axios(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.api_key}`
                },
                data: payload
            })

            const { data } = res
            const { choices } = data
            const { message } = choices[0]
            const { content } = message

            this.answer = marked.parse(content)
            this.history.push({question: this.question, answer: content})
            this.question = ''
            this.isLoading = false
        },

        async deleteHistory() {
            this.history = []
        }
    }
}
</script>