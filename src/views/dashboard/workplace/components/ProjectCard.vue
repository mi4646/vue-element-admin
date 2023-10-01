<template>
  <a-card
    class="project-list"
    v-bind="$attrs"
    style="margin-bottom: 24px;"
    :bordered="false"
    title="Vue后台管理系统项目"
    :body-style="{ padding: 0 }"
  >
    <a slot="extra">全部项目</a>
    <div>
      <a-card-grid v-for="(item, i) in projects" :key="i" class="project-card-grid">
        <a-card :bordered="false" :body-style="{ padding: 0 }">
          <a-card-meta>
            <div slot="title" class="card-title">
              <a-avatar size="small" :src="item.cover" />
              <a>{{ item.title }}</a>
            </div>
            <div slot="description" class="card-description">
              {{ item.description }}
            </div>
          </a-card-meta>
          <!-- 图标 -->
          <div style="display: flex; justify-content: flex-end; align-items: flex-end; margin-top: 16px;">
            <a :href="item.github" target="_blank">
              <a-icon type="github" style="margin-right: 8px;" />
            </a>
            <a :href="item.gitee" target="_blank">
              <a-icon type="google" style="margin-right: 8px;" />
            </a>
            <a :href="item.link" target="_blank">
              <a-tooltip placement="bottom">
                <template slot="title">
                  预览项目
                </template>
                <a-icon type="dribbble" />
              </a-tooltip>
            </a>
          </div>

        </a-card>
      </a-card-grid>
    </div>
  </a-card>
</template>

<script>
import { getProject } from '@/api/workbench'

export default {
  data() {
    return {
      projects: []
    }
  },
  mounted() {
    this.getProjects()
  },
  methods: {
    getProjects() {
      getProject().then(response => {
        this.projects = response.data
      }).catch(err => {
        this.$notify.error({ title: '失败', message: err })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.project-list {
    .card-title {
        font-size: 0;

        a {
            color: rgba(0, 0, 0, 0.85);
            margin-left: 12px;
            line-height: 24px;
            height: 24px;
            display: inline-block;
            vertical-align: top;
            font-size: 14px;

            &:hover {
                color: #1890ff;
            }
        }
    }

    .card-description {
        color: rgba(0, 0, 0, 0.45);
        height: 44px;
        line-height: 22px;
        overflow: hidden;
    }

    .ant-card-meta-description {
        color: rgba(0, 0, 0, 0.45);
        height: 44px;
        line-height: 22px;
        overflow: hidden;
    }
}

.item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;

    a {
        color: rgba(0, 0, 0, 0.65);
        display: inline-block;
        font-size: 14px;
        margin-bottom: 13px;
        width: 25%;
    }
}

.members {
    a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;

        .member {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            line-height: 24px;
            max-width: 100px;
            vertical-align: top;
            margin-left: 12px;
            transition: all 0.3s;
            display: inline-block;
        }

        &:hover {
            span {
                color: #1890ff;
            }
        }
    }
}

.mobile {
    .project-list {
        .project-card-grid {
            width: 100%;
        }
    }

    .more-info {
        border: 0;
        padding-top: 16px;
        margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
        display: none;
    }
}
</style>
