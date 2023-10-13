<template>
  <div class="dashboard-editor-container">
    <!-- 右上角GitHub图标 -->
    <github-corner class="github-corner" />

    <!-- 顶部4个卡片 -->
    <panel-group />
    <!--  <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->

    <!-- 折线图 -->
    <a-row style="background:#fff;padding:16px 16px 16px 16px;margin-bottom:32px;">
      <a-card
        style="width: 100%; min-height: 480px;"
        :tab-list="tabListNoTitle"
        :active-tab-key="noTitleKey"
        @tabChange="key => onTabChange(key, 'noTitleKey')"
      >
        <!-- 流量趋势图 -->
        <p v-if="noTitleKey === 'tab2'">
          <!-- <line-chart :chart-data="lineChartData" /> -->
          <bar-chart-2 />
        </p>
        <p v-else>
          <!-- 访问量折线图  -->
          <!-- <line-chart-2 :chart-data="lineChartData" /> -->
          <line-chart-2 />
        </p>
      </a-card>
    </a-row>

    <a-card style="margin-top: 1.25rem" title="文章贡献统计" :loading="loading">
      <calendar-heatmap />
    </a-card>

    <a-row :gutter="32" style="margin-top: 1.25rem">
      <a-col :span="16">
        <a-card title="文章浏览量Top10" style="width: 100%; min-height: 450px;">
          <article-views-bar />
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="24" :lg="8">
        <a-card title="文章分类统计" style="height: 450px">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="20" style="margin-top: 1.25rem">
      <a-col :span="16">
        <a-card title="用户地域分布" style="height: 450px">
          <div :loading="loading">
            <!-- <div class="area-wrapper">
              <el-radio-group v-model="type">
                <el-radio :label="1">用户</el-radio>
                <el-radio :label="2">游客</el-radio>
              </el-radio-group>
            </div> -->
            <!-- <v-chart :options="userAreaMap" /> -->
            <map-chart :chart-data="areaData" />
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="24" :lg="8">
        <a-card title="文章标签统计" style="height: 450px">
          <div :loading="loading">
            <tag-cloud :data="tagDTOs" />
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- <a-row :gutter="32">
      <a-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </a-col>
      <a-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </a-col>
      <a-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </a-col>
    </a-row> -->

    <!-- <a-row :gutter="8" style="margin-top: 1.25rem">
      <a-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <a-card title="最近文章">
          <transaction-table />
        </a-card>
      </a-col>
      <a-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <a-card title="消息">
          <todo-list />
        </a-card>
      </a-col>
      <a-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <a-card title="">
          <box-card />
        </a-card>
      </a-col>
    </a-row> -->
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
// import LineChart from './components/LineChart'
import LineChart2 from './components/LineChart2'
// import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
import BarChart2 from './components/BarChart2'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'
import CalendarHeatmap from './components/CalendarHeatmap'
import ArticleViewsBar from './components/ArticleViewsBar'
import TagCloud from './components/TagCloud'
import MapChart from './components/Map'

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    // LineChart,
    // RaddarChart,
    PieChart,
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard,
    LineChart2,
    BarChart2,
    CalendarHeatmap,
    ArticleViewsBar,
    TagCloud,
    MapChart
  },
  data() {
    return {
      loading: false,
      articleStatisticsDTOs: [],
      tabListNoTitle: [
        {
          key: 'tab1',
          tab: '流量趋势'
        },
        {
          key: 'tab2',
          tab: '访问量'
        }
      ],
      noTitleKey: 'tab1',
      tagDTOs: [{ 'id': '05023f8da31c4b4187cc6899e2a3aec2', 'name': '镇远县' }, { 'id': '0ef028e5278f4f5ca31f99f1bd22b1cc', 'name': '剑河县' }, { 'id': '1a32ef04d3c548eaa6777abb46da32f2', 'name': '台江县' }, { 'id': '2c26488325bd493687d16315fe0e5fdd', 'name': '岑巩县' }, { 'id': '3a786111828a4b9f89ae9da25753eedd', 'name': '黎平' }, { 'id': '4ed593eed91b4244969995237f5c96c5', 'name': '丹寨县' }, { 'id': '615d2c178f1a47cb8d473823e74f5386', 'name': '凯里市' }, { 'id': '76f652df03db43349272a9aff492b065', 'name': '榕江县' }, { 'id': '8ff29d0d35e548feb945063b34ed9c9b', 'name': '黄平县' }, { 'id': 'a8ac2170008746fdadc05ea461bc5e37', 'name': '雷山县' }],
      areaData: [{ 'name': '山东', 'value': 37 }, { 'name': '台湾', 'value': 1 }, { 'name': '福建', 'value': 27 }, { 'name': '法国', 'value': 1 }, { 'name': '河北', 'value': 18 }, { 'name': '河南', 'value': 35 }, { 'name': '湖北', 'value': 54 }, { 'name': '湖南', 'value': 34 }, { 'name': '海南', 'value': 5 }, { 'name': '江西', 'value': 27 }, { 'name': '黑龙江', 'value': 15 }, { 'name': '陕西', 'value': 13 }, { 'name': '贵州', 'value': 12 }, { 'name': '江苏', 'value': 81 }, { 'name': '安徽', 'value': 22 }, { 'name': '美国', 'value': 11 }, { 'name': '吉林', 'value': 7 }, { 'name': '甘肃', 'value': 8 }, { 'name': '山西', 'value': 11 }, { 'name': '四川', 'value': 56 }, { 'name': '孟加拉', 'value': 1 }, { 'name': '加拿大', 'value': 2 }, { 'name': '日本', 'value': 2 }, { 'name': '浙江', 'value': 43 }, { 'name': '云南', 'value': 8 }, { 'name': '爱尔兰', 'value': 1 }, { 'name': '辽宁', 'value': 15 }, { 'name': '广东', 'value': 103 }, { 'name': '未知', 'value': 1 }, { 'name': '青海', 'value': 2 }, { 'name': '捷克', 'value': 1 }, { 'name': '新加坡', 'value': 4 }, { 'name': '中国', 'value': 170 }, { 'name': '澳大利亚', 'value': 3 }, { 'name': '内网IP', 'value': 2 }]
    }
  },
  created() {
    this.getAnalyzes()
  },
  methods: {
    // 获取数据
    getAnalyzes() {
      this.$store.dispatch('dashboard/getAnalyzes')
        .then(() => {
          return false
        })
        .catch(() => {
          return false
        })
    },
    // 切换卡片
    onTabChange(value) {
      this.noTitleKey = value
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
