<template>
  <el-form>
    <el-form-item label="用户名">
      <el-input v-model.trim="user.name" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model.trim="user.email" placeholder="请输入邮箱" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { userUpdate } from '@/api/user'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.user.username = this.user.name
      userUpdate(this.user).then((response) => {
        if (response.code === 0) {
          this.$message({
            message: '用户信息更新成功，请重新登录!!',
            type: 'success',
            duration: 5 * 1000
          })
          this.$store.dispatch('user/logout')
          this.$router.push('/login')
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    }
  }
}
</script>
