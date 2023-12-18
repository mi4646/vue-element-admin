<!-- 日志详情信息 -->
<template>
  <el-dialog :visible="dialogVisible" width="40%" @close="closeDialog">
    <div slot="title" class="dialog-title-container"><i class="el-icon-more" />详细信息</div>
    <el-form ref="form" :model="optLog" label-width="100px" size="mini">
      <el-form-item label="IP地址：">
        <template v-if="optLog.remote_addr">
          {{ !optLog.showIp ? optLog.remote_addr.replace(/\.\d{1,3}\.\d{1,3}$/, '.**.**') : optLog.remote_addr }}
          <!-- <el-icon color="#1976D2" @click="optLog.showIp=!optLog.showIp">mdi-eye-off</el-icon> -->
          <i class="el-icon-view" style="margin-left: 10px;" @click="optLog.showIp=!optLog.showIp" />
        </template>
      </el-form-item>
      <el-form-item label="操作描述：">
        {{ optLog.object_repr }}
      </el-form-item>
      <el-form-item label="操作详情：">
        <div v-html="optLog.msg" />
      </el-form-item>
      <el-form-item label="操作人员：">
        {{ optLog.username }}
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'LogDetail',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    optLog: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return { }
  },
  methods: {
    // 关闭对话框 触发一个事件，通知父组件关闭对话框
    closeDialog() {
      this.$emit('close-dialog')
    }
  }
}
</script>

<style  scoped>

</style>
