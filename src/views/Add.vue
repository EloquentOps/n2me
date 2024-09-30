<template>

        <div class="row" v-if="!session">
          <div class="button" v-for="category in categories" :key="category">
            <button @click="startTextSession(category)">TXT {{ category.name }}</button>
            <button @click="startAudioSession(category)">AUX {{ category.name }}</button>
          </div>
        </div>

        <div class="row" v-if="session==='progress'">
          <button @click="stopSession()">Stop</button>
        </div>

        <div class="row" v-if="session==='review'">
          <textarea v-model="text"></textarea>
          <button @click="saveSession()">Save</button>
        </div>

</template>




<script>
import axios from 'axios'
import { buildSpeecher, startSpeecher, stopSpeecher } from '../speecher'
import { addItem, getCategories, getSettings } from '../db'

export default {
  async mounted() {
    this.categories = await getCategories()
    this.settings = await getSettings()

    this.sessions = JSON.parse(localStorage.getItem('n2me:sessions')) || []

    const lang = this.settings.find(s => s.key === 'lang').value
    buildSpeecher({lang})
  },
  data() {
    return {
      settings: [],
      categories: [],
      sessions: [],

      session: null,
      category: null,
      text: null,

      openAIKey: '',
      baseOpenAI: import.meta.env.VITE_APP_OPENAI_BASE_URL
    }
  },
  methods: {
    startTextSession(category) {
      this.session = 'review'
      this.category = category
    },
    startAudioSession(category) {
      this.session = 'progress'
      this.category = category

      startSpeecher()
    },
    stopSession() {
      this.session = 'review'
      const messages = stopSpeecher()
      this.text = messages.join(' ')
    },
    saveSession() {
      addItem(this.text, this.category.id)
      this.session = null
      this.text = null
    }
  }
}
</script>


<style scoped>
.add {
  width: 100%;
}


.row {
  padding: 1rem;
  text-align: center;
}
</style>

