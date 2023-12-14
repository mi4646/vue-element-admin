<!-- 文章发布对话框 -->
<template>
  <el-dialog
    :visible.sync="dialogTableVisible"
    :before-close="cancel"
    width="40%"
    top="3vh"
    style="margin-top: 5%;"
  >
    <div slot="title" class="dialog-title-container">发布文章</div>
    <el-form label-width="80px" size="medium" :model="articleProp">
      <el-form-item label="文章分类">
        <el-tag
          v-show="articleProp.cate_name"
          type="success"
          style="margin: 0 1rem 0 0"
          :closable="true"
          @close="removeCategory"
        >
          {{ articleProp.cate_name }}
        </el-tag>

        <el-popover v-if="!articleProp.cate_name" placement="bottom-start" width="460" trigger="click">
          <div class="popover-title">分类</div>
          <el-autocomplete
            v-model="cate_name"
            style="width: 100%"
            :fetch-suggestions="searchCategories"
            placeholder="请输入分类名搜索, enter可添加自定义分类"
            :trigger-on-focus="false"
            @keyup.enter.native="saveCategory"
            @select="handleSelectCategories"
          >
            <template slot-scope="{ item }">
              <div>{{ item.name }}</div>
            </template>
          </el-autocomplete>
          <div class="popover-container">
            <div v-for="item of categorys" :key="item.id" class="category-item" @click="addCategory(item)">
              {{ item.name }}
            </div>
          </div>
          <el-button slot="reference" type="success" plain size="small"> 添加分类 </el-button>
        </el-popover>
      </el-form-item>

      <el-form-item label="文章标签">
        <el-tag
          v-for="(item, index) of articleProp.tags"
          :key="index"
          style="margin: 0 1rem 0 0"
          :closable="true"
          @close="removeTag(item)"
        >
          <span v-if="item.name">{{ item.name }}</span>
          <span v-else>{{ item }}</span>
        </el-tag>

        <el-popover
          v-if="articleProp.tags.length < 4"
          width="460"
          trigger="click"
          placement="top-start"
          :append-to-body="false"
        >
          <div class="popover-title">标签</div>
          <el-autocomplete
            v-model="tagName"
            style="width: 100%"
            placeholder="请输入标签名搜索, enter可添加自定义标签"
            :fetch-suggestions="searchTags"
            :trigger-on-focus="false"
            @keyup.enter.native="saveTag"
            @select="handleSelectTag"
          >
            <template slot-scope="{ item }">
              <div>{{ item.name }}</div>
            </template>
          </el-autocomplete>
          <div class="popover-container">
            <div style="margin-bottom: 1rem">添加标签</div>
            <el-tag v-for="(item, index) of tagList" :key="index" :class="tagClass(item)" @click="addTag(item)">
              {{ item.name }}
            </el-tag>
          </div>
          <el-button slot="reference" type="primary" plain size="small"> 添加标签 </el-button>
        </el-popover>
      </el-form-item>

      <el-form-item label="置顶">
        <el-switch
          v-model="articleProp.is_top"
          active-color="#13ce66"
          inactive-color="#F4F4F5"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>

      <el-form-item label="推荐">
        <el-switch
          v-model="articleProp.is_essence"
          active-color="#13ce66"
          inactive-color="#F4F4F5"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>

      <el-form-item label="访问权限">
        <el-radio-group v-model="publicStatus">
          <el-radio :label="1">公开</el-radio>
          <el-radio :label="4">私密</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>
    <div slot="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="danger" @click="saveOrUpdateArticle"> 发 布 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postsCreate, postsUpdate } from '@/api/article'
import { catesList } from '@/api/category'
import { tagsList } from '@/api/tags'

