<template>
  <iframe
    ref="iframe"
    :src="url"
    frameborder="0"
    scrolling="auto"
    style="width: 100%; height: 1000px;"
    @load="handleLoad"
  />
</template>

<script>
export default {
  data() {
    return {
      url: 'https://weekly.tw93.fun/'
      // url: 'http://localhost:5173/#/'
    }
  }
  // mounted() {
  //   this.$refs.iframe.onload = () => {
  //     if (this.$refs.iframe) {
  //       console.log('iframe 加载完成', this.$refs.iframe)
  //     } else {
  //       console.log('iframe 加载失败')
  //     }
  //   }
  // }
}
</script>

