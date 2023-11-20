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
      <el-form-item label="上级菜单" prop="parent_id">
        <!-- vue-treeselect: https://vue-treeselect.js.org/  -->
        <treeselect
          v-model="menuForm.parent_id"
          searchable
          :value="value"
          :options="menus"
          :show-count="true"
          :disable-branch-nodes="false"
          :normalizer="normalizer"
          placeholder="选择上级菜单"
          no-options-text="无数据"
          style="width: 220px;"
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="name" class="is-required">
        <el-input v-model="menuForm.name" style="width: 220px" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon" class="is-required">
        <el-input
          v-model="menuForm.icon"
          :prefix-icon="'iconfont ' + menuForm.icon"
          style="width: 220px"
        />
      </el-form-item>
      <el-form-item v-show="!selected" label="组件路径" prop="component" class="is-required">
        <el-input v-model="menuForm.component" style="width: 220px" />
      </el-form-item>
      <el-form-item label="访问路径" prop="path" class="is-required">
        <el-input v-model="menuForm.path" style="width: 220px" />
      </el-form-item>
      <el-form-item label="显示排序" prop="orderNum">
        <el-input-number v-model="menuForm.orderNum" controls-position="right" :min="1" :max="10" />
      </el-form-item>
      <el-form-item label="显示状态">
        <el-radio-group v-model="menuForm.hidden">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否缓存">
        <el-radio-group v-model="menuForm.Nocache">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="固定视图">
        <el-radio-group v-model="menuForm.affix">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdateMenu(menuForm)"> 确 定 </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { menuCreate, menuUpdate } from '@/api/menus'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
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
    },
    menus: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      value: null,
      // tree-select 键值名转换
      normalizer(node) {
        // 处理children为空的情况
        if (node.children && !node.children.length) {
          delete node.children
        }
        return {
          label: node.name
        }
      }
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

      const params = {
        'id': this.menuForm.id,
        'path': this.menuForm.path,
        'name': this.menuForm.name,
        'icon': this.menuForm.icon,
        'affix': this.menuForm.affix,
        'hidden': this.menuForm.hidden,
        'Nocache': this.menuForm.Nocache,
        'parent_id': this.menuForm.parent_id,
        'component': this.menuForm.component
      }
      const method = params.id ? menuUpdate(params.id, params) : menuCreate(params)
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

<style lang="scss" scoped>
.dialog-footer {
	position: sticky;
	bottom: 10px;
	text-align: right;
	background-color: #fff;
}

:is-required >>>.el-form-item__label::after{
    content: '*';
    color: #F56C6C;
    margin-left: 4px;
  }

</style>