export default {
  name: 'DialogTable',
  components: {},
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false
    },
    articleProp: {
      type: Object,
      default() {
        return {
          id: null,
          title: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
          content: '',
          articleCover: '',
          cate_name: null,
          tags: [],
          is_top: 0,
          type: 1,
          status: 1
        }
      }
    }

  },
  data() {
    return {
      cate_name: '',
      tagName: '',
      tag_ids: [],
      tagList: [],
      categorys: []
    }
  },
  computed: {
    // 给标签选择框动态绑定不可选中class
    tagClass() {
      return function(item) {
        const exists = this.articleProp.tags.some(i => i.id === item.id)
        return exists ? 'tag-item-select' : 'tag-item'
      }
    },
    publicStatus: {
      get() {
        if (this.articleProp.status === 2) {
          return 1
        } else {
          return this.articleProp.status
        }
      },
      set(value) {
        this.articleProp.status = value
      }
    }
  },
  watch: {
    dialogTableVisible(value) {
      if (value === true) {
        this.listTags()
        this.listCategories()
      }
    }
  },
  created() {
    this.tag_ids = this.articleProp.tags.map(item => item.id)
  },
  methods: {
    // 发布按钮点击事件
    saveOrUpdateArticle() {
      if (this.articleProp.title.trim() === '') {
        this.$message.error('文章标题不能为空')
        return false
      }
      if (this.articleProp.content.trim() === '') {
        this.$message.error('文章内容不能为空')
        return false
      }

      const method = this.articleProp.id ? postsUpdate : postsCreate

      const param = {
        status: this.articleProp.status,
        slug: this.articleProp.slug,
        cate: this.articleProp.cate,
        title: this.articleProp.title,
        is_top: this.articleProp.is_top,
        tag: this.tag_ids,
        content: this.articleProp.content,
        is_essence: this.articleProp.is_essence
      }
      const articleId = this.$route.params.id
      if (articleId) {
        param.id = articleId
      }
      method(param).then((response) => {
        if (response.code === 0) {
          this.$router.push({ path: '/article-list' })
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      }).finally(() => {
        this.cancel()
      })
    },
    // 取消点击事件
    cancel() {
      this.$parent.$parent.dialogTableVisible = false
    },
    // 分类列表
    listCategories() {
      catesList().then((response) => {
        if (response.code === 0) {
          this.categorys = response.data
        } else {
          this.$message.error({ title: '失败', message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ title: '失败', message: error })
      })
    },
    // 搜索分类
    searchCategories(keywords, cb) {
      const params = {
        name: keywords
      }
      catesList(params).then((response) => {
        if (response.code === 0) {
          cb(response.data)
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    handleSelectCategories(item) {
      this.addCategory(item)
    },
    saveCategory() {
      if (this.cate_name.trim() !== '') {
        this.addCategory({
          name: this.cate_name
        })
        this.cate_name = ''
      }
    },
    addCategory(item) {
      this.articleProp.cate_name = item.name
      this.articleProp.cate = item.id
    },
    removeCategory() {
      this.articleProp.cate_name = null
      this.articleProp.cate = null
    },
    // 标签列表
    listTags() {
      tagsList().then((response) => {
        if (response.code === 0) {
          this.tagList = response.data
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    // 标签搜索
    searchTags(keywords, cb) {
      const params = {
        name: keywords
      }
      tagsList(params).then((response) => {
        if (response.code === 0) {
          cb(response.data)
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    handleSelectTag(item) {
      this.addTag(item)
    },
    saveTag() {
      if (this.tagName.trim() !== '') {
        this.addTag({ name: this.tagName })
        this.tagName = ''
      }
    },
    addTag(item) {
      this.articleProp.tags.push(item)
      this.tag_ids.push(item.id)
    },
    removeTag(item) {
      const tagsIndex = this.articleProp.tags.indexOf(item)
      const tagId = item.id

      if (tagsIndex !== -1) {
        this.articleProp.tags.splice(tagsIndex, 1)
      }

      //  this.tag_ids.filter(item => item !== tagId)
      const index = this.tag_ids.indexOf(tagId)
      if (index > -1) {
        this.tag_ids.splice(index, 1)
      }
    }
  }
}
</script>

<style  scoped>

.tag-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.tag-item-select {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: not-allowed;
  color: #ccccd8 !important;
}
.category-item {
  cursor: pointer;
  padding: 0.6rem 0.5rem;
}

.category-item:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}
.popover-title {
  margin-bottom: 1rem;
  text-align: center;
}

.popover-container {
  margin-top: 1rem;
  height: 260px;
  overflow-y: auto;
}
</style>
