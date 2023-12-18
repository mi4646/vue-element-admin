<!-- 动态 -->
<template>
  <a-list>
    <a-list-item
      v-for="(item, index) in activities"
      :key="index"
    >
      <a-list-item-meta>
        <a-avatar
          slot="avatar"
          size="small"
          :src="item.user.avatar"
        >
          <a-icon slot="icon" type="user" />
        </a-avatar>
        <div slot="title">
          <span>{{ item.user.username }}</span>&nbsp; 在&nbsp;<a
            href="#"
          >{{ item.object_repr }}</a>&nbsp;
          <span>{{ item.action_display }}</span>&nbsp;
          <a href="#">{{ item.event }}</a>
        </div>
        <div slot="description">{{ item.timestamp }}</div>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>

<script>
import { logsList } from '@/api/logs'

export default {
  data() {
    return {
      activities: []
    }
  },
  mounted() {
    this.listLogs()
  },
  methods: {
    // 日志列表
    listLogs() {
      const params = { page: 1, p_size: 6 }
      logsList(params).then((response) => {
        if (response.code === 0) {
          this.activities = response.data.map(log => ({ ...log,
            event: log.object_repr.split(' ').pop(),
            object_repr: log.object_repr.split(' ').slice(0, -1).join(' ')
          }))
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

<style  scoped>

</style>
