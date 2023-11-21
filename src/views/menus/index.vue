<template>
  <el-card class="main-card">
    <div class="operation-container">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="handleEdit(null)"
      > 新增菜单 </el-button>
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入菜单名"
          style="width: 200px"
          @keyup.enter.native="listMenus"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left: 1rem"
          @click="listMenus"
        >
          搜索
        </el-button>
      </div>
    </div>

    <!-- table表格  default-expand-all-->
    <el-table
      v-loading="loading"
      fixed
      :data="menus"
      row-key="id"
      style="width: 100%"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" label="菜单名称" width="180" />
      <el-table-column prop="icon" align="center" label="图标" width="100">
        <template slot-scope="scope">
          <i :class="'icon iconfont sub-el-icon ' + scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="排序" align="center" width="100">
        <template slot="header" slot-scope="scope">
          <span>
            排序
            <el-tooltip :aa="scope" class="item" effect="dark" content="" placement="top-start">
              <div slot="content">首先按数值大小进行<br>排序若数值相同则按<br>添加时间先后进行排<br>序</div>
              <i class="el-icon-question" style="color:#393a3b; margin-left:5px;'" />
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="访问路径" align="center" width="200" />
      <el-table-column prop="component" label="组件路径" align="center" width="250" />
      <el-table-column prop="hidden" label="是否隐藏" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.hidden"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0"
            @change="changeDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="Nocache" label="是否缓存" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.Nocache"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0"
            @change="changeDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="affix" label="是否固定视图" align="center" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.affix"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0"
            @change="changeDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.createTime | dateTime }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.component =='Layout'"
            type="text"
            size="mini"
            @click="handleEdit(scope.row, 1)"
          >
            <i class="el-icon-plus" /> 新增
          </el-button>
          <el-button type="text" size="mini" @click="handleEdit(scope.row, 2)">
            <i class="el-icon-edit" /> 修改
          </el-button>
          <el-popconfirm title="确定删除吗？" style="margin-left: 10px" @onConfirm="deleteMenu(scope.row.id)">
            <el-button slot="reference" size="mini" type="text"> <i class="el-icon-delete" /> 删除 </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :visible.sync="addDialogVisible"
      width="30%"
      top="12vh"
      height="50%"
      :title="dialogTitle"
    >
      <edit-table
        v-if="addDialogVisible"
        :show="show"
        :menu-form="menuForm"
        :menus="menus"
        :is-catalog.sync="isCatalog"
      />
    </el-dialog>
  </el-card>
</template>

<script>
import EditTable from './components/EditTable.vue'
import { menusList, menuUpdate, menuDelete } from '@/api/menus'

export default {
  components: { EditTable },
  data() {
    return {
      dialogTitle: '',
      keywords: '',
      loading: true,
      addDialogVisible: false,
      isCatalog: true,
      show: true,
      menus: [],
      menuForm: {
        id: null,
        name: '',
        icon: '',
        path: '',
        affix: 0,
        hidden: 0,
        Nocache: 0,
        priority: 0,
        component: '',
        children: null,
        parent_id: null
      }

    }
  },
  created() {
    this.listMenus()
  },
  methods: {
    listMenus() {
      const params = { name: this.keywords }
      menusList(params).then((response) => {
        this.menus = response.data
        this.loading = false
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    // 判断是新增菜单还是编辑菜单
    handleEdit(menu, type) {
      this.dialogTitle = type === 1 && menu ? '新增菜单' : '编辑菜单'
      if (menu) {
        this.show = false
        this.isCatalog = false
        switch (type) {
          case 1:
            this.menuForm = {
              id: null,
              name: '',
              icon: '',
              component: '',
              path: '',
              priority: null,
              children: null,
              affix: 0,
              hidden: 0,
              Nocache: 0
            }
            this.menuForm.children = JSON.parse(JSON.stringify(menu.id))
            break
          case 2:
            this.menuForm = JSON.parse(JSON.stringify(menu))
            break
        }
      } else {
        this.show = true
        this.menuForm = {
          id: null,
          name: '',
          icon: '',
          path: '',
          affix: 0,
          hidden: 0,
          Nocache: 0,
          priority: null,
          children: null,
          parent_id: null,
          component: 'Layout'
        }
      }
      this.addDialogVisible = true
    },
    changeDisable(menu) {
      menuUpdate(menu.id, menu).then((response) => {
        if (response.code === 0) {
          location.reload() // 刷新当前页面
          // this.listMenus()
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    // 删除菜单
    deleteMenu(id) {
      menuDelete(id).then((response) => {
        if (response.code === 0) {
          location.reload() // 刷新当前页面
          // this.listMenus()
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
.icon-item {
  cursor: pointer;
  padding: 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
