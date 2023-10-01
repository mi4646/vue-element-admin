<template>
  <div class="page-header-content">
    <div class="avatar">
      <a-avatar
        size="large"
        :src="avatar"
      />
    </div>
    <div class="content">
      <div class="content-title">
        {{ timeFix }}, {{ name }},
        <span class="welcome-text">
          {{ welcome }} &nbsp;
        </span>
      </div>
      <span class="heart-sentence">
        <div>{{ heartSentence }}</div>
        <!-- <div class="tags">
          <span style="font-size: 12px; display: flex;"> <a-tag
              color="#87d068"
              style="height: 20px;"
            >宜</a-tag>{{suited}}</span>
          <span style="font-size: 12px; display: flex;"> <a-tag
              color="#F45"
              style="height: 20px;"
            >忌</a-tag>
            {{unsuited}}</span>
        </div> -->
      </span>
    </div>

    <div class="extra-content">
      <a-row class="content">
        <p>{{ dayInfo }}</p>
        <div class="weather">
          <iframe
            :v-if="showIframe"
            width="100%"
            scrolling="no"
            height="60"
            frameborder="0"
            allowtransparency="true"
            :src="weatherUrl"
          />
        </div>
      </a-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { timeFix, welcome, parseData, getDayInfo } from '@/utils/index.js'

export default {

  data() {
    return {
      welcome: '',
      showIframe: false,
      weatherUrl: '//i.tianqi.com/index.php?c=code&id=12&icon=1&num=3&site=5',
      timeFix: timeFix(),
      current: {},
      dayInfo: '',
      heartSentence: '',
      suited: '无',
      unsuited: '无'

    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  mounted() {
    this.showIframe = true
    this.suited = '嫁娶,结婚,婚嫁,祈福,求嗣,求子,生子,出行,出火,拆卸,修造,装修,动土,上梁'
    this.unsuited = '登高.行船.安床.入宅.博彩'
    // 日期、节日、节气
    // https://6tail.cn/calendar/api.html
    this.dayInfo = getDayInfo()
    // this.getIPAddress()
  },
  created() {
    // this.getWeatherInfo();
    // this.getChickenSoup()
    setTimeout(() => { this.loading = false }, 1500)
    // this.user = this.userInfo
    this.welcome = welcome()
  },
  methods: {
    getWeatherInfo() {
      this.axios.get('/api/accounts/workbench/weather/').then(({ data }) => {
        if (data.code) {
          this.current = data.current
        }
      }).catch(error => {
        this.$notify.error({
          title: '失败',
          message: error
        })
      })
    },
    // 根据三方接口获取鸡汤
    getChickenSoup() {
      this.axios.get('jt').then(response => {
        const jiTang = parseData(response)
        if (jiTang) {
          this.heartSentence = jiTang
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getIPAddress() {
      this.axios.get('https://ip.nf/me.json').then(response => {
        const data = response.data
        this.weatherUrl = '//i.tianqi.com/index.php?c=code&id=12&icon=1&num=3&site=5' + '&py=' + data.ip.city
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../Workplace.less';

  .tags {
    // display: flex;
    gap: 20px;
    margin-top: 10px;
  }

  .user-header {
    width: 100%;
    background-color: #fff;
    margin-bottom: 10px;

    .heart-sentence {
      width: calc(100% -660px);
      h3 {
        color: rgba(0, 0, 0, 0.75);
      }
    }

    .last-login-info {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.45);
      overflow-wrap: break-word;
    }
  }
</style>
