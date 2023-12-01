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

    <transition v-if="isLock === 'true' && !isLogin" name="slide-up">
      <Lockscreen />
    </transition>
  </div>
</template>

<script>
import Lockscreen from './components/Lockscreen/index.vue'
import Loading from './components/Loading/index'

export default {
  name: 'App',
  components: {
    Loading,
    Lockscreen
  },
  data() {
    return {
      isLogin: false,
      timer: null
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.loading.isLoading
    },
    isLock: {
      get() {
        return this.$store.state.screenLock.isLock
      },
      set(isLock) {
        this.$store.dispatch('screenLock/setLock', isLock)
      }
    },
    lockTime: {
      get() {
        return this.$store.state.screenLock.lockTime
      },
      set(lockTime) {
        this.$store.dispatch('screenLock/setLockTime', lockTime)
      }
    }

  },
  watch: {
    lockTime() {
      if (this.lockTime >= parseInt(process.env.VUE_APP_LOCK_TIME)) {
        this.isLock = 'true'
      } else {
        if (this.isLock !== 'false') {
          this.isLock = 'false'
        }
      }
    },
    isLock() {
      if (this.isLock === 'true') {
        this.removeHandle()
      } else {
        this.init()
      }
    }
  },

  created() {
    // 判断是否是登录页
    this.isLogin = window.location.href.includes('/login')
  },
  mounted() {
    console.log('锁屏时间', parseInt(process.env.VUE_APP_LOCK_TIME))
    if (this.isLock === 'true') { // 锁屏状态下 浏览器刷新后保持锁屏状态
      this.lockTime = parseInt(process.env.VUE_APP_LOCK_TIME)
    } else {
      this.init()
    }
  },
  destroyed() {
    this.removeHandle()
  },
  methods: {
    init() {
      console.log('是否是登录页', this.isLogin)
      if (!this.isLogin) {
        this.reckonByTime()
        document.addEventListener('click', this.clickHandle)
        document.addEventListener('dblclick', this.dblclickHandle)
        document.addEventListener('contextmenu', this.contextmenuHandle)
        document.addEventListener('mousemove', this.mousemoveHandle)
        document.addEventListener('mousewheel', this.mousewheelHandle)
        document.addEventListener('keydown', this.keydownHandle)
      }
    },
    // 移除事件监听、定时器等
    removeHandle() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      document.removeEventListener('click', this.clickHandle)
      document.removeEventListener('dblclick', this.dblclickHandle)
      document.removeEventListener('contextmenu', this.contextmenuHandle)
      document.removeEventListener('mousemove', this.mousemoveHandle)
      document.removeEventListener('mousewheel', this.mousewheelHandle)
      document.removeEventListener('keydown', this.keydownHandle)
    },
    // 无操作计时
    reckonByTime() {
      if (this.timer) {
        this.lockTime = 0
        clearInterval(this.timer)
        this.timer = null
      }
      this.timer = setInterval(() => {
        this.lockTime += 1
      }, 1000)
    },
    // 鼠标点击
    clickHandle() {
      this.reckonByTime()
    },
    // 鼠标双击
    dblclickHandle() {
      this.reckonByTime()
    },
    // 鼠标右键
    contextmenuHandle() {
      this.reckonByTime()
    },
    // 鼠标移动
    mousemoveHandle() {
      this.reckonByTime()
    },
    // 鼠标滚轮
    mousewheelHandle() {
      this.reckonByTime()
    },
    // 键盘按下
    keydownHandle(event) {
      const { altKey, ctrlKey, keyCode } = event
      if (altKey && ctrlKey && keyCode === 76) {
        // Ctrl + Alt + L 快捷键直接锁屏
        this.lockTime = parseInt(process.env.VUE_APP_LOCK_TIME)
      } else {
        this.reckonByTime()
      }
    }
  }

}
</script>
<style lang="less">
#app {
  font-size: 17px;
  color: #6f6f6f;
}
</style>
