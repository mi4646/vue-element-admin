<template>
  <el-card>
    <!-- 文章标签页 -->
    <el-tabs v-model="activeName" class="article-status-menu" type="card" @tab-click="handleClick">
      <el-tab-pane name="all">
        <template #label>全部</template>
        <span slot="label">全部</span>
      </el-tab-pane>
      <el-tab-pane name="public">
        <template #label>已发布</template>
        <span slot="label">已发布</span>
      </el-tab-pane>
      <el-tab-pane name="draft">
        <template #label>草稿箱</template>
        <span slot="label">草稿箱</span>
      </el-tab-pane>
      <el-tab-pane name="delete">
        <template #label>回收站</template>
        <span slot="label">回收站</span>
      </el-tab-pane>
      <el-tab-pane name="private">
        <template #label>私密</template>
        <span slot="label">私密</span>
      </el-tab-pane>
    </el-tabs>

    <!-- 文章列表表格组件  class="nav-left"-->
    <article-table
      :loading="loading"
      :articles-list="articlesList"
      :is-delete="isDelete"
      :categories="categories"
      :tags="tags"
    />

    <!-- 分页组件 -->
    <el-pagination
      class="pagination-container"
      background
      :current-page="current"
      :page-size="size"
      :total="count"
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChange"
      @current-change="currentChange"
    />

  </el-card>
</template>

<script>
import ArticleTable from './components/ArticleTable.vue'
import { PostsList, CatesList, TagsList } from '@/api/article'

export default {
  components: {
    ArticleTable
  },
  data: function() {
    return {
      loading: true,
      activeName: 'all',
      articlesList: [],
      tags: [],
      categories: [],
      keywords: null,
      type: null,
      isDelete: 0,
      tagId: '',
      categoryId: '',
      status: null,
      current: 1,
      size: 10,
      count: 0
    }
  },
  watch: {
    type() {
      this.current = 1
      this.listArticles()
    },
    status() {
      this.current = 1
      this.listArticles()
    }
  },
  created() {
    this.listTags()
    this.listArticles()
    this.listCategories()
  },
  methods: {
    // 文章列表接口
    listArticles() {
      PostsList(
        {
          page: this.current,
          p_size: this.size,
          keywords: this.keywords,
          cate: this.categoryId,
          status: this.status,
          tag: this.tagId,
          type: this.type
        }
      ).then((response) => {
        if (response.code === 0) {
          this.articlesList = response.data
          this.count = response.total_count
        } else {
          this.$message.error({ message: response.message })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      }).finally(() => {
        this.loading = false
      })
    },
    // 切换标签
    handleClick(tab) {
      switch (tab.name) {
        case 'all':
          this.isDelete = 0
          this.status = null
          break
        case 'public':
          this.isDelete = 0
          this.status = 1
          break
        case 'private':
          this.isDelete = 0
          this.status = 4
          break
        case 'draft':
          this.isDelete = 0
          this.status = 2
          break
        case 'delete':
          this.isDelete = 1
          this.status = 3
          break
      }
      this.current = 1
      this.activeStatus = tab.name
    },
    sizeChange(size) {
      this.size = size
      this.listArticles()
    },
    currentChange(current) {
      this.current = current
      this.listArticles()
    },
    // 分类列表
    listCategories() {
      CatesList().then((response) => {
        if (response.code === 0) {
          this.categories = response.data
        } else {
          this.$message.error({ message: response.message })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    // 标签列表
    listTags() {
      TagsList().then((response) => {
        if (response.code === 0) {
          this.tags = response.data
        } else {
          this.$message.error({ message: response.message })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    }
  }
}
</script>

<style scoped>

.article-status-menu {
  font-size: 14px;
  margin-top: 20px;
  color: #999;
}

.article-status-menu span {
  margin-right: 24px;
}

.status {
  cursor: pointer;
}

.active-status {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}

.article-cover {
  position: relative;
  width: 100%;
  height: 90px;
  border-radius: 4px;
}

.article-cover::after {
  content: '';
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.article-status-icon {
  color: #fff;
  font-size: 1.5rem;
  position: absolute;
  right: 1rem;
  bottom: 1.4rem;
}
</style>
