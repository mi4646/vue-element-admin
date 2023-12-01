<template>
  <div
    :class="{ onLockLogin: showLogin }"
    class="lockscreen"
    @keyup="onLockLogin(true)"
    @mousedown.stop
    @contextmenu.prevent
  >
    <template v-if="!showLogin">
      <div class="lock-box">
        <div class="lock">
          <span class="lock-icon" title="解锁屏幕" @click="onLockLogin(true)">
            <!-- 锁屏图标 -->
            <i
              class="icon iconfont sub-el-icon icon-suopingpingbao"
              style="font-size: 35px;margin-right: 25px;"
            />
          </span>
        </div>
      </div>
      <!--充电-->
      <recharge
        :battery="battery"
        :battery-status="batteryStatus"
        :calc-discharging-time="calcDischargingTime"
        :calc-charging-time="calcChargingTime"
      />

      <div class="local-time">
        <div class="time">{{ hour }}:{{ minute }}</div>
        <div class="date">{{ month }}月{{ day }}号，星期{{ week }}</div>
      </div>
      <div class="computer-status">
        <span :class="onlineClass" class="network">
          <i
            class="icon iconfont sub-el-icon icon-wifi network"
            style="font-size: 35px"
          />
        </span>
        <i
          class="icon iconfont sub-el-icon icon-api"
          style="font-size: 35px"
        />
      </div>
    </template>

    <!--登录-->
    <template v-if="showLogin">
      <div class="login-box">
        <div class="demo-basic--circle">
          <div class="block">
            <el-avatar
              v-if="avatar"
              shape="square"
              :size="128"
              :src="avatar"
            />
            <el-avatar v-else :size="128" shape="square">
              <img src="@/assets/images/default-avatar.svg">
            </el-avatar>
          </div>

        </div>
        <div v-if="loginParams.username" class="username">{{ loginParams.username }}</div>
        <el-input
          v-else
          v-model="loginParams.username"
          type="text"
          autofocus
          placeholder="请输入登录用户名"
          @keyup.enter="onLogin"
        />
        <el-input
          v-model="loginParams.password"
          type="password"
          autofocus
          placeholder="请输入登录密码"
          @keyup.enter="onLogin"
        />
        <div v-if="isLoginError" class="flex w-full">
          <span class="text-red-500">{{ errorMsg }}</span>
        </div>

        <div class="flex justify-around w-full mt-1">
          <el-button type="text" @click="showLogin = false">返回</el-button>
          <el-button type="text" @click="goLogin">重新登录</el-button>
          <el-button type="text" @click="onLogin">进入系统</el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script >
import recharge from './Recharge.vue'
import { useTime } from '@/utils/userTime.js'
import { useBattery } from '@/utils/useBattery.js'

export default {
  name: 'ScreenLock',
  components: {
    recharge
  },
  data() {
    return {
      name: '',
      email: '',
      avatar: '',
      onLine: false,
      // 获取时间
      month: '',
      day: '',
      hour: '',
      minute: '',
      second: '',
      week: '',
      battery: {},
      batteryStatus: '',
      calcDischargingTime: '',
      calcChargingTime: '',
      showLogin: false,
      errorMsg: '',
      loginLoading: false, // 正在登录
      isLoginError: false, // 密码错误
      loginParams: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    onlineClass() {
      return !this.online ? '' : 'offline'
    }
  },

  mounted() {
    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)

    const timeData = useTime()
    this.month = timeData.month
    this.day = timeData.day
    this.hour = timeData.hour
    this.minute = timeData.minute
    this.second = timeData.second
    this.week = timeData.week

    const batteryData = useBattery()
    this.battery = batteryData.state
    this.batteryStatus = batteryData.batteryStatus
    this.calcDischargingTime = batteryData.calcDischargingTime
    this.calcChargingTime = batteryData.calcChargingTime
  },
  beforeDestroy() {
    window.removeEventListener('online', this.updateOnlineStatus)
    window.removeEventListener('offline', this.updateOnlineStatus)
  },
  created() {
    this.avatar = this.$store.state.user.avatar
    this.loginParams.username = this.$store.state.user.username
  },
  methods: {
    updateOnlineStatus() {
      this.onLine = window.navigator.onLine // 更新onLine属性的值
    },
    // 解锁登录
    onLockLogin(value) {
      this.showLogin = value
    },
    // 进入系统
    onLogin() {
      if (!this.loginParams.password.trim() && !this.loginParams.username.trim()) {
        this.isLoginError = true
        this.errorMsg = '用户名和密码不能为空'
      }

      this.loginLoading = true
      this.$store.dispatch('user/login', this.loginParams).then(() => {
        this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        this.onLockChange()
        this.onLockLogin(false)
      }).catch(error => {
        this.isLoginError = true
        this.errorMsg = '登录失败，请重试'
        console.log(error)
      }).finally(() => {
        this.loginLoading = false
      })
    },
    // 重新登录
    goLogin() {
      // 确认删除后执行的逻辑
      this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.onLockChange()
      this.onLockLogin(false)
    },
    // 修改锁屏状态
    onLockChange() {
      this.$store.dispatch('screenLock/setLock', false)
      this.$store.dispatch('screenLock/setLockTime', 0)
    }
  }

}
</script>

<style lang="less" scoped>
  .lockscreen {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    background: #000;
    color: white;
    overflow: hidden;
    z-index: 9999;

    &.onLockLogin {
      background: #34373C;
      backdrop-filter: blur(7px);
    }

    .login-box {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      > * {
        margin-bottom: 14px;
      }

      .username {
        font-size: 30px;
      }
    }

    .lock-box {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 34px;
      z-index: 100;

      .tips {
        color: white;
        cursor: text;
      }

      .lock {
        display: flex;
        justify-content: center;

        .lock-icon {
          cursor: pointer;

          .anticon-unlock {
            display: none;
          }

          &:hover .anticon-unlock {
            display: initial;
          }

          &:hover .anticon-lock {
            display: none;
          }
        }
      }
    }

    .local-time {
      position: absolute;
      bottom: 60px;
      left: 60px;
      font-family: helvetica;

      .time {
        font-size: 70px;
      }

      .date {
        font-size: 40px;
      }
    }

    .computer-status {
      position: absolute;
      bottom: 60px;
      right: 60px;
      font-size: 24px;

      > * {
        margin-left: 14px;
      }

      .network {
        position: relative;

        &.offline::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 2px;
          height: 28px;
          transform: translate(-50%, -50%) rotate(45deg);
          background-color: red;
          z-index: 10;
        }
      }
    }
  }
</style>
