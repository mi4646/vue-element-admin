<template>
  <page-header-wrapper :breadcrumb="false">
    <template v-slot:content>
      <WorkbenchHeader />
    </template>

    <div>
      <a-row :gutter="30">
        <a-col
          :xl="16"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <ProjectCard
            :loading="loading"
            class="enter-y"
          />

          <a-card
            :loading="loading"
            title="动态"
            :bordered="false"
          >
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
                  />
                  <div slot="title">
                    <span>{{ item.user.nickname }}</span>&nbsp; 在&nbsp;<a
                      href="#"
                    >{{ item.project.name }}</a>&nbsp;
                    <span>{{ item.project.action }}</span>&nbsp;
                    <a href="#">{{ item.project.event }}</a>
                  </div>
                  <div slot="description">{{ item.time }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>

        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            title="快速开始 / 便捷导航"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <a slot="extra">更多</a>
            <a-card-grid
              v-for="item in navItems"
              :key="item.title"
            >
              <span class="flex flex-col items-center justify-center">
                <a-icon
                  :type="item.icon"
                  theme="twoTone"
                  :two-tone-color="item.color"
                  size="20"
                  style="margin-right: 10px;"
                />
                <span class="mt-2 text-md">{{ item.title }}</span>
              </span>
            </a-card-grid>
            <a-card-grid v-if="navItems.length < 6">
              <a-button
                size="small"
                type="primary"
                ghost
                icon="plus"
                style="height: 19px; line-height: 19px;"
              >添加</a-button>
            </a-card-grid>
          </a-card>

          <!-- <a-card title="XX 指数" style="margin-bottom: 24px" :loading="radarLoading" :bordered="false"
            :body-style="{ padding: 0 }">
            <div style="min-height: 400px;">
              <radar :data="radarData" />
            </div>
          </a-card> -->

          <a-card
            class="!my-4 enter-y"
            :loading="loading"
          >
            <img
              class="mx-auto xl:h-50 h-30"
              src="@/assets/svg/illustration.svg"
            >
          </a-card>

          <!-- <a-card :loading="loading" title="团队" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12" v-for="(item, index) in teams" :key="index">
                  <a>
                    <a-avatar size="small" :src="item.avatar" />
                    <span class="member">{{ item.name }}</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card> -->
        </a-col>
      </a-row>
    </div>

  </page-header-wrapper>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import ProjectCard from './components/ProjectCard.vue'
import WorkbenchHeader from './components/WorkbenchHeader.vue'

export default {
  // 文档: https://gitee.com/tokyocsd/ant-design-pro-layout
  provide: {
    locale: 'zh-CN',
    contentWidth: 'Fluid',
    breadcrumbRender: false
  },
  name: 'Workplace',
  components: {
    PageHeaderWrapper,
    ProjectCard,
    WorkbenchHeader
  },
  data() {
    return {
      avatar: '',
      user: {},
      loading: true,
      radarLoading: true,
      activities: [],
      teams: [],
      radarData: [],
      navItems: [
        {
          title: '首页',
          icon: 'home',
          color: '#1fdaca'
        },
        {
          title: '仪表盘',
          icon: 'appstore',
          color: '#bf0c2c'
        },
        {
          title: '组件',
          icon: 'shop',
          color: '#e18525'
        },
        {
          title: '系统管理',
          icon: 'setting',
          color: '#3fb27f'
        },
        {
          title: '权限管理',
          icon: 'tags',
          color: '#4daf1bc9'
        },
        {
          title: '图表',
          icon: 'fund',
          color: '#00d8ff'
        }
      ]
    }
  },
  mounted() {
    // this.getActivity()
    // this.getTeams()
    // this.initRadar()
  },
  created() {
    setTimeout(() => { this.loading = false }, 1500)
  },
  methods: {
    // getActivity () {
    //   this.$http.get('/workplace/activity').then(res => {
    //     this.activities = res.result
    //   })
    // },
    // getTeams () {
    //   this.$http.get('/workplace/teams').then(res => {
    //     this.teams = res.result
    //   })
    // },
    // initRadar () {
    //   this.radarLoading = true
    //   this.$http.get('/workplace/radar').then(res => {
    //     const dv = new DataSet.View().source(res.result)
    //     dv.transform({
    //       type: 'fold',
    //       fields: ['个人', '团队', '部门'],
    //       key: 'user',
    //       value: 'score'
    //     })

    //     this.radarData = dv.rows
    //     this.radarLoading = false
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
  @import './Workplace.less';

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
