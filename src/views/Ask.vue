<template>
    <div class="ask">
        <h1>Ask</h1>
        <input type="text" v-model="question" placeholder="Ask a question">
        <button @click="ask">Ask</button>
    </div>
</template>

<script>
import { getLLMPayload } from '../llms'
import { getSettings } from '../db'
import axios from 'axios'

export default {
    data() {
        return {
            question: '',
            llm_provider: '',
            api_key: ''
        }
    },
    async mounted() {
        const settings = await getSettings()
        this.llm_provider = settings.find(s => s.key === 'llm_provider')?.value
        this.api_key = settings.find(s => s.key === 'llm_api_key')?.value
    },
    methods: {
        async ask() {
            const { payload, url } = getLLMPayload({vendor: this.llm_provider, question: this.question})

            const res = await axios(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.api_key}`
                },
                data: payload
            })
        }
    }
}
</script>