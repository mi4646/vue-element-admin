<template>
  <page-header-wrapper :breadcrumb="false" :i18n-render="i18nRender">
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

          <a-card
            class="project-list"
            v-bind="$attrs"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="Vue后台管理系统项目"
            :body-style="{ padding: 0 }"
          >
            <a slot="extra">更多</a>

            <ProjectCard
              class="enter-y"
            />
          </a-card>

          <a-card
            :bordered="bordered"
            title="动态"
          >
            <a slot="extra">
              <router-link to="/logs/index">更多</router-link>
            </a>
            <dynamic-state />
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

          <!-- 便捷导航 -->
          <easy-navigation
            title="快速开始 / 便捷导航"
            :bordered="bordered"
          />

          <a-card
            class="!my-4 enter-y"
            title="XX 指数"
            style="margin-bottom: 24px"
            :body-style="{ padding: 0 }"
          >
            <div style="min-height: 200px;">
              <img
                class="mx-auto xl:h-50 h-30"
                src="@/assets/svg/illustration.svg"
              >
            </div>
          </a-card>

          <a-card
            title="友链"
            :bordered="bordered"
            style="margin-bottom: 24px;
            /* min-height: 400px; */
            "
          >
            <a slot="extra">更多</a>
            <!-- <img class="image-container"> -->
            <div class="members">
              <a-row>
                <a-col v-for="(item, index) in teams" :key="index" :span="12">
                  <a>
                    <a-avatar size="small" :src="item.avatar" />
                    <span class="member">{{ item.name }}</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

  </page-header-wrapper>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import ProjectCard from './components/ProjectCard.vue'
import WorkbenchHeader from './components/WorkbenchHeader.vue'
import EasyNavigation from './components/EasyNavigation.vue'
import DynamicState from './components/DynamicState.vue'

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
    WorkbenchHeader,
    EasyNavigation,
    DynamicState
  },
  data() {
    return {
      user: {},
      avatar: '',
      bordered: false,
      radarLoading: true,
      teams: [{
        id: 1,
        name: '科学搬砖组',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
      },
      {
        id: 2,
        name: '程序员日常',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png'
      },
      {
        id: 1,
        name: '设计天团',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png'
      },
      {
        id: 1,
        name: '中二少女团',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png'
      },
      {
        id: 1,
        name: '骗你学计算机',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png'
      }
      ],
      radarData: []
    }
  },
  methods: {
    // 国际化函数的实现
    i18nRender() {}
  }
}
</script>

<style lang="less" scoped>
  @import './Workplace.less';
  @body-background:#FF5733; // 修改页面背景色
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

.image-container {
  width: 100%;
  height: 0;
  padding-bottom: 60%;
  background-image: url('../../../assets/svg/Business.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
