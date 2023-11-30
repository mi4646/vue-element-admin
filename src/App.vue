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

    <transition v-if="isLock && !isLogin" name="slide-up">
      <Lockscreen />
    </transition>
  </div>
</template>

<script>
import Lockscreen from './components/Lockscreen/index.vue'
import Loading from './components/Loading/index'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  name: 'App',
  components: {
    Loading,
    Lockscreen
  },
  data() {
    return {
      isLogin: false
    }
  },
  computed: {
    ...mapGetters([
      'isLock',
      'lockTime'
    ]),
    isLoading() {
      return this.$store.state.loading.isLoading
    }
  },
  watch: {
    isLock: {
      handler: function(newVal, oldVal) {
        console.log('监听锁屏变化', this.isLock)
        if (this.isLock) {
          window.removeEventListener('mousemove', this.mousemove)
          localStorage.setItem('isLock', 'isLock')
        } else {
          localStorage.removeItem('isLock')
          if (!this.isLogin) {
            window.addEventListener('mousemove', this.mousemove)
          }
        }
      },
      immediate: false
    }
  },
  created() {
    // 判断是否是登录页
    this.isLogin = window.location.href.includes('/login')
    console.log('isLogin', this.isLogin, typeof this.isLogin)

    if (localStorage.getItem('isLock') === 'isLock') {
      // 刷新时（非首次进入），如果是锁屏状态，则继续显示锁屏页面
      if (sessionStorage.getItem('initialized') === 'initialized') {
        this.setIsLock(true)
      } else {
        localStorage.removeItem('isLock')
      }
    }
  },
  methods: {
    ...mapActions({
      setIsLock: 'screenLock/setLock'
    }),
    mousemove() {
      _.throttle(() => {
        this.setIsLock(false)
      }, 1000 * 60, {
        leading: true,
        trailing: false
      })
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
