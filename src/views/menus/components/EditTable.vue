<!-- 添加/编辑对话框 -->
<template>
  <div>
    <el-form label-width="90px" size="medium" :model="menuForm">
      <el-form-item v-if="show" label="菜单类型">
        <el-radio-group v-model="selected">
          <el-radio :label="true">目录</el-radio>
          <el-radio :label="false">一级菜单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称">
        <el-input v-model="menuForm.name" style="width: 220px" />
      </el-form-item>
      <el-form-item label="菜单图标">
        <el-input
          v-model="menuForm.icon"
          :prefix-icon="'iconfont ' + menuForm.icon"
          style="width: 220px"
        />
      </el-form-item>
      <el-form-item v-show="!selected" label="组件路径">
        <el-input v-model="menuForm.component" style="width: 220px" />
      </el-form-item>
      <el-form-item label="访问路径">
        <el-input v-model="menuForm.path" style="width: 220px" />
      </el-form-item>
      <el-form-item label="显示排序">
        <el-input-number v-model="menuForm.orderNum" controls-position="right" :min="1" :max="10" />
      </el-form-item>
      <el-form-item label="显示状态">
        <el-radio-group v-model="menuForm.hidden">
          <el-radio :label="0">显示</el-radio>
          <el-radio :label="1">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdateMenu"> 确 定 </el-button>
    </div>
  </div>
</template>

<script>
import { menusCreate, menusUpdate } from '@/api/menus'

export default {
  props: {
    menuForm: {
      type: Object,
      default() {
        return {
          id: null,
          name: '',
          icon: '',
          path: '',
          hidden: 0,
          orderNum: 1,
          component: '',
          children: null,
          parent_id: null
        }
      }
    },
    show: {
      type: Boolean,
      default: true
    },
    isCatalog: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      icons: [
        'el-icon-myshouye',
        'el-icon-myfabiaowenzhang',
        'el-icon-myyonghuliebiao',
        'el-icon-myxiaoxi',
        'el-icon-myliuyan',
        'el-icon-myshouye',
        'el-icon-myfabiaowenzhang',
        'el-icon-myyonghuliebiao',
        'el-icon-myxiaoxi',
        'el-icon-myliuyan'
      ]
    }
  },
  computed: {
    selected: {
      get() {
        return this.isCatalog
      },
      set(val) {
        this.$emit('update:isCatalog', val)
      }
    }
  },
  methods: {
    // 关闭对话框
    closeDialog() {
      this.$parent.$parent.$parent.addDialogVisible = false
    },
    // 添加/修改菜单
    saveOrUpdateMenu() {
      if (this.menuForm.name.trim() === '') {
        this.$message.error('菜单名不能为空')
        return false
      }
      if (this.menuForm.icon.trim() === '') {
        this.$message.error('菜单icon不能为空')
        return false
      }
      if (this.menuForm.component.trim() === '') {
        this.$message.error('菜单组件路径不能为空')
        return false
      }
      if (this.menuForm.path.trim() === '') {
        this.$message.error('菜单访问路径不能为空')
        return false
      }

      const method = this.menuForm.id ? menusUpdate(this.menuForm.id, this.menuForm) : menusCreate(this.menuForm)
      method.then((response) => {
        if (response.code === 0) {
          this.$message.success({ message: response.codemsg })
          this.$parent.$parent.$parent.listMenus()
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      }).finally(() => {
        this.$parent.$parent.$parent.addDialogVisible = false
      })
    }
  }

}
</script>

<style  scoped>
.dialog-footer {
	position: sticky;
	bottom: 10px;
	text-align: right;
	background-color: #fff;
}

</style>
