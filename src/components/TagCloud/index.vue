<!--
标签云文档：
https://gitcode.net/mirrors/ecomfe/echarts-wordcloud?utm_source=csdn_github_accelerator
https://blog.csdn.net/qq_40011214/article/details/122240783
https://juejin.cn/post/7044809985154351141
 -->
<template>
  <div>
    <div id="wordCloud" :style="{height:height,width:width}" />
  </div>
</template>

<script>

import echarts from 'echarts'
import 'echarts-wordcloud'
import router from '@/router'

export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      // data: []
      data: [
        { value: '30', name: 'VIVO' },
        { value: '29', name: 'OPPO' },
        { value: '28', name: 'HONOR' },
        { value: '27', name: '红米' },
        { value: '26', name: '小米' },
        { value: '25', name: '美图' },
        { value: '24', name: 'ONEPLUS' },
        { value: '23', name: '魅族' },
        { value: '22', name: '红手指' },
        { value: '21', name: 'SAMSUNG' },
        { value: '20', name: '金立' },
        { value: '16', name: 'BLACKBERRY' },
        { value: '15', name: '诺基亚' },
        { value: '14', name: '锤子' },
        { value: '13', name: '大疆' },
        { value: '12', name: '361' },
        { value: '11', name: '摩托罗拉' },
        { value: '10', name: '联想' },
        { value: '9', name: '玩家国度' }
      ]
    }
  },
  mounted: function() {
    this.initChart()
  },
  methods: {
    initChart() {
      var myChart = echarts.init(document.getElementById('wordCloud'))
      const option = {
        title: {
          text: '',
          x: 'center'
        },
        backgroundColor: '#fff',
        // tooltip: {
        //   pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
        // },
        series: [
          {
            type: 'wordCloud',
            // 用来调整词之间的距离
            gridSize: 10,
            // 用来调整字的大小范围
            // 数据中的值将被映射到的文本大小范围。
            // 默认最小12px，最大60px。
            sizeRange: [14, 40],
            // 文本旋转范围和步进度。文本将通过rotationStep 45在[- 90,90]范围内随机旋转
            // 用来调整词的旋转方向，，[0,0]--代表着没有角度，也就是词为水平方向，需要设置角度参考注释内容
            rotationRange: [-45, 0, 45, 90],
            // rotationRange: [0, 90],
            // rotationRange: [0, 0],
            // 随机生成字体颜色
            // maskImage: maskImage,
            textStyle: {
              normal: {
                // 颜色随机渐变
                color() {
                  return (
                    'rgb(' + Math.round(Math.random() * 255) + ', ' +
                    Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ')'
                  )
                }
              }
            },
            // 位置相关设置
            // 接下来的左/顶/宽/高/右/底是用来定位词云的
            // 默认放置在中间，大小为75% x 80%。
            left: 'center',
            top: 'center',
            right: null,
            bottom: null,
            width: '100%',
            height: '100%',
            // 数据
            data: this.data
          }
        ]

      }
      myChart.setOption(option)
      // 点击某个字
      myChart.on('click', function(params) {
        // 跳转到标签页
        // router.push('/')
        router.go(0)
        console.log('myChart----click---:', params, '------', params.data)
      })
    }

  }

}

</script>
<style lang='less' scoped>
</style>
