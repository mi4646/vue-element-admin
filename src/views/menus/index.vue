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
        <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 1rem" @click="listMenus">
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
      <el-table-column prop="orderNum" label="排序" align="center" width="100" />
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
          <el-popconfirm title="确定删除吗？" style="margin-left: 10px" @confirm="deleteMenu(scope.row.id)">
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
        :show="show"
        :menu-form="menuForm"
        :is-catalog.sync="isCatalog"
      />
    </el-dialog>
  </el-card>
</template>

<script>
import EditTable from './components/EditTable.vue'
import { menusList } from '@/api/menus'

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
        orderNum: 1,
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
              orderNum: 1,
              children: null,
              hidden: 0
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
          hidden: 0,
          orderNum: 1,
          children: null,
          parent_id: null,
          component: 'Layout'
        }
      }
      this.addDialogVisible = true
    },
    checkIcon(icon) {
      this.menuForm.icon = icon
    },
    changeDisable(menu) {
      const params = {
        id: menu.id,
        hidden: menu.hidden
      }
      this.axios.put('/api/accounts/admin/menu/' + menu.id + '/', params).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            title: '成功',
            message: '修改成功'
          })
        } else {
          this.$message.error({
            title: '失败',
            message: '修改失败'
          })
        }
      }).catch(error => {
        this.$message.error({
          title: '失败',
          message: error
        })
      })
    },
    // 删除菜单
    deleteMenu(id) {
      this.axios.delete('/api/accounts/admin/menu/' + id + '/', {}).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            title: '成功',
            message: '删除成功'
          })
          this.listMenus()
        } else {
          this.$message.error({
            title: '失败',
            message: data.message
          })
        }
      }).catch(error => {
        this.$message.error({
          title: '失败',
          message: error
        })
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
