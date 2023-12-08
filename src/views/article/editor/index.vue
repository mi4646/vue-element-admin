<template>
  <el-card class="main-card">
    <div class="article-title-container">
      <el-input v-model="article.title" size="medium" placeholder="输入文章标题" />
      <el-button
        v-if="article.id == null || article.status == 2"
        type="danger"
        size="medium"
        class="save-btn"
        @click="saveArticleDraft"
      >
        保存草稿
      </el-button>
      <el-button type="danger" size="medium" style="margin-left: 10px" @click="releaseArticle"> 发布文章 </el-button>
    </div>

    <!-- 富文本组件 -->
    <mavon-editor
      v-if="!loading"
      ref="md"
      v-model="article.content"
      :font-size="option.fontSize"
      :code-style="option.codeStyle"
      :toolbars="option.toolbars"
      style="height: calc(100vh - 260px)"
      @save="save"
      @imgAdd="uploadImg"
      @change="handleChange"
    />

    <!-- 对话框 v-if="article.id"-->
    <dialog-table
      :article="article"
      :dialog-table-visible="dialogTableVisible"
    />
  </el-card>
</template>

<script>
import { postsCreate, uploadAccessory, fetchPostsInfo } from '@/api/article'
import DialogTable from './components/DialogTable.vue'
import { getArticleIdFromPath } from '@/utils/index'
import * as imageConversion from 'image-conversion'
import { mavonEditorConfig } from '@/config/mavonEditor'
import { mapGetters } from 'vuex'

export default {
  components: { DialogTable },
  data: function() {
    return {
      option: { ...mavonEditorConfig }, // mavonEditor的相关配置
      dialogTableVisible: false,
      autoSave: true,
      cate_name: '',
      tagName: '',
      categorys: [],
      tagList: [],
      cate: null,
      article: {
        id: null,
        title: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
        content: '',
        articleCover: '',
        cate_name: null,
        tags: [],
        is_top: 0,
        type: 1,
        status: 2
      },
      html: ''
    }
  },
  computed: {
    ...mapGetters([
      'loading'
    ])
  },
  created() {
    const articleId = getArticleIdFromPath(this.$route)
    if (articleId && ['*', ':id', 'article-editor'].indexOf(articleId) === -1) {
      fetchPostsInfo(articleId, {}).then((response) => {
        if (!response.code) {
          this.article = response.data
          console.log(this.article, 'article')
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    } else {
      console.log('使用ctrl+s保存在浏览器的数据')
    }
  },
  methods: {
    // 文章保存为草稿
    saveArticleDraft() {
      if (this.article.title.trim() === '') {
        this.$message.error('文章标题不能为空')
        return false
      }
      if (this.article.content.trim() === '') {
        this.$message.error('文章内容不能为空')
        return false
      }
      this.article.status = 2
      postsCreate(this.article).then((response) => {
        if (response.code === 0) {
          this.$router.push({ path: '/article-list' })
          this.$message.success({ message: '保存草稿成功' })
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    // 文章发布
    releaseArticle() {
      if (this.article.title.trim() === '') {
        this.$message.error('文章标题不能为空')
        return false
      }
      if (this.article.content.trim() === '') {
        this.$message.error('文章内容不能为空')
        return false
      }
      this.dialogTableVisible = true
    },
    // 上传图片
    uploadImg(pos, file) {
      /*
      判断上传的图片大小是否大于200KB，如果大于使用imageConversion的图片压缩上传
      */
      var UPLOAD_SIZE = 200
      var formData = new FormData()
      if (file.size / 1024 < UPLOAD_SIZE) {
        formData.append('file', file)
        uploadAccessory(formData).then((response) => {
          this.$refs.md.$img2Url(pos, response.data)
        }).catch(error => {
          this.$message.error({ message: error })
        })
      } else {
        imageConversion.compressAccurately(file, UPLOAD_SIZE).then((res) => {
          formData.append('file', new window.File([res], file.name, { type: file.type }))
          uploadAccessory(formData).then((response) => {
            this.$refs.md.$img2Url(pos, window.config.host + response.data.image)
          }).catch(error => {
            this.$message.error({ message: error })
          })
        })
      }
    },
    // 编辑区发生变化的回调事件
    handleChange(value, render) {
      // render 为 markdown 解析后的结果
      this.html = render
    },
    // 保存的时候的事件
    save(e) {
      const loading = this.$loading({
        lock: true,
        text: '正在保存....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        this.$message({ showClose: true, type: 'success', message: '保存成功', duration: 1500 })
        loading.close()
      }, 1000)
      console.log('ctrl+s', e)
    }
  }
}
</script>

<style scoped>

.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 1.5rem;
}

.save-btn {
  margin-left: 0.75rem;
  background: #fff;
  color: #f56c6c;
}

</style>
