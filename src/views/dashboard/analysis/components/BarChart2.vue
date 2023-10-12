<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    chartData: {
      type: Array,
      default: () => [] // 设置默认值为一个空数组
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              width: 1,
              color: '#019680'
            }
          }
        },
        grid: { left: '1%', right: '1%', top: '2%', bottom: 0, containLabel: true },
        xAxis: {
          type: 'category',
          data: [...new Array(12)].map((_item, index) => `${index + 1}月`)
        },
        yAxis: {
          type: 'value',
          max: 8000,
          splitNumber: 4
        },
        series: [
          {
            data: [3000, 2000, 3333, 5000, 3200, 4200, 3200, 2100, 3000, 5100, 6000, 3200, 4800],
            type: 'bar',
            barMaxWidth: 80
          }
        ],
        itemStyle: {
          barBorderRadius: [2, 2, 0, 0], // 柱体圆角
          color: new echarts.graphic.LinearGradient(
            // 前四个参数用于配置渐变色的起止位置，这四个参数依次对应 右下左上 四个方位。也就是从右边开始顺时针方向。
            // 通过修改前4个参数，可以实现不同的渐变方向
            /* 第五个参数则是一个数组，用于配置颜色的渐变过程。
               每项为一个对象，包含offset和color两个参数
            */

            0, 0, 0, 1, [{ // 代表渐变色从正上方开始
              offset: 0, // offset范围是0~1，用于表示位置，0是指0%处的颜色
              color: '#48c6ef'
            }, // 柱图渐变色
            {
              offset: 1, // 指100%处的颜色
              color: '#6f86d6'
            }
            ]
          )
        }
      })
    }
  }
}
</script>
