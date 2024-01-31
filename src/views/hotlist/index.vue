<template>
  <iframe
    id="nestIframe"
    ref="iframe"
    :src="url"
    frameborder="0"
    scrolling="auto"
    class="content-iframe"
  />
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Iframe',
  data() {
    return {
      url: 'https://weekly.tw93.fun/'
      // url: 'http://localhost:5173/#/'
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar.opened
    })
  },
  // 监听侧栏状态变化
  watch: {
    'src.url'(newValue, oldValue) {
      setTimeout(() => {
        const iframe = this.$refs.iframe
        if (newValue !== undefined && newValue !== null && iframe !== undefined) {
          iframe.contentWindow.location.replace(newValue)
        }
      }, 50)
    },
    sidebar() {
      this.changeNestIframe()
    }
  },
  mounted() {
    this.changeNestIframe()
    window.onresize = function() { this.changeNestIframe() }
  },
  methods: {
    changeNestIframe() {
      /**
       * iframe-宽高自适应显示
      */
      const nestIframe = document.getElementById('nestIframe')
      const deviceWidth = document.body.clientWidth
      const deviceHeight = document.body.clientHeight

      // 判断侧栏状态是否展开
      const widthDiff = this.sidebar ? 200 : 0 // 数字是页面布局宽度差值
      nestIframe.style.width = Number(deviceWidth - widthDiff) + 'px'
      nestIframe.style.height = Number(deviceHeight) + 'px' // 数字是页面布局高度差

      // console.log('deviceWidth', Number(deviceWidth - widthDiff) + 'px')
      // console.log('deviceHeight', Number(deviceHeight) + 'px')
    }
  }
}

</script>

<style scoped>
.content-iframe {
  position:absolute;
  top:0px;
  left: 0px;
  right:0px;
  bottom:100px;
  width: 100%;
  height: 100%;
  min-height: 600px
}
</style>
