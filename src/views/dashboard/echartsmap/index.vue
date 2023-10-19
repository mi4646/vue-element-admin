<!--
  参考：https://www.cnblogs.com/weijiutao/p/15990813.html
  https://gitee.com/vijtor/vue-map-echarts
  https://gitee.com/vijtor/vue-map-datav
 -->
<template>
  <div id="page-background">
    <div class="title">Echarts 中国地图三级钻取</div>
    <china
      :area-code.sync="areaCode"
      :area-level.sync="areaLevel"
      :area-name.sync="areaName"
      :map-name-list.sync="mapNameList"
      :map-code-list.sync="mapCodeList"
      :area-statistic="areaStatistic"
    />
  </div>
</template>

<script>
import China from './components/china'

export default {
  name: 'Index',
  components: {
    China
  },
  data() {
    return {
      areaCode: '000000000000', // 当前用的areaCode
      areaLevel: 0, // 当前用的areaCode
      areaName: 'china', // 当前用的areaName
      mapNameList: [], // 当前地图上的地区名字
      mapCodeList: [], // 当前地图上的地区Code
      areaStatistic: [] // 测试
    }
  }

}
</script>

<style scoped>
  #page-background {
    /* background-image: url("../../../assets/images/beijingtupian.png") ; */
    background-image: url("../../../assets/images/bg1.jpg") ;
    /* background-position: center; */
    height: 100%;
    width: 100%;
    /* background-size: cover; */
    position: fixed;
    /* position: relative; */
  }

.title {
  width: 100%;
  height: 10vh;
  text-align: center;
  color: #fff;
  font-size: 2em;
  line-height: 10vh;
}
</style>
