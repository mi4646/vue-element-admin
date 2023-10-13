<!-- 参考：
https://juejin.cn/post/7153085909196341256
1.ECharts 菜鸟教程：https://www.runoob.com/echarts/echarts-tutorial.html
2.Echarts官方示例：https://echarts.apache.org/examples/zh/index.html
3.样子2018师傅的汉化地图：https://www.cnblogs.com/yang-2018/p/13812892.html
4.氵易风灬师傅的地图介绍：https://blog.csdn.net/qq_21963133/article/details/80012899
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
      default: '420px'
    },
    chartData: {
      type: Array,
      default: () => [],
      required: true
    }
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
      this.chart.setOption(
        {
          title: { // 标题样式
            x: 'center',
            textStyle: {
              fontSize: 18,
              color: 'black'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function(params) {
              console.log(params)
              if (params.name) {
                return params.name + ' : ' + (isNaN(params.value) ? 0 : parseInt(params.value))
              }
            }
          },
          visualMap: { // 视觉映射组件
            left: '2%',
            bottom: '15%',
            min: 10,
            max: 500000,
            text: ['高', '低'],
            realtime: false, // 拖拽时，是否实时更新
            calculable: true, // 是否显示拖拽用的手柄
            inRange: {
              color: ['lightskyblue', 'yellow', 'orangered']
            }
          },
          series: [
            {
              type: 'map',
              mapType: 'china',
              roam: false, // 是否开启鼠标缩放和平移漫游
              itemStyle: { // 地图区域的多边形 图形样式
                normal: { // 是图形在默认状态下的样式
                  label: {
                    show: true, // 是否显示标签
                    textStyle: {
                      color: 'black'
                    }
                  }
                },
                zoom: 1.5, // 地图缩放比例,默认为1
                emphasis: { // 是图形在高亮状态下的样式,比如在鼠标悬浮或者图例联动高亮时
                  label: { show: true }
                }
              },
              top: '3%', // 组件距离容器的距离
              data: data
            }
          ]
        }
      //   {
      //   tooltip: {
      //     trigger: 'item',
      //     formatter: '{b}<br/>{c} (人)'
      //   },
      //   toolbox: {
      //     show: true,
      //     orient: 'vertical',
      //     left: 'right',
      //     top: 'center',
      //     feature: {
      //       dataView: { readOnly: false },
      //       restore: {},
      //       saveAsImage: {}
      //     }
      //   },
      //   visualMap: {
      //     min: 800,
      //     max: 50000,
      //     text: ['High', 'Low'],
      //     realtime: false,
      //     calculable: true,
      //     left: '2%',
      //     bottom: '3%',
      //     textStyle: {
      //       color: '#fff'
      //     },
      //     color: '#fff',
      //     inRange: {
      //       color: ['lightskyblue', 'yellow', 'orangered']
      //     }
      //   },
      //   series: [
      //     {
      //       type: 'map',
      //       map: 'china',
      //       label: {
      //         show: true,
      //         color: 'yellow'
      //       },
      //       data
      //     }
      //   ]
      // }
      )
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
