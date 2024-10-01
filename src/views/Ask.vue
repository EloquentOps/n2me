<template>
    <div class="ask">

        <div class="ask-body">
            <div v-html="answer"></div>
        </div>

        <div class="ask-prompt">
            <input type="text" v-model="question" @keyup.enter="ask" placeholder="Ask a question">
            <button @click="ask" :disabled="isLoading">Ask</button>            
        </div>
        <a href="" @click.prevent="deleteHistory" v-if="history.length > 0">Delete previous answers</a>
        
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
            llm_model: '',
            api_key: '',
            answer: '',
            isLoading: false,
            history: [],
            items: [],
            references: []
        }
    },
    async mounted() {
        const settings = await getSettings()

        this.llm_provider = settings.find(s => s.key === 'llm_provider')?.value
        this.llm_model = settings.find(s => s.key === 'llm_model')?.value
        this.api_key = settings.find(s => s.key === 'llm_api_key')?.value

        this.items = await getItems()
    },
    methods: {
        async ask() {
            this.isLoading = true
            const { payload, url } = getLLMPayload({
                vendor: this.llm_provider, 
                model: this.llm_model,
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

            const { markdown, references } = JSON.parse(content)
            this.answer = marked.parse(markdown)
            this.references = references

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



<style scoped>
.ask {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.ask-prompt {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: .5rem;
}

.ask-prompt input {
    flex:1;
}


.ask-body {
    flex: 1;
    width: 100%;
}

</style>