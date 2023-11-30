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

    <transition v-if="isLocked ==='true' && !isLogin" name="slide-up">
      <Lockscreen />
    </transition>
  </div>
</template>

<script>
import Loading from './components/Loading/index'
import Lockscreen from './components/Lockscreen/index.vue'
// import { setInterval, clearInterval } from 'timers'
import { getLocked, setLocked, getLockTime, setLockTime } from '@/utils/auth'

export default {
  name: 'App',
  components: {
    Loading,
    Lockscreen
  },
  data() {
    return {
      isLocked: getLocked(),
      LockTime: getLockTime(),
      isLogin: false,
      timer: 0,
      cookieTimer: 0
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.loading.isLoading
    }
  },
  watch: {
    isLock: {
      handler: function(newVal, oldVal) {
        console.log('监听锁屏变化')
        if (this.isLock) {
          window.removeEventListener('mousemove', this.mousemove)
          localStorage.setItem('isLock', 'isLock')
        } else {
          localStorage.removeItem('isLock')
          if (this.islogon) {
            window.addEventListener('mousemove', this.mousemove)
          }
        }
      },
      immediate: false
    }
  },

  // 模块初始化时打开定时器
  mounted() {
    console.log('App.vue mounted', this.isLoading, typeof this.isLoading)
    this.cookieChange()
    // 设置定时器
    this.timer = setInterval(() => {
      // 获取锁屏状态
      this.isLocked = getLocked()
      // 获取锁屏时间
      this.lockTime = getLockTime()
    }, 1000)
    this.isLogin = window.location.href.includes('/login')
    if (this.isLogin) {
      console.log('登录页')
      // 设置不锁屏
      setLocked(false)
      // 重置锁屏时间
      setLockTime(0)
    } else {
      if (!this.isLock) {
        // 设置锁屏时间
        setLockTime(10)
        this.timer = setInterval(() => {
          if (this.lockTime > 0) {
          // 锁屏倒计时递减
            setLockTime(getLockTime() - 1)
          } else {
          // 设置锁屏
            setLocked(true)
          }
        }, 1000)
      }
    }
  },
  // 销毁前清除定时器
  beforeDestroy() {
    console.log('销毁前清除定时器')
    clearInterval(this.cookieTimer)
    // clearInterval(this.timer)
  },
  methods: {
  // 监听isLocked的变化
    cookieChange() {
      this.cookieTimer = setInterval(() => {
        const currentIsLocked = getLocked()
        if (currentIsLocked !== this.isLocked) {
          this.isLocked = currentIsLocked
        }
      }, 1000) // 每秒检查一次cookie的变化
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
