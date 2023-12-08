<!--  -->
<template>
  <div>
    <div class="operation-container">
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="articleIds.length == 0"
        @click="isDelete === 0 ? updateIsDelete = true : remove = true"
      >
        批量删除
      </el-button>

      <el-button
        v-if="isDelete == 1"
        type="success"
        size="small"
        icon="el-icon-upload"
        :disabled="articleIds.length == 0"
        @click="updateIsRestore = true"
      >
        批量恢复
      </el-button>

      <el-button
        type="success"
        size="small"
        icon="el-icon-download"
        :disabled="articleIds.length == 0"
        style="margin-right: 1rem"
        @click="isExport = true"
      >
        批量导出
      </el-button>

      <el-upload
        action="/api/admin/articles/import"
        multiple
        :limit="9"
        :show-file-list="false"
        :headers="uploadHeaders"
        :on-success="uploadArticle"
      >
        <el-button type="primary" size="small" icon="el-icon-upload"> 批量导入 </el-button>
      </el-upload>

      <!-- 确认弹框 -->
      <el-dialog :visible.sync="updateIsDelete" width="30%">
        <div slot="title" class="dialog-title-container"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
        <div style="font-size: 1rem">是否删除选中项？</div>
        <div slot="footer">
          <el-button @click="updateIsDelete = false">取 消</el-button>
          <el-button type="primary" @click="updateArticleDelete(null, 0)"> 确 定 </el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="remove" width="30%">
        <div slot="title" class="dialog-title-container"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
        <div style="font-size: 1rem">是否彻底删除选中项？</div>
        <div slot="footer">
          <el-button @click="remove = false">取 消</el-button>
          <el-button type="primary" @click="deleteArticles(null, 1)"> 确 定 </el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="updateIsRestore" width="30%">
        <div slot="title" class="dialog-title-container"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
        <div style="font-size: 1rem">是否恢复选中项？</div>
        <div slot="footer">
          <el-button @click="updateIsRestore = false">取 消</el-button>
          <el-button type="primary" @click="updateArticleDelete(null, 1)"> 确 定 </el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="isExport" width="30%">
        <div slot="title" class="dialog-title-container"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
        <div style="font-size: 1rem">是否导出选中文章？</div>
        <div slot="footer">
          <el-button @click="isExport = false">取 消</el-button>
          <el-button type="primary" @click="exportArticles(null)"> 确 定 </el-button>
        </div>
      </el-dialog>

      <!-- 搜索框 -->
      <head-button v-bind="$attrs" />

    </div>

    <el-table
      stripe
      :data="articlesList"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="index" label="序号" width="80" align="center">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(current-1)*size }}
        </template>
      </el-table-column>
      <el-table-column
        prop="create_date"
        label="创建时间"
        width="250"
        align="center"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.create_date | dateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="300" align="center" />
      <el-table-column prop="cate__name" label="分类" width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cate__name" type="success">{{ scope.row.cate__name }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="tags" label="标签" width="200" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item of scope.row.tags" :key="item.id" style="margin-right: 0.2rem; margin-top: 0.2rem">
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="read_count" label="浏览量" width="70" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.read_count">
            {{ scope.row.read_count }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="word_number" label="字数" width="70" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.word_number">
            {{ scope.row.word_number }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="word_number" label="评论" width="70" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.word_number">
            <el-badge value="1" style="margin-top: 10px;" />
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_top" label="置顶" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_top"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :disabled="scope.row.isDelete == 1"
            :active-value="1"
            :inactive-value="0"
            @change="changeTopAndFeatured(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="is_essence" label="推荐" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_essence"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :disabled="scope.row.isDelete == 1"
            :active-value="1"
            :inactive-value="0"
            @change="changeTopAndFeatured(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDelete == 0" type="primary" size="mini" @click="editArticle(scope.row.id)">
            编辑
          </el-button>
          <el-popconfirm
            v-if="scope.row.isDelete == 0"
            title="确定要移动到回收站吗？"
            style="margin-left: 10px"
            @onConfirm="updateArticleDelete(scope.row.id, scope.row.isDelete)"
          >
            <template #reference>
              <el-button
                slot="reference"
                size="mini"
                type="danger"
              > 删除 </el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            v-if="scope.row.isDelete == 1"
            title="确定恢复吗？"
            @onConfirm="updateArticleDelete(scope.row.id, scope.row.isDelete)"
          >
            <el-button
              slot="reference"
              size="mini"
              type="success"
            > 恢复 </el-button>
          </el-popconfirm>

          <el-popconfirm
            v-if="scope.row.isDelete == 1"
            style="margin-left: 10px"
            title="确定彻底删除吗？"
            @onConfirm="deleteArticles(scope.row.id)"
          >
            <el-buttonPostsUpdate
              slot="reference"
              size="mini"
              type="danger"
            > 删除 </el-buttonPostsUpdate>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import HeadButton from './HeadButton.vue'

import { postsUpdate, postsDelete } from '@/api/article'
export default {
  name: 'ArticleTable',
  components: {
    HeadButton
  },
  props: {

    isDelete: {
      type: Number,
      default: 0
    },
    current: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 10
    },
    // 文章列表数据
    articlesList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      uploadHeaders: { Authorization: 'Bearer ' + sessionStorage.getItem('token') },
      articleIds: [],
      updateIsDelete: false,
      updateIsRestore: false,
      remove: false,
      isExport: false,
      keywords: null,
      categoryId: '',
      tagId: ''
    }
  },
  methods: {
    // 多选框
    selectionChange(articles) {
      this.articleIds = []
      articles.forEach((item) => { this.articleIds.push(item.id) })
    },
    // 批量导出
    exportArticles(id) {
      console.log('点击了批量导出')
      this.isExport = false
    },
    // 批量导入
    uploadArticle(data) {
      console('点击了批量导入')
    },
    // 修改文章的状态
    updateArticleDelete(id, isDelete) {
      const param = {}
      if (id != null) {
        param.ids = [id]
      } else {
        param.ids = this.articleIds
      }
      param.status = isDelete === 0 ? 3 : 2
      postsUpdate(param).then((response) => {
        if (response.code === 0) {
          this.$parent.$parent.listArticles()
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      }).finally(() => {
        this.updateIsDelete = false
        this.updateIsRestore = false
      })
    },
    // 文章编辑 跳转到编辑页面
    editArticle(id) {
      this.$router.push(`/article-editor/${id}/`)
    },
    // 文章彻底删除
    deleteArticles(id) {
      let params = {}
      if (id == null) {
        params = { ids: this.articleIds }
      } else {
        params = { ids: [id] }
      }
      postsDelete(params).then((response) => {
        if (response.code === 0) {
          this.$parent.$parent.listArticles()
        } else {
          this.$message.error({ title: '失败', message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ title: '失败', message: error })
      }).finally(() => {
        this.remove = false
      })
    },
    // 修改文章置顶或推荐
    changeTopAndFeatured(article) {
      const params = {}
      params.ids = [article.id]
      params.is_top = article.is_top
      params.is_essence = article.is_essence
      postsUpdate(params).then((response) => {
        if (response.code === 0) {
          this.$parent.$parent.listArticles()
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      }).finally(() => {
        this.remove = false
      })
    }
  }
}
</script>

<style  scoped>
.operation-container {
  margin-top: 1.1rem;
}
</style>
