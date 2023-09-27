<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <!-- <SwitchDark class="dark" /> -->
      <div class="login-left">
        <img
          class="login-left-img"
          src="@/assets/images/login_left.png"
          alt="login"
        >
      </div>

      <div class="login-form">
        <div class="login-logo">
          <img
            class="login-icon"
            src="@/assets/images/logo.svg"
            alt=""
          >
          <h2 class="logo-text">Geeker-Admin</h2>
        </div>

        <el-form
          ref="ruleForm"
          status-icon
          :model="loginForm"
          :rules="rules"
          size="large"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="el-icon-user-solid"
              placeholder="用户名/邮箱/手机号"
              @keyup.enter.native="login"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              prefix-icon="iconfont el-icon-mymima"
              show-password
              placeholder="密码"
              @keyup.enter.native="login"
            />
          </el-form-item>
        </el-form>
        <div class="login-btn">
          <el-button
            round
            size="large"
            type="primary"
            @click="login"
          >
            登录
          </el-button>
          <el-button
            round
            size="large"
            @click="resetForm"
          > 注册 </el-button>
        </div>

        <div class="more">
          <div class="title-box">
            <p class="line" />
            <p class="title"> 其他方式登录</p>
            <p class="line" />
          </div>
          <div class="login-type">
            <img src="@/assets/images/login/ali-icon.png">
            <img src="@/assets/images/login/qq-icon.png">
            <img src="@/assets/images/login/google-icon.png">
            <img src="@/assets/images/login/weibo-icon.png">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFix } from '@/utils/index.js'
// import { generaMenu } from '@/assets/js/menu'

export default {
  data: function() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              // 延迟 1 秒显示欢迎信息
              setTimeout(() => {
                this.$notification.success({
                  message: '欢迎',
                  description: `${timeFix()}，欢迎回来`
                })
              }, 1000)
              return false
            })
            .catch(() => {
              return false
            })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$router.push({ path: '/register' }) // 切换到注册页面
    }
  }
}
</script>

<style scoped lang="scss">
  .login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    // height: 100%;
    min-height: 550px;
    background-color: #eeeeee;
    background-image: url('../../assets/images/login_bg.svg');
    background-size: 100% 100%;
    background-size: cover;

    .login-box {
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 96.5%;
      height: 94%;
      padding: 0 50px;
      background-color: rgb(255 255 255 / 80%);
      border-radius: 10px;

      .dark {
        position: absolute;
        top: 13px;
        right: 18px;
      }

      .login-left {
        width: 800px;
        margin-right: 10px;

        .login-left-img {
          width: 100%;
          height: 100%;
        }
      }

      .login-form {
        width: 420px;
        padding: 50px 40px 45px;
        background-color: var(--el-bg-color);
        border-radius: 10px;
        box-shadow: rgb(0 0 0 / 10%) 0 2px 10px 2px;

        .login-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 45px;

          .login-icon {
            width: 60px;
            height: 52px;
          }

          .logo-text {
            padding: 0 0 0 25px;
            margin: 0;
            font-size: 42px;
            font-weight: bold;
            color: #34495e;
            white-space: nowrap;
          }
        }

        .el-form-item {
          margin-bottom: 40px;
        }

        .login-btn {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 40px;
          white-space: nowrap;

          .el-button {
            width: 185px;
          }
        }
      }
    }
  }

  @media screen and (width <=1250px) {
    .login-left {
      display: none;
    }
  }

  @media screen and (width <=600px) {
    .login-form {
      width: 97% !important;
    }
  }

  .more {
    margin-top: 30px;

    .title-box {
      display: flex;
      align-items: center;
      justify-content: center;

      > p {
        margin-bottom: 0;
      }
    }

    .line {
      width: 110px;
      height: 1px;
      background: #e6e6e6;
    }

    // .title {
    //   font-size: 14px;
    //   font-weight: 500;
    //   color: #a1aebe;
    //   margin: 0 19px;
    //   align-items: center;
    // }

    .title {
      position: relative;
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      color: #a1aebe;
      margin: 0 19px;
      align-items: center;
      text-align: center;
      white-space: nowrap;
    }

    .title::before,
    .title::after {
      content: '';
      position: absolute;
      width: calc(50% - 40px);
      height: 1px;
      top: 50%;
    }

    .title::before {
      right: 100%;
      margin-right: 10px;
    }

    .title::after {
      left: 100%;
      margin-left: 10px;
    }

    .login-type {
      padding: 0 50px;
      margin-top: 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      > img {
        width: 22px;
        height: 22px;
      }
    }
  }
</style>
