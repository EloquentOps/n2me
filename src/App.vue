<template>
  <div class="container">

    <div class="row"> 
      <h1>n2me</h1>
    </div>

    <div class="row" v-if="!session">
      <div class="button" v-for="category in categories" :key="category">
        <button @click="startSession(category)">{{ category }}</button>
      </div>
    </div>

    <div class="row" v-if="session==='progress'">
      <button @click="stopSession()">Stop</button>
    </div>

    <div class="row" v-if="session==='review'">
      <textarea v-model="text"></textarea>
      <button @click="saveSession()">Save</button>
    </div>

  </div>
</template>




<script>
import axios from 'axios'
import { buildSpeecher, startSpeecher, stopSpeecher } from './speecher'

export default {
  mounted() {
    this.categories = JSON.parse(localStorage.getItem('n2me:categories')) || ['note']  
    this.sessions = JSON.parse(localStorage.getItem('n2me:sessions')) || []
    this.openAIKey = localStorage.getItem('n2me:openAIKey') || ''
    const lang = localStorage.getItem('n2me:language') || 'it-IT'
    buildSpeecher({lang})
  },
  data() {
    return {

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
    startSession(category) {
      console.log('startSession')
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
      this.sessions.push({
        date: new Date(),
        category: this.category,
        text: this.text
      })
      localStorage.setItem('n2me:sessions', JSON.stringify(this.sessions))

      this.session = null
    }
  }
}
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 2rem;
}


.row {
  padding: 1rem;
  text-align: center;
}
</style>