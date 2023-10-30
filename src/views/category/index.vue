<template>
  <el-card class="main-card">
    <!-- 顶部搜索/button按钮 -->
    <div class="operation-container">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openModel(null)"> 新增 </el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="this.categoryIds.length == 0"
        @click="isDelete = true"
      >
        批量删除
      </el-button>
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          clearable
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入分类名"
          style="width: 200px"
          @keyup.enter.native="searchCategories"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left: 1rem"
          @click="searchCategories"
        >
          搜索
        </el-button>
      </div>
    </div>
    <el-dialog :visible.sync="isDelete" width="30%">
      <div slot="title" class="dialog-title-container"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
      <div style="font-size: 1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteCategory(null)"> 确 定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="addOrEdit" width="30%">
      <div slot="title" ref="categoryTitle" class="dialog-title-container" />
      <el-form label-width="80px" size="medium" :model="categoryForm">
        <el-form-item label="分类名">
          <el-input v-model="categoryForm.name" style="width: 220px" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="categoryForm.desc" style="width: 220px" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCategory"> 确 定 </el-button>
      </div>
    </el-dialog>

    <!-- table表格 -->
    <el-table v-loading="loading" :data="categories" @selection-change="selectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="index" label="序号" width="80" align="center">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(current-1)*size }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.create_date | date }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="分类名" width="300" align="center">
        <template slot-scope="scope">
          <el-tag type="success">
            {{ scope.row.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="articleCount" label="文章量" width="200" align="center" />
      <el-table-column prop="desc" label="描述" width="500" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openModel(scope.row)"> 编辑 </el-button>
          <el-popconfirm title="确定删除吗？" style="margin-left: 1rem" @onConfirm="deleteCategory(scope.row.id)">
            <el-button slot="reference" size="mini" type="danger"> 删除 </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

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
import { catesList, catesCreate, catesUpdate, catesDelete } from '@/api/category'
export default {
  data: function() {
    return {
      isDelete: false,
      loading: true,
      addOrEdit: false,
      keywords: null,
      categoryIds: [],
      categories: [],
      categoryForm: {
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
        this.searchCategories()
      }
    }
  },
  created() {
    this.current = 1
    this.listCategories()
    this.loading = false
  },
  methods: {
    selectionChange(categories) {
      this.categoryIds = []
      categories.forEach((item) => {
        this.categoryIds.push(item.id)
      })
    },
    searchCategories() {
      this.current = 1
      this.listCategories()
    },
    sizeChange(size) {
      this.size = size
      this.listCategories()
    },
    currentChange(current) {
      this.current = current
      this.listCategories()
    },
    // 分类列表
    listCategories() {
      const params = {
        page: this.current,
        p_size: this.size,
        name: this.keywords
      }
      catesList(params).then((response) => {
        this.categories = response.data
        this.count = response.total_count
        this.loading = false
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    // 分类删除
    deleteCategory(id) {
      console.log('点击了删除', id)
      let params = {}
      if (id == null) {
        params = { ids: this.categoryIds }
      } else {
        params = { ids: [id] }
      }
      catesDelete(params).then((response) => {
        if (response.code === 0) {
          this.listCategories()
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      }).finally(() => {
        this.isDelete = false
      })
    },
    openModel(category) {
      if (category != null) {
        this.categoryForm = JSON.parse(JSON.stringify(category))
        this.$refs.categoryTitle.innerHTML = '修改分类'
      } else {
        this.categoryForm.id = null
        this.categoryForm.name = ''
        this.categoryForm.desc = ''
        this.$refs.categoryTitle.innerHTML = '添加分类'
      }
      this.addOrEdit = true
    },
    // 分类添加/修改
    addOrEditCategory() {
      if (this.categoryForm.name.trim() === '') {
        this.$message.error('分类名不能为空')
        return false
      }
      const method = this.categoryForm.id ? catesUpdate : catesCreate
      method(this.categoryForm).then((response) => {
        if (response.code === 0) {
          this.listCategories()
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
