<!--
  参考博客：https://dongkelun.com
-->
<template>
  <div id="page-background">
    <div class="title">Echarts 中国地图三级钻取</div>
    <div class="box">
      <button class="backBtn" @click="back()">返回上级</button>
      <div id="mapChart" class="chart" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
import cityMap from './china-main-city-map.js'

var chinaId = 100000
var chinaName = 'china'
var chinaJson = null

var parentId = null
var mapStack = []
var parentName = null

var myChart = null

export default {
  name: 'ChinaMap',
  data() {
    return {}
  },
  mounted: function() {
    this.mapChart('mapChart')
  },
  methods: {
    back() {
      if (mapStack.length !== 0) {
        var map = mapStack.pop()
        axios.get('/js/map/' + map.mapId + '.json', {}).then(response => {
          const mapJson = response.data
          registerAndSetOption(myChart, map.mapId, map.mapName, mapJson, false)
          parentId = map.mapId
          parentName = map.mapName
        })
      }
    },

    mapChart(divid) {
      axios.get('/js/map/' + chinaId + '.json', {}).then(response => {
        const mapJson = response.data
        chinaJson = mapJson
        myChart = echarts.init(document.getElementById(divid))
        registerAndSetOption(myChart, chinaId, chinaName, mapJson, false)
        parentId = this.chinaId
        parentName = 'china'
        myChart.on('click', function(param) {
          // this.parentInfo
          var cityId = cityMap[param.name]
          if (cityId) {
            axios.get('/js/map/' + cityId + '.json', {}).then(response => {
              const mapJson = response.data
              registerAndSetOption(myChart, cityId, param.name, mapJson, true)
            })
          } else {
            registerAndSetOption(myChart, chinaId, chinaName, chinaJson, false)
            mapStack = []
            parentId = chinaId
            parentName = chinaName
          }
        })
      })
    }
  }
}

/*
通过数组索引取得最大和最小值
*/
function getMinMaxValue(mapData) {
  var min = mapData[mapData.length - 1].value
  var max = mapData[0].value
  if (mapData.length === 1) {
    min = 0
  }
  return { min, max }
}

function registerAndSetOption(myChart, id, name, mapJson, flag) {
  echarts.registerMap(name, mapJson)
  const mapData = mapJson.features.map(item => {
    return {
      name: item.properties.name,
      value: Math.random() * 10000
    }
  })
  var { min, max } = getMinMaxValue(mapData)

  myChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: p => {
        let val = p.value
        if (!val) {
          val = 0
        }
        const txtCon = p.name + ':' + val.toFixed(2)
        return txtCon
      }
    },
    toolbox: {
      feature: {
        restore: {
          show: false
        },
        dataView: {
          optionToContent: function(opt) {
            const series = opt.series[0].data
            const tdHeads = '<th  style="padding: 0 20px">所在地区</th><th style="padding: 0 20px">销售额</th>'
            let table = `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:left;"><tbody><tr>${tdHeads} </tr>`
            for (let i = 0; i < series.length; i++) {
              table += `<tr>
                              <td style="padding: 0 50px">${series[i].name}</td>
                              <td style="padding: 0 50px">${series[i].value.toFixed(2)}万</td>
                              </tr>`
            }
            table += '</tbody></table>'
            return table
          }
        },
        saveAsImage: {
          name: '地图'
        },
        dataZoom: {
          show: false
        },
        magicType: {
          show: false
        }
      },
      iconStyle: {
        normal: {
          borderColor: '#1990DA'
        }
      },
      top: 15,
      right: 35
    },
    visualMap: {
      min: min,
      max: max,
      left: '3%',
      bottom: '5%',
      top: 'bottom',
      calculable: true,
      seriesIndex: [0],
      inRange: {
        color: ['#105389', '#3a8abc', '#0D96F1']
      },
      textStyle: {
        color: '#24CFF4'
      }
    },
    series: [{
      type: 'map',
      map: name,
      // roam: true,
      // zoom: 1.1,
      roam: false, // 不开启缩放和平移
      zoom: 1.23, // 视角缩放比例
      data: mapData,
      label: {
        normal: {
          show: true,
          color: 'rgb(249, 249, 249)',
          formatter: p => {
            switch (p.name) {
              case '内蒙古自治区':
                p.name = '内蒙古'
                break
              case '西藏自治区':
                p.name = '西藏'
                break
              case '新疆维吾尔自治区':
                p.name = '新疆'
                break
              case '宁夏回族自治区':
                p.name = '宁夏'
                break
              case '广西壮族自治区':
                p.name = '广西'
                break
              case '香港特别行政区':
                p.name = '香港'
                break
              case '澳门特别行政区':
                p.name = '澳门'
                break
              default:
                break
            }
            return p.name
          }
        },
        emphasis: {
          show: true,
          color: '#f75a00'
        }
      },
      itemStyle: {
        normal: {
          areaColor: '#24CFF4',
          borderColor: '#53D9FF',
          borderWidth: 1.3,
          shadowBlur: 15,
          shadowColor: 'rgb(58,115,192)',
          shadowOffsetX: 7,
          shadowOffsetY: 6
        },
        emphasis: {
          areaColor: '#8dd7fc',
          borderWidth: 1.6,
          shadowBlur: 25
        }

      }
    }]
  })

  if (flag) {
    mapStack.push({ mapId: parentId, mapName: parentName })
    parentId = id
    parentName = name
  }
}

</script>

<style scoped>
  #page-background {
    background-image: url("../../../assets/images/beijingtupian.png") ;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

.title {
  width: 100%;
  height: 10vh;
  text-align: center;
  color: #fff;
  font-size: 2em;
  line-height: 10vh;
}
.box {
  position: absolute;
  width: 90%;
  height: 80vh;
  /* width: 100%; */
  /* height: 100%; */
  left: 5%;
  top: 10%;
  background-color: rgba(24, 27, 52, 0.62);
}

.chart {
  position: relative;
  height: 90%;
  top: 5%;
}
.backBtn {
  position: absolute;
  top: 0;
  background-color: #00c298;
  border: 0;
  color: #fff;
  height: 27px;
  font-family: Microsoft Yahei;
  font-size: 1em;
  cursor: pointer;
}
</style>
