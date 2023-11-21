<!-- <template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script> -->

<template>
  <div v-cloak id="app">
    <loading v-if="isLoading" />
    <router-view />
  </div>
</template>

<script>
import Loading from './components/Loading/index'
export default {
  name: 'App',
  components: {
    Loading
  },
  data() {
    return {}
  },
  computed: {
    isLoading() {
      return this.$store.state.loading.isLoading
    }
  },
  mounted() {
    this.path = this.$route.path
  }

}
</script>
<style lang="less">
#app {
  font-size: 17px;
  color: #6f6f6f;
}
</style>
