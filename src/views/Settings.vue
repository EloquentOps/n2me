<template>
    <div>

        <div class="settings-section">
            <h2>Language (for speech recognition)</h2>
            <select @change="updateLanguage" v-model="language">
                <option value="en-US">English (US)</option>
                <option value="es-ES">Spanish (ES)</option>
                <option value="it-IT">Italian (IT)</option>
            </select>
        </div>


        <div class="settings-section">
            <h2>Main Input</h2>
            <select @change="updateMainInputDevice" v-model="mainInputDevice">
                <option value="text">Text</option>
                <option value="voice">Voice</option>
            </select>
        </div>


        <div class="settings-section">
            <h2>LLM Provider</h2>
            <div class="inline">
                <select v-model="llmProvider">
                <option value="">none</option>
                <option value="openai">OpenAI</option>
                </select>
                <select v-model="llmModel">
                    <option v-for="model in models[llmProvider]" :key="model" :value="model">{{ model }}</option>
                </select>
                <input type="text" v-model="apiKey" placeholder="API Key">
                <button @click="updateLLMProvider">Update LLM Provider</button>
            </div>
        </div>


        <div class="settings-section">
            <h2>Meta data</h2>
            <p><router-link to="/categories">Manage Categories</router-link></p>
            <p><router-link to="/items">Manage Items</router-link></p>
        </div>


        <div class="settings-section">
            <h2>Export Data</h2>
            <button @click="exportData">Export Data</button>
        </div>

        <div class="settings-section">
            <h2>Import Data</h2>
            <input type="file" @change="importData" accept="text/csv">
        </div>

        <div class="settings-section">
            <h2>Reset Data</h2>
            <button @click="resetDatabase">Reset Database</button>
        </div>
    </div>
</template>


<script>
import { getSettings, editSetting, importItems, getItems, deleteDatabase, closeDatabase } from '../db'
import { models } from '../llms'
import Papa from 'papaparse'

export default {
    data() {
        return {
            language: '',
            llmProvider: '',
            apiKey: '',
            mainInputDevice: '',
            llmModel: '',
            models: models
        }
    }, 
    async mounted() {
        const settings = await getSettings()
        this.language = settings.find(s => s.key === 'lang')?.value

        this.llmProvider = settings.find(s => s.key === 'llm_provider')?.value
        this.llmModel = settings.find(s => s.key === 'llm_model')?.value
        this.apiKey = settings.find(s => s.key === 'llm_api_key')?.value

        this.mainInputDevice = settings.find(s => s.key === 'main_input_device')?.value
    },
    methods: {
        async updateLanguage() {
            await editSetting('lang', this.language, 'general')
        },
        async updateMainInputDevice() {
            await editSetting('main_input_device', this.mainInputDevice, 'general')
        },
        async importData(e) {
            try {
                const file = e.target.files[0]
                const text = await file.text()
                const result = Papa.parse(text, { header: true })
                console.log(result)
                await importItems(result.data)
            } catch (error) {
                console.error(error)
            }
        },
        async updateLLMProvider() {
            await editSetting('llm_provider', this.llmProvider, 'llm')
            await editSetting('llm_api_key', this.apiKey, 'llm')
            await editSetting('llm_model', this.llmModel, 'llm')
        },
        async exportData() {
            const items = await getItems()
            const csv = Papa.unparse(items)
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'items.csv'
            a.click()
        },
        async resetDatabase() {
            await closeDatabase()
            await deleteDatabase()
            location.href = '/'
        }
    }
}
</script>


<style scoped>
.inline{
    display: flex;
    flex-direction: row;
    gap: .5rem;
}
</style>