<!-- 参考：
https://juejin.cn/post/7153085909196341256
 -->
<template>
  <div class="mapChart">
    <!-- <h2 class="title-item">{{ title }}</h2> -->
    <div :id="id" class="midtop" :style="{height:height,width:width}" />
  </div>
</template>
<script>
import './china.js'
import * as echarts from 'echarts'
import resize from '../mixins/resize'

export default {
  name: 'MapChart',
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    // id: {
    //   type: String,
    //   default: '',
    //   required: true
    // },
    chartData: {
      type: Array,
      default: () => [],
      required: true
    }
    // title: {
    //   type: String,
    //   default: '',
    //   required: true
    // }
  },
  data() {
    return {
      id: 'china',
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.setOptions(this.chartData)
      this.chart.on('click', function(params) {
        console.log(params.name)
      })
    },
    setOptions(data = []) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>{c} (人)'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 800,
          max: 50000,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          left: '5%',
          bottom: '8%',
          textStyle: {
            color: '#fff'
          },
          color: '#fff',
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [
          {
            type: 'map',
            map: 'china',
            label: {
              show: true,
              color: 'yellow'
            },
            data
          }
        ]
      })
    }
  }
}
</script>
<style scoped lang='scss'>
.mapChart {
  .title-item {
    text-align: center;
    width: 100%;
    font-size: 12px;
    font-weight: normal;
    letter-spacing: 2px;
    font-weight: normal;
    overflow: hidden;
  }
  .midtop {
    width: 99%;
    height: 430px;
  }
}
</style>
