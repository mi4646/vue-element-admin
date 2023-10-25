<!-- 文章列表页面头部批量按钮  -->
<template>
  <div style="margin-left: auto">
    <el-select
      v-model="categoryId"
      clearable
      size="small"
      filterable
      placeholder="请选择分类"
      style="margin-right: 1rem; width: 180px"
    >
      <el-option label="全部" value="" selected />
      <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-select
      v-model="tagId"
      clearable
      size="small"
      filterable
      placeholder="请选择标签"
      style="margin-right: 1rem; width: 180px"
    >
      <el-option label="全部" value="" />
      <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-input
      v-model="keywords"
      clearable
      prefix-icon="el-icon-search"
      size="small"
      placeholder="请输入文章名"
      style="width: 200px"
      @keyup.enter.native="searchArticles"
    />
    <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 1rem" @click="searchArticles">
      搜索
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'HeadButton',
  components: {},
  props: {
    // 爷组件传递的分类列表
    categories: {
      type: Array,
      default() {
        return []
      }
    },
    // 爷组件传递的标签列表
    tags: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tagId: '',
      keywords: null,
      categoryId: ''
    }
  },
  watch: {
    categoryId() {
      this.$parent.$parent.$parent.current = 1
      this.$parent.$parent.$parent.categoryId = this.categoryId
      this.$parent.$parent.$parent.listArticles()
    },
    tagId() {
      this.$parent.$parent.$parent.current = 1
      this.$parent.$parent.$parent.tagId = this.tagId
      this.$parent.$parent.$parent.listArticles()
    },
    keywords() {
      if (!this.keywords) {
        this.searchArticles()
      }
    }

  },
  methods: {
    // 搜索
    searchArticles() {
      this.$parent.$parent.$parent.current = 1
      this.$parent.$parent.$parent.keywords = this.keywords
      this.$parent.$parent.$parent.listArticles()
    }
  }
}
</script>

<style  scoped>

</style>
