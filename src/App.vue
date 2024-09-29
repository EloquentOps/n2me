<template>
  <Header />
  <RouterView />
</template>

<script>
import Header from './components/Header.vue'
import { init } from './db'

export default {
  components: {
    Header
  },
  async created() {
    await init()
  }
}
</script>

