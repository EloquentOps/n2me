<template>
    <div class="container">
        <h1>Settings</h1>

        <div class="settings-section">
            <h2>Language</h2>
            <select @change="updateLanguage" v-model="language">
                <option value="en-US">English (US)</option>
                <option value="es-ES">Spanish (ES)</option>
                <option value="it-IT">Italian (IT)</option>
            </select>
        </div>

        <div class="settings-section">
            <h2>Import</h2>
            <input type="file" @change="importData" accept="text/csv">
        </div>

        <div class="settings-section">
            <h2>LLM Provider</h2>
            <select v-model="llmProvider">
                <option value="">none</option>
                <option value="openai">OpenAI</option>
            </select>
            <input type="text" v-model="apiKey" placeholder="API Key">
            <button @click="updateLLMProvider">Update</button>
        </div>
    </div>
</template>


<script>
import { getSettings, editSetting } from '../db'

export default {
    data() {
        return {
            language: '',
            llmProvider: '',
            apiKey: ''
        }
    }, 
    async mounted() {
        const settings = await getSettings()
        this.language = settings.find(s => s.key === 'lang').value
    },
    methods: {
        async updateLanguage() {
            console.log(this.language)
            await editSetting('lang', this.language, 'general')
        },
        async importData(e) {
            const file = e.target.files[0]
            console.log(file)
        },
        async updateLLMProvider() {
            console.log(this.llmProvider)
            console.log(this.apiKey)

            await editSetting('llm_provider', this.llmProvider, 'general')
            await editSetting('llm_api_key', this.apiKey, 'general')
            
        }
    }
}
</script>