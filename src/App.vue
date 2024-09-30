<template>
  <Header />

  <div class="container">
    <RouterView />
  </div>
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

<style scoped>
.container {
  flex: 1;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
</style>