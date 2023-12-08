
<!--
Vue+Element el-table树复选框，半选全选：https://juejin.cn/post/7130062866412994591
 -->
<template>
  <el-card class="main-card">
    <!-- 顶部搜索/button按钮 -->
    <div class="operation-container">
      <el-button
        :disabled="categoryIds.length != 0"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="openModel(null)"
      > 新增 </el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="categoryIds.length == 0"
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
    <el-dialog :visible.sync="addOrEdit" width="35%">
      <div slot="title" ref="categoryTitle" class="dialog-title-container" />
      <el-form label-width="100px" size="medium" :model="categoryForm">
        <el-form-item label="名称">
          <el-input v-model="categoryForm.name" style="width: 220px" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="categoryForm.desc" style="width: 220px" />
        </el-form-item>

        <div
          v-for="item in categoryOptions"
          :key="item.id"
        >
          <el-form-item v-if="item.name === categoryForm.name" label="父类别">
            <el-select
              v-model="categoryForm.cate"
              size="medium"
              clearable
              filterable
              placeholder="选择分类父类别,可搜索"
              style="width: 220px;"
            >
              <el-option
                v-for="i in categoryOptions"
                :key="i.id"
                :label="i.name"
                :value="i.id"
                :disabled="addOrEdit && i.name === categoryForm.name"
              />
            </el-select>
          </el-form-item>

          <!-- <el-form-item
            v-if="item.name === categoryForm.name && item.subClassification.length >0"
            label="是否清空子分类"
          >
            <template slot="label" slot-scope="{}">
              <span>清空子分类</span>
              <el-tooltip class="item" effect="dark" placement="top">
                <i class="el-icon-question" style="font-size: 14px; vertical-align: middle;" />
                <div slot="content">
                  如果当前修改的分类id是父分类,<br>是否是把当前分类下的所有分类<br>绑定新的分类，还是清空分类的<br>状态再绑定
                </div>
              </el-tooltip>
            </template>
            <el-radio-group v-model="clearParent">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </div>

      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCategory"> 确 定 </el-button>
      </div>
    </el-dialog>

    <!-- table表格 -->
    <el-table
      ref="tableRef"
      node-click
      show-checkbox
      default-expand-all
      row-key="id"
      :indent="0"
      :data="categories"
      :row-class-name="tableRowClassName"
      select-on-indeterminate=""
      :tree-props="{children: 'children'}"
      @select-all="selectChangeAll"
    >
      <el-table-column
        type="selection"
        align="center"
        width="50px"
      >
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.IsClick"
            :indeterminate="scope.row.isIndeterminate"
            @change="handleCheckrow(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="index" label="序号" width="80" align="center">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(current-1)*size }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.create_date | dateTime }}
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
  data() {
    return {
      // clearParentVisible: false,
      categoryOptions: [],
      categorys: [],
      isDelete: false,
      addOrEdit: false,
      keywords: null,
      categoryIds: [],
      categories: [],
      categoryForm: {
        id: null,
        name: '',
        desc: '',
        cate: '',
        subClassification: []
      },
      current: 1,
      size: 10,
      count: 0,
      // clearParent: 'false',

      menuIds: [], // 选中数据的ids 做回显用
      selectAllClick: false, // table的全选
      dataArray: [], // 储存的全部数据
      isAllClick: null // 全选还是全不选
    }
  },
  watch: {
    keywords() {
      if (!this.keywords) {
        this.searchCategories()
      }
    }
    // clearParent(v) {
    //   if (v === 'true') {
    //     this.clearParentVisible = true
    //   }
    // }
  },
  created() {
    this.current = 1
    this.listCategories()
  },
  methods: {
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
    // 根据不同的类型添加不同的背景色
    tableRowClassName({ row }) {
      if (row.children.length > 0) {
        return 'warning-row'
        // return 'success-row'
      }
      return ''
    },
    // 分类列表
    listCategories() {
      const params = {
        page: this.current,
        p_size: this.size,
        name: this.keywords,
        tree: 1
      }
      catesList(params).then((response) => {
        if (response.code === 0) {
          this.categories = response.data
          this.categoryOptions = this.flattenTree(response.data)
          console.log('this.categoryOptions ', this.categoryOptions)
          this.count = response.total_count
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    // 分类删除
    deleteCategory(id) {
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
        this.categoryForm.clearParent = this.clearParent
        this.$refs.categoryTitle.innerHTML = '修改分类'
      } else {
        this.categoryForm.id = null
        this.categoryForm.name = ''
        this.categoryForm.desc = ''
        this.categoryForm.cate = ''
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
    },
    // 把分类tree组成数组
    flattenTree(data) {
      let flatList = []
      for (const item of data) {
        const { children, ...rest } = item
        flatList.push(rest)
        if (children && children.length > 0) {
          flatList = flatList.concat(this.flattenTree(children))
        }
      }
      return flatList
    },
    handleCheckrow(row) {
      // 全选、全不选
      // 设定全选全不选的选择值
      this.isAllClick = row.IsClick
      // 清空数组
      this.dataArray = []
      // 给数组添加遍历出来的的全部数据
      this.addPushData(this.categories)
      this.dataArray.forEach((item) => {
        if (item.id === row.id) {
          if (item.children && item.children.length > 0) {
            this.ifAllSelection(item.children)
          }
        }
      })
      // 子级选择
      if (row.children && row.children.length > 0) {
        this.isSonCheckin(row)
      }
      // console.log(row)
      // 判定父级的是否半选全选
      this.ifSelection(this.categories)
      // 给el-table添加选中的列
      this.inSelection()
      this.categoryIds = this.getClickedIds(this.categories) // 使用递归拿到所有id值
    },
    // 功能：判定全选
    ifAllSelection(item) {
      // 将数据循环判断
      item.forEach((itemData) => {
        // 如果有子级则继续循环
        if (itemData.children && itemData.children.length > 0) {
          this.ifAllSelection(itemData.children)
        }
        // debugger
        // 如果没有子级则设置为全选设定
        if (!itemData.children || itemData.children.length === 0) {
          itemData.IsClick = this.isAllClick
        }
      })
    },
    // 使用递归拿到所有id值
    getClickedIds(data) {
      let clickedIds = []
      for (const item of data) {
        if (item.IsClick) {
          clickedIds.push(item.id)
        }
        if (item.children && item.children.length > 0) {
          clickedIds = clickedIds.concat(this.getClickedIds(item.children))
        }
      }
      return clickedIds
    },
    // 功能：在点击时判定父类的子类是否被选中为半选
    ifSelection(item) {
      //  console.log(item)
      item.forEach((itemData) => {
        if (itemData.children && itemData.children.length > 0) {
          this.ifSelection(itemData.children)
          this.isSonCheckin(itemData)
        }
      })
    },
    // 功能：给el-table添加选中的列
    inSelection() {
      // 清空数组
      this.dataArray = []
      // 给数组添加遍历出来的的全部数据
      this.addPushData(this.categories)
      // 给全部数据设定是否被选中
      this.dataArray.forEach((item) => {
        // 设定选中的列
        this.$refs.tableRef.toggleRowSelection(item, item.IsClick)
      })
    },
    // 功能：给与树状列表半选和选定状态
    isSonCheckin(item) {
      // Some和Every对数组的遍历： this.isSonCheckin(item)
      // some是数组中只要有一个符合条件就返回true。
      // every是每一个元素都符合条件才返回true，否则返回false。
      // 子项都选中every遍历每一个子类符合条件就返回true，条件：子类的IsClick。用以判断子类全部选中，
      const all = item.children.every(flag => flag.IsClick)
      // 如果子类被全部选中则选中
      if (all) {
        // 选中
        item.IsClick = true
        // 半选
        item.IsInDM = false
        item.isIndeterminate = false
      }
      // 如果有一个子类符合条件了则
      const some = item.children.some(flag => flag.IsClick)
      const sonSome = item.children.some(flag => flag.IsInDM)
      // 部分选中半选择状态
      if (some) {
        // 再确认all全选为假
        if (!all) {
          item.IsClick = false
          item.IsInDM = true
          item.isIndeterminate = true
        }
      } else if (sonSome) {
        if (!all) {
          item.IsClick = false
          item.IsInDM = true
          item.isIndeterminate = true
        }
      } else {
        // 三都为假则不选
        item.IsClick = false
        item.IsInDM = false
        item.isIndeterminate = false
      }
    },
    // 功能：将所有的数据列出来
    addPushData(tabData) {
      tabData.forEach((inData) => {
        this.dataArray.push(inData)
        if (inData.children && inData.children.length > 0) {
          this.addPushData(inData.children)
        }
      })
    },
    // 功能：全选框选择全部行，包括树状数据的子级别。
    selectChangeAll() {
      // 获取真假值默认
      this.selectAllClick = !this.selectAllClick
      // 清空数组
      this.dataArray = []
      // 给数组添加遍历出来的的全部数据
      this.addPushData(this.categories)
      this.dataArray.forEach((item) => {
        // 给数组的数据添加真假值
        item.IsClick = this.selectAllClick
        if (this.selectAllClick) {
          item.isIndeterminate = !this.selectAllClick
          item.IsInDM = !this.selectAllClick
        } else {
          item.isIndeterminate = this.selectAllClick
          item.IsInDM = this.selectAllClick
        }
      })
      // 给与tableData中所有行附加指定真假选定值
      this.Select(this.categories, this.selectAllClick)
      this.categoryIds = this.getClickedIds(this.categories) // 使用递归拿到所有id值
    },
    // 功能：给选中行添加选中状态，如果选中行有子级也给子级添加选中状态
    Select(data, flag) {
      data.forEach((row) => {
        this.$refs.tableRef.toggleRowSelection(row, flag)
        // 如果这列中有子级别（子级不为空）则对其运行一次该方法设定其是否选中。
        if (row.children && row.children.length > 0) {
          this.Select(row.children, flag)
        }
      })
    },
    // 拿到数据后进行回显的递归设置选中
    setChecked(list) {
      if (this.menuIds && this.menuIds.length > 0) {
        // 先循环把最后一级选择
        list.forEach(row => {
          if (this.menuIds.includes(row.id)) {
            // 设置当前是全选还是半选
            // 如果有子级就继续递归
            if (row.children && row.children.length > 0) {
              this.setChecked(row.children)
              // 判定父级的是否半选全选
              this.ifSelection(this.categories)
            } else {
              row.IsClick = true
            }
          }
        })
        // 设置
        this.inSelection()
      }
    }

  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
