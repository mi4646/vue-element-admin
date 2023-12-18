<template>
  <el-card class="main-card">
    <div class="operation-container">
      <div style="margin-left: auto">
        <el-select v-model="loginType" clearable placeholder="请选择登录方式" size="small" style="margin-right: 1rem">
          <el-option v-for="item in typeList" :key="item.type" :label="item.desc" :value="item.type" />
        </el-select>
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入昵称"
          style="width: 200px"
          @keyup.enter.native="searchUsers"
        />
        <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 1rem" @click="searchUsers">
          搜索
        </el-button>
      </div>
    </div>

    <el-table stripe :data="userList">
      <el-table-column prop="index" label="序号" width="100" align="center">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(current-1)*size }}
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像" align="center" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="40" height="40">
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center" width="200" />
      <el-table-column prop="nick_name" label="昵称" align="center" width="200" />
      <el-table-column prop="isDisable" label="禁用" align="center" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDisable"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0"
            @change="changeDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="date_joined" label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.date_joined | dateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="last_login" label="上次登录时间" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.last_login | dateTime }}
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述" align="center" width="300" />
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openEditModel(scope.row)"> 编辑 </el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <!-- 修改用户信息 -->
    <el-dialog :visible.sync="isEdit" width="30%">
      <div slot="title" class="dialog-title-container">修改用户</div>
      <el-form label-width="60px" size="medium" :model="userForm">
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname" style="width: 220px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleIds">
            <el-checkbox v-for="item of userRoles" :key="item.id" :label="item.id">
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUserRole"> 确 定 </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { usersList } from '@/api/user'

export default {
  data: function() {
    return {
      isEdit: false,
      userForm: {
        userInfoId: null,
        nickname: ''
      },
      loginType: null,
      userRoles: [],
      roleIds: [],
      userList: [],
      typeList: [
        {
          type: 1,
          desc: '邮箱'
        },
        {
          type: 2,
          desc: 'QQ'
        }
      ],
      keywords: null,
      current: 1,
      size: 10,
      count: 0
    }
  },
  watch: {
    loginType() {
      this.current = 1
      this.listUsers()
    }
  },
  created() {
    this.listUsers()
    // this.listRoles()
  },
  methods: {
    searchUsers() {
      this.current = 1
      this.listUsers()
    },
    sizeChange(size) {
      this.size = size
      this.listUsers()
    },
    currentChange(current) {
      this.current = current
      this.listUsers()
    },
    changeDisable(user) {
      this.axios.put('/api/admin/users/disable', {
        id: user.userInfoId,
        isDisable: user.isDisable
      })
    },
    openEditModel(user) {
      this.roleIds = []
      this.userForm = JSON.parse(JSON.stringify(user))
      this.userForm.roles.forEach((item) => {
        this.roleIds.push(item.id)
      })
      this.isEdit = true
    },
    editUserRole() {
      this.userForm.roleIds = this.roleIds
      console.log(this.userForm)
      this.axios.put('/api/admin/users/role', this.userForm).then(({ data }) => {
        if (data.code === 0) {
          this.$notify.success({
            title: '成功',
            message: data.message
          })
          this.listUsers()
        } else {
          this.$notify.error({
            title: '失败',
            message: data.message
          })
        }
      }).catch(error => {
        this.$notify.error({
          title: '失败',
          message: error
        })
      })
        .finally(() => {
          this.isEdit = false
        })
    },
    listUsers() {
      const params = {
        page: this.current,
        p_size: this.size
        // username: this.keywords,
        // loginType: this.loginType
      }
      usersList(params).then((response) => {
        if (response.code === 0) {
          this.userList = response.data
          this.count = response.total_count
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    listRoles() {
      this.axios.get('/api/admin/users/role').then(({ data }) => {
        this.userRoles = data.data
      }).catch(error => { this.$notify.error({ title: '失败', message: error }) })
    }
  }
}
</script>
