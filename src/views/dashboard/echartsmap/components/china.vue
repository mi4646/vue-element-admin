<template>
  <div id="map-container">
    <!-- <el-button v-if="deepTree.length > 1" type="text" size="large" class="back" @click="back">返回</el-button> -->

    <span v-for="(item,index) in parentInfo" :key="item.areaCode">
      <span class="title" @click="chooseArea(item,index)">{{ item.cityName=='全国'?'中国':item.cityName }}</span>
      <span v-show="index+1!=parentInfo.length" class="icon">></span>
    </span>

    <div class="echarts">
      <div id="map" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getChinaJson, getProvinceJson, getCityJson, getDistrictJson } from '@/api/dashboard'
import { mapOption } from '@/config/mapOption'
import resize from '@/views/dashboard/analysis/components/mixins/resize'

export default {
  name: 'ChinaMap',
  components: {},
  mixins: [resize],
  props: {
    areaCode: {
      type: String,
      default: '000000000000'
    },
    areaLevel: {
      type: [String, Number],
      default: 0
    },
    areaName: {
      type: String,
      default: 'china'
    },
    // 当前地图上的地区名字
    mapNameList: {
      type: Array,
      default() {
        return []
      }
    },
    // 当前地图上的地区Code
    mapCodeList: {
      type: Array,
      default() {
        return []
      }
    },
    // 地区统计数据
    areaStatistic: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      chart: null, // 实例化echarts
      mapDataList: [], // 当前地图上的地区
      option: { ...mapOption.basicOption }, // map的相关配置
      deepTree: [], // 点击地图时push，点返回时pop
      areaStatisticMapValue: {}, // 地图数据value, 只是amounts
      areaStatisticMapData: {}, // 地图数据data,包含所有数据
      areaLevelMap: {
        'country': 0,
        'china': 0,
        'province': 1,
        'city': 2,
        'district': 3
      },
      tooltipAutoplay: null, // 提示框自动播放
      tooltipAutoplayIndex: 0, // 提示框自动播放index
      parentInfo: [{
        cityName: '全国',
        areaCode: 100000
      }] // 面包屑导航数据
    }
  },
  watch: {
    areaStatistic: {
      handler(val) {
        var objValue = {}; var objData = {}
        for (var i = 0; i < val.length; i++) {
          objValue[val[i]['areaCode'].substr(0, 6)] = val[i].amounts * 1
          objData[val[i]['areaCode'].substr(0, 6)] = val[i]
        }
        this.areaStatisticMapValue = objValue
        this.areaStatisticMapData = objData
        this.initEcharts()
      },
      deep: true
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
      this.initEcharts()
      this.chart.on('click', this.echartsMapClick)
      this.chart.on('mouseover', this.echartsMapMouseover)
      this.chart.on('mouseout', this.echartsMapMouseout)
    })
  },
  methods: {
    // 初次加载绘制地图
    initEcharts() {
      // 地图容器
      // this.$echarts.dispose(document.getElementById('map'))
      this.chart = echarts.init(document.getElementById('map'))
      if (this.areaLevel === 0) {
        this.requestGetChinaJson()
      } else if (this.areaLevel === 1) {
        this.requestGetProvinceJSON({ name: this.areaName, level: 'province', adcode: this.areaCode.substr(0, 6) })
      } else if (this.areaLevel === 2) {
        this.requestGetCityJSON({ name: this.areaName, level: 'city', adcode: this.areaCode.substr(0, 6) })
      } else if (this.areaLevel === 3) {
        this.requestGetDistrictJSON({ name: this.areaName, level: 'district', adcode: this.areaCode.substr(0, 6) })
      } else {
        return false
      }
    },
    // 地图点击
    echartsMapClick(params) {
      this.$emit('update:areaCode', params.data.adcode + '000000')
      this.$emit('update:areaName', params.data.name)
      this.$emit('update:areaLevel', this.areaLevelMap[params.data.level])
      if (
        this.parentInfo[this.parentInfo.length - 1].cityName === params.data.name
      ) {
        return
      }
      this.parentInfo.push({ cityName: params.data.name, areaCode: params.data.adcode + '000000' })
      console.log(this.parentInfo, 'this.parentInfo')

      if (params.data.level === 'province') {
        this.requestGetProvinceJSON(params.data)
      } else if (params.data.level === 'city') {
        this.requestGetCityJSON(params.data)
      } else if (params.data.level === 'district' && this.mapDataList.length > 1) {
        this.requestGetDistrictJSON(params.data)
      } else {
        return false
      }
    },
    // 绘制全国地图areaStatistic
    requestGetChinaJson() {
      getChinaJson().then(res => {
        // console.log('china--->', res)
        this.$emit('update:areaLevel', 0)
        this.setJsonData(res.data)
      })
    },
    // 加载省级地图
    requestGetProvinceJSON(params) {
      getProvinceJson(params.adcode).then(res => {
        // console.log('province--->', res)
        this.$emit('update:areaLevel', 1)
        this.setJsonData(res.data, params)
      })
    },
    // 加载市级地图
    requestGetCityJSON(params) {
      getCityJson(params.adcode).then(res => {
        // console.log('city--->', res)
        this.$emit('update:areaLevel', 2)
        this.setJsonData(res.data, params)
      })
    },
    // 加载县级地图
    requestGetDistrictJSON(params) {
      getDistrictJson(params.adcode).then(res => {
        // console.log('district--->', res)
        this.$emit('update:areaLevel', 3)
        this.setJsonData(res.data, params)
      })
    },
    // 设置数据
    setJsonData(res, params) {
      var mapDataList = []
      var mapNameList = []
      var mapCodeList = []

      for (var i = 0; i < res.features.length; i++) {
        var obj = {
          ...res.features[i].properties,
          value: Math.random() * 10000,
          valueData: Math.random() * 10000
        }
        mapDataList.unshift(obj)
        mapNameList.unshift(res.features[i].properties.name)
        mapCodeList.unshift(res.features[i].properties.adcode + '000000')
      }
      this.mapDataList = mapDataList
      this.$emit('update:mapNameList', mapNameList)
      this.$emit('update:mapCodeList', mapCodeList)
      this.setMapData(res, params)
    },
    // 设置地图信息
    setMapData(res, params) {
      if (this.areaName === 'china') {
        this.deepTree.push({
          mapDataList: this.mapDataList,
          params: { name: 'china', level: 'country', adcode: '100000' }
        })
        // 注册地图
        echarts.registerMap('china', res)
        // 绘制地图
        this.renderMap('china', this.mapDataList)
      } else {
        this.deepTree.push({ mapDataList: this.mapDataList, params: params })
        echarts.registerMap(params.name, res)
        this.renderMap(params.name, this.mapDataList)
      }
    },
    // 渲染地图
    renderMap(map, data) {
      var mapDataList = data.map(item => {
        return {
          name: item.name,
          value: item.value
        }
      })
      mapDataList = mapDataList.sort(function(a, b) {
        return b.value - a.value
      })
      var pointData = []
      for (var i = 0; i < data.length; i++) {
        if (data[i].value !== 0) {
          pointData.push({
            ...data[i],
            value: [data[i].center[0], data[i].center[1], data[i].value]
          })
        }
      }
      // 设置左下角数量范围值
      this.option.visualMap.min = mapDataList.length > 1 ? mapDataList[mapDataList.length - 2].value : 0
      this.option.visualMap.max = mapDataList.length > 0 ? mapDataList[0].value : 0
      // 设置左上角当前位置
      // this.option.title[0].text = map === 'china' ? '全国' : map
      this.option.geo = {
        show: false,
        map: map,
        zoom: 1.2, // 当前视角的缩放比例
        roam: true, // 是否开启平游或缩放
        center: undefined
      }
      this.option.series = [
        {
          name: map,
          mapType: map,
          zoom: 1, // 当前视角的缩放比例
          roam: false, // 是否开启平游或缩放
          center: undefined,
          scaleLimit: { // 滚轮缩放的极限控制
            min: 0.5,
            max: 10
          },
          ...mapOption.seriesOption,
          data: data
        },
        {
          name: '散点', // series名称
          type: 'effectScatter', // 散点类型
          coordinateSystem: 'geo', // series坐标系类型
          rippleEffect: {
            brushType: 'fill'
          },
          normal: {
            show: true,
            // 提示内容
            formatter: params => {
              return params.name
            },
            position: 'top', // 提示方向
            color: '#fff'
          },
          emphasis: {
            show: true // 点
          },
          itemStyle: {
            normal: {
              color: '#F4E925',
              shadowBlur: 10,
              shadowColor: '#000'
            }
          },
          // symbol:'pin', // 散点样式'pin'（标注）、'arrow'（箭头）
          data: pointData,
          symbolSize: function(val) {
            // return val[2] / 100;
            if (val[2] === mapDataList[0].value) {
              return 10
            }
            return 6
          },
          showEffectOn: 'render' // 加载完毕显示特效
        }
      ]
      // 渲染地图
      this.chart.setOption(this.option, true)
      this.setTooltipAutoplay()
    },
    // 地图鼠标移入事件
    echartsMapMouseover() {
      clearInterval(this.tooltipAutoplay)
    },
    // 地图鼠标移出事件
    echartsMapMouseout() {
      this.setTooltipAutoplay()
    },
    // 动态显示tooltip
    setTooltipAutoplay() {
      clearInterval(this.tooltipAutoplay)
      // var index = 0; //播放所在下标
      // if(this.chart.dispatchAction) {
      this.tooltipAutoplay = setInterval(() => {
        this.chart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: this.tooltipAutoplayIndex
        })
        this.tooltipAutoplayIndex++
        if (this.tooltipAutoplayIndex >= this.mapDataList.length) {
          this.tooltipAutoplayIndex = 0
          this.setTooltipAutoplay()
        }
      }, 6666)
      // }
    },

    // 选择切换市县
    chooseArea(val, index) {
      if (this.parentInfo.length === index + 1) {
        return
      }
      this.parentInfo.splice(index + 1)
      const data = this.deepTree[index]

      // console.log('this.deepTree: ', this.deepTree)
      console.log(this.parentInfo, '111111111111111111', index)
      console.log('data', data)

      this.mapDataList = data.mapDataList
      var areaName = data.params.name
      var areaCode = data.params.adcode
      var areaLevel = data.params.level
      var mapNameList = this.mapDataList.map(item => {
        return item.name
      })
      var mapCodeList = this.mapDataList.map(item => {
        return item.adcode + '000000'
      })
      this.$emit('update:areaCode', (areaCode === '100000' ? '000000' : areaCode) + '000000')
      this.$emit('update:areaName', areaName)
      this.$emit('update:areaLevel', this.areaLevelMap[areaLevel])
      this.$emit('update:mapNameList', mapNameList)
      this.$emit('update:mapCodeList', mapCodeList)
      this.renderMap(areaName, this.mapDataList)
    },

    // 返回
    back() {
      if (this.deepTree.length > 1) {
        this.deepTree.pop()
        this.mapDataList = this.deepTree[this.deepTree.length - 1].mapDataList
        var areaName = this.deepTree[this.deepTree.length - 1].params.name
        var areaCode = this.deepTree[this.deepTree.length - 1].params.adcode
        var areaLevel = this.deepTree[this.deepTree.length - 1].params.level
        var mapNameList = this.mapDataList.map(item => {
          return item.name
        })
        var mapCodeList = this.mapDataList.map(item => {
          return item.adcode + '000000'
        })
        this.$emit('update:areaCode', (areaCode === '100000' ? '000000' : areaCode) + '000000')
        this.$emit('update:areaName', areaName)
        this.$emit('update:areaLevel', this.areaLevelMap[areaLevel])
        this.$emit('update:mapNameList', mapNameList)
        this.$emit('update:mapCodeList', mapCodeList)
        console.log('areaName:', areaName)
        console.log('this.mapDataList:', this.mapDataList)
        this.renderMap(areaName, this.mapDataList)
      }
    }
  }
}

</script>

<style lang="scss" scoped>
#map-container {
  height: 66.6%;
  position: relative;

  .echarts {
    height: 100%;

    #map {
      width: 100%;
      height: 100%;
    }
  }

  .back {
    position: absolute;
    top: 55px;
    left: 5px;
    z-index: 9;
    //color: #24CFF4;
    font-weight: bolder;
  }

  .title {
      padding: 5px;
      border-top: 1px solid rgba(147, 235, 248, .8);
      border-bottom: 1px solid rgba(147, 235, 248, .8);
      cursor: pointer;
      color:#fff;
      font-size: 2em;
    }

    .icon {
      font-family: "simsun";
      font-size: 25px;
      margin: 0 11px;
      color: #fff;
    }
}

</style>

