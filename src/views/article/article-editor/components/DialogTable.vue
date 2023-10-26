<!-- 文章发布对话框 -->
<template>
  <el-dialog :visible.sync="dialogTableVisible" width="40%" top="3vh">
    <div slot="title" class="dialog-title-container">发布文章</div>
    <el-form label-width="80px" size="medium" :model="article">
      <el-form-item label="文章分类">
        <el-tag
          v-show="article.cate_name"
          type="success"
          style="margin: 0 1rem 0 0"
          :closable="true"
          @close="removeCategory"
        >
          {{ article.cate_name }}
        </el-tag>

        <el-popover v-if="!article.cate_name" placement="bottom-start" width="460" trigger="click">
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
          v-for="(item, index) of article.tags"
          :key="index"
          style="margin: 0 1rem 0 0"
          :closable="true"
          @close="removeTag(item)"
        >
          {{ item }}
        </el-tag>
        <el-popover v-if="article.tags.length < 3" placement="bottom-start" width="460" trigger="click">
          <div class="popover-title">标签</div>
          <el-autocomplete
            v-model="tagName"
            style="width: 100%"
            :fetch-suggestions="searchTags"
            placeholder="请输入标签名搜索, enter可添加自定义标签"
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
          v-model="article.is_top"
          active-color="#13ce66"
          inactive-color="#F4F4F5"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>

      <el-form-item label="推荐">
        <el-switch
          v-model="article.is_essence"
          active-color="#13ce66"
          inactive-color="#F4F4F5"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>

      <el-form-item label="发布形式">
        <el-radio-group v-model="article.status">
          <el-radio :label="1">公开</el-radio>
          <el-radio :label="2">私密</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>
    <div slot="footer">
      <el-button @click="addOrEdit = false">取 消</el-button>
      <el-button type="danger" @click="saveOrUpdateArticle"> 发 表 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogTable',
  components: {},
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false
    },
    article: {
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
          status: 2
        }
      }
    }
  },
  data() {
    return {
      cate_name: '',
      tagName: '',
      tagList: [],
      categorys: []
    }
  },
  methods: {
    removeCategory() {

    },
    searchCategories() {

    },
    handleSelectCategories() {

    },
    searchTags() {

    },
    saveOrUpdateArticle() {

    },
    handleSelectTag() {

    }
  }
}
</script>

<style  scoped>

</style>
