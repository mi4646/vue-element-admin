<template>
  <el-card class="main-card">
    <div class="operation-container">
      <div style="margin-left: auto">

        <el-date-picker
          v-model="TimeValue"
          type="daterange"
          unlink-panels
          size="small"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          style="margin-right: 1rem;top: 2px;"
        />

        <el-select
          v-model="actionType"
          clearable
          placeholder="请选择类型"
          size="small"
          style="margin-right: 1rem"
        >
          <el-option
            v-for="item in
              typeList"
            :key="item.type"
            :label="item.desc"
            :value="item.type"
          />
        </el-select>

        <el-input
          v-model="changes"
          clearable
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入模块名或描述"
          style="width: 200px"
          @keyup.enter.native="searchLogs"
        />

        <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 1rem" @click="searchLogs">
          搜索
        </el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table stripe :data="logs">
      <el-table-column prop="index" label="序号" width="100" align="center">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(current-1)*size }}
        </template>
      </el-table-column>
      <el-table-column prop="timestamp" label="时间" align="center" width="250">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.timestamp | dateTime }}
        </template>
      </el-table-column>
      <!-- 对IP地址进行脱敏处理 -->
      <el-table-column prop="remote_addr" label="IP地址" align="center" width="150">
        <template v-if="scope.row.remote_addr" slot-scope="scope">
          {{ scope.row.remote_addr.replace(/\.\d{1,3}\.\d{1,3}$/, '.**.**') }}
        </template>
      </el-table-column>
      <el-table-column prop="action_display" label="类型" align="center" width="150">
        <template v-if="scope.row.action_display" slot-scope="scope">
          <el-tag :type="tagType(scope.row.action)">
            {{ scope.row.action_display }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="object_repr" label="描述" align="center">
        <template slot-scope="scope">
          <el-button slot="reference" size="mini" type="text">
            {{ scope.row.object_repr }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="操作人员" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.user.username }}
        </template>
      </el-table-column>
      <el-table-column prop="ipSource" label="登录地址" align="center" width="150" />
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button slot="reference" size="mini" type="text" @click="viewDetail(scope.row)">
            <i class="el-icon-view" /> 查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 日志详情信息 -->
    <log-details
      v-if="dialogVisible"
      :dialog-visible.sync="dialogVisible"
      :opt-log="optLog"
      @close-dialog="handleCloseDialog"
    />

    <el-pagination
      class="pagination-container"
      background
      :current-page="current"
      :page-size="size"
      :total="totalCount"
      :page-sizes="[10, 20,40]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </el-card>
</template>

<script>
import { logsList } from '@/api/logs'
import LogDetails from './components/LogDetails.vue'

export default {
  components: { LogDetails },
  data() {
    return {
      logs: [],
      size: 10,
      current: 1,
      totalCount: 0,
      changes: null,
      dialogVisible: false,
      optLog: {},
      actionType: null,
      typeList: [
        {
          type: null,
          desc: '全部'
        },
        {
          type: 0,
          desc: '创建'
        },
        {
          type: 1,
          desc: '修改'
        },
        {
          type: 2,
          desc: '删除'
        },
        {
          type: 3,
          desc: '访问'
        },
        {
          type: 4,
          desc: '下载'
        },
        {
          type: 5,
          desc: '登录'
        },
        {
          type: 6,
          desc: '退出'
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '过去7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近1个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近3个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近半年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近1年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              const currentDate = new Date()
              const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())
              const timestamp = oneYearAgo.getTime()
              start.setTime(timestamp)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      TimeValue: []
    }
  },
  computed: {
    tagType() {
      const tags = ['primary', 'secondary', 'success', 'info', 'warning', 'danger']
      return (tag) => {
        const index = parseInt(tag) % tags.length
        return tags[index]
      }
    }
  },
  watch: {
    actionType() {
      this.listLogs()
    },
    changes() {
      this.listLogs()
    },
    TimeValue() {
      this.listLogs()
    }
  },
  created() {
    this.listLogs()
  },
  methods: {
    searchLogs() {
      this.current = 1
      this.listLogs()
    },
    sizeChange(size) {
      this.size = size
      this.listLogs()
    },
    currentChange(current) {
      this.current = current
      this.listLogs()
    },
    // 日志列表
    listLogs() {
      const params = {
        page: this.current,
        p_size: this.size,
        changes: this.changes,
        action: this.actionType
      }

      if (this.TimeValue) {
        params.start = this.TimeValue[0]
        params.end = this.TimeValue[1]
      }

      logsList(params).then((response) => {
        if (response.code === 0) {
          this.logs = response.data.map(log => ({ ...log,
            showIp: false
          }))
          this.totalCount = response.total_count
        } else {
          this.$message.error({ message: response.codemsg })
        }
      }).catch(error => {
        this.$message.error({ message: error })
      })
    },
    // 查看详情
    viewDetail(optLog) {
      this.optLog = JSON.parse(JSON.stringify(optLog))
      this.dialogVisible = true
    },
    // 关闭对话框
    handleCloseDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
label {
  font-weight: bold !important;
}

</style>
