<!-- 编写导航组件 -->
<template>
  <div>
    <a-card
      :loading="loading"
      :title="title"
      style="margin-bottom: 24px"
      :bordered="bordered"
      :body-style="{ padding: 0 }"
    >
      <a slot="extra"><router-link to="/menus/index">更多</router-link></a>
      <a-card-grid
        v-for="item in navItems"
        :key="item.title"
      >
        <span class="flex flex-col items-center justify-center">
          <template>
            <i :class="'icon iconfont sub-el-icon ' + item.icon" style="margin-right: 10px;" />
          </template>
          <span class="mt-2 text-md">{{ item.title }}</span>
        </span>
      </a-card-grid>
      <a-card-grid v-if="navItems.length < 6">
        <a-button
          size="small"
          type="primary"
          ghost
          icon="plus"
          style="height: 19px; line-height: 19px;"
        ><router-link to="/menus/index">添加</router-link></a-button>
      </a-card-grid>
    </a-card>

  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    bordered: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      navItems: []
    }
  },
  mounted() {
    var filteredData = this.$store.getters.menus
    this.navItems = this.filterAndTransformData(filteredData)
    // console.log(this.navItems)
  },
  methods: {
    /** *
     *首先判断当前项是否有children字段且不为空，
     *同时排除掉path为/redirect的数据，并且如果当前项没有meta字段，
     *则使用children里的第一个数据的meta字段。最后将得到的title、icon和随机颜色组成新的对象放入新数组中
     */
    filterAndTransformData(data) {
      const result = []
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item.children && item.children.length > 0 && item.path !== '/redirect') {
          const meta = item.meta || (item.children && item.children[0] && item.children[0].meta)
          if (meta) {
            result.push({
              title: meta.title,
              icon: meta.icon,
              color: '#' + Math.floor(Math.random() * 16777215).toString(16) // 生成随机颜色
            })
          }
        }
      }
      return result
    }
  }
}
</script>

<style  scoped>

</style>
