<template>
  <div>
    <iframe
      ref="myIframe"
      frameborder="0"
      scrolling="auto"
      :title="11111"
      src="http://localhost:5173/#/"
      style="width: 100%; height: 1000px;"
      @error="handleError"
    />
  </div>
</template>
<script>
export default {
  methods: {
    handleError(event) {
      console.log('加载异常', event.target.src)
    }
  }
}
</script>

