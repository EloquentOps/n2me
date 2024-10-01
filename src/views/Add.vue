<template>
  <div class="add">   
        <div class="row btn-group" v-if="!session">
          <div class="button" v-for="category in categories" :key="category">
            <div class="button-opz">
              <button @click="startSessionBy(category, mainInputDevice)">{{ category.name }}</button>
              <button @click="startSessionBy(category, mainInputDevice === 'text' ? 'voice' : 'text')">{{ mainInputDevice === 'text' ? 'V' : 'T' }}</button>
            </div>
          </div>
        </div>

        <div class="row" v-if="session==='progress'">
          <button @click="stopSession()">Stop</button>
        </div>

        <div class="row" v-if="session==='review'">
          <button @click="session=null">x</button>
          <textarea v-model="text"></textarea>
          <button @click="saveSession()">Save</button>
        </div>
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

    this.mainInputDevice = this.settings.find(s => s.key === 'main_input_device')?.value || 'text'
  },
  data() {
    return {
      settings: [],
      categories: [],
      sessions: [],

      mainInputDevice: '',

      session: null,
      category: null,
      text: null,

      openAIKey: '',
      baseOpenAI: import.meta.env.VITE_APP_OPENAI_BASE_URL
    }
  },
  methods: {

    startSessionBy(category, device) {
     if(this.mainInputDevice === device){
      this.startTextSession(category)
     }else{
      this.startAudioSession(category)
     }
    },



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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.btn-group{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  max-width: 400px;
}
.btn-group .button{
  width: 100%;
}
.row {
  padding: 1rem;
  text-align: center;
  width: 100%;
  
}
</style>

