<template>
  <el-card class="main-card">
    <div class="operation-container">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openModel(null)"> 新增 </el-button>
      <el-button type="danger" size="small" icon="el-icon-delete" :disabled="tagIds.length == 0" @click="isDelete = true">
        批量删除
      </el-button>
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          clearable
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入标签名"
          style="width: 200px"
          @keyup.enter.native="searchTags"
        />
        <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 1rem" @click="searchTags">
          搜索
        </el-button>
      </div>
    </div>

    <!-- table表格 -->
    <el-table stripe :data="tags" @selection-change="selectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="index" label="序号" width="100" align="center">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(current-1)*size }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="250" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.create_date | dateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="name" width="300" label="标签名" align="center">
        <template slot-scope="scope">
          <el-tag>
            {{ scope.row.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="标签描述" width="350" align="center" />
      <el-table-column prop="articleCount" width="200" label="文章量" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openModel(scope.row)"> 编辑 </el-button>
          <el-popconfirm title="确定删除吗？" style="margin-left: 1rem" @onConfirm="deleteTag(scope.row.id)">
            <el-button slot="reference" size="mini" type="danger"> 删除 </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="isDelete" width="30%">
      <div slot="title" class="dialog-title-container"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
      <div style="font-size: 1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteTag(null)"> 确 定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="addOrEdit" width="30%">
      <div slot="title" ref="tagTitle" class="dialog-title-container" />
      <el-form label-width="80px" size="medium" :model="tagForm">
        <el-form-item label="标签名">
          <el-input v-model="tagForm.name" style="width: 220px" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="tagForm.desc" style="width: 220px" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditTag"> 确 定 </el-button>
      </div>
    </el-dialog>

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
import { tagsList, tagsCreate, tasUpdate, tagsDelete } from '@/api/tags'

export default {
  data: function() {
    return {
      isDelete: false,
      addOrEdit: false,
      keywords: null,
      tags: [],
      tagIds: [],
      tagForm: {
        id: null,
        name: '',
        desc: ''
      },
      current: 1,
      size: 10,
      count: 0
    }
  },
  watch: {
    keywords() {
      if (!this.keywords) {
        this.searchTags()
      }
    }
  },
  created() {
    this.listTags()
  },
  methods: {
    selectionChange(tags) {
      this.tagIds = []
      tags.forEach((item) => {
        this.tagIds.push(item.id)
      })
    },
    searchTags() {
      this.current = 1
      this.listTags()
    },
    sizeChange(size) {
      this.size = size
      this.listTags()
    },
    currentChange(current) {
      this.current = current
      this.listTags()
    },
    // 标签列表
    listTags() {
      const params = {
        page: this.current,
        p_size: this.size,
        name: this.keywords
      }
      tagsList(params).then((response) => {
        if (response.code === 0) {
          this.tags = response.data
          this.count = response.total_count
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    // 标签删除
    deleteTag(id) {
      var params = {}
      if (id == null) {
        params = { ids: this.tagIds }
      } else {
        params = { ids: [id] }
      }
      tagsDelete(params).then((response) => {
        if (response.code === 0) {
          this.listTags()
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      }).finally(() => {
        this.isDelete = false
      })
    },
    openModel(tag) {
      if (tag != null) {
        this.tagForm = JSON.parse(JSON.stringify(tag))
        this.$refs.tagTitle.innerHTML = '修改标签'
      } else {
        this.tagForm.id = null
        this.tagForm.name = ''
        this.tagForm.desc = ''
        this.$refs.tagTitle.innerHTML = '添加标签'
      }
      this.addOrEdit = true
    },
    // 标签添加/修改
    addOrEditTag() {
      if (this.tagForm.name.trim() === '') {
        this.$message.error('标签名不能为空')
        return false
      }
      const method = this.tagForm.id ? tasUpdate : tagsCreate
      const { id, name, desc } = this.tagForm
      method({ id, name, desc }).then((response) => {
        if (response.code === 0) {
          this.listTags()
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      }).finally(() => {
        this.addOrEdit = false
      })
    }
  }
}
</script>
