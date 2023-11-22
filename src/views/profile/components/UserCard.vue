<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我的</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>你好 </div>
          {{ user.role }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>教育</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            毕业于xxx大学计算机科学专业
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>技能</span></div>
        <div class="user-bio-section-body">
          <div v-for="(item,index) in progressList" :key="index">
            <span>{{ item.name }}</span>
            <el-progress :percentage="setItemProgress(item)" :color="customColorMethod(item)" />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  },
  data() {
    return {
      progressList: [{
        name: 'Python',
        number: 100
      },
      {
        name: 'Django',
        number: 90
      },
      {
        name: 'Flask',
        number: 70
      },
      {
        name: '爬虫',
        number: 60
      },
      {
        name: 'Vue',
        number: 50
      },
      {
        name: 'JavaScript',
        number: 40
      },
      {
        name: 'Css',
        number: 20
      }
      ]
    }
  },
  methods: {
    setItemProgress(data) {
      return data.number
    },

    // 设置当前进度条状态，显示不同颜色
    customColorMethod(data) {
      if (data.number === 100) {
        return '#20a0ff'
      } else if (data.number >= 80) {
        return '#13ce66'
      } else if (data.number >= 60) {
        return '#E6A23C'
      } else if (data.number >= 40) {
        return '#ff4949'
      } else if (data.number >= 20) {
        return '#909399'
      } else {
        return '#67c23a'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
