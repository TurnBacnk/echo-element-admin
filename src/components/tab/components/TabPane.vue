<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="编号"
      width="65"
      type="index"
      element-loading-text="请给我点时间！"
    >
      <!--      <template slot-scope="scope">-->
      <!--        <span>{{ scope.row.id }}</span>-->
      <!--      </template>-->
    </el-table-column>

    <el-table-column width="180px" align="center" label="发起日期">
      <template slot-scope="scope">
        <span>{{ scope.row.createTime }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="300px" label="业务名称">
      <template slot-scope="{row}">
        <el-link type="primary" @click.native="goToApprovalPage(row)"> {{ row.businessName }} </el-link>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="发起人">
      <template slot-scope="scope">
        <span>{{ scope.row.createByName }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="下级审批人">
      <template slot-scope="scope">
        <span>{{ scope.row.approvalUserName }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="审核意见" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.approvalOpinion }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="审核状态" width="110">
      <template slot-scope="{row}">
        <el-tag :type="row.approvalStatus | statusFilter">
          {{ row.approvalStatusText }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import request from '@/utils/request'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: '',
        2: 'success',
        3: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'CN'
    },
    dataSource: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: '+id'
      },
      loading: false
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      request({
        url: this.dataSource,
        method: 'get'
      }).then(res => {
        this.list = res.data
      })
      this.loading = false
    },
    goToApprovalPage(row) {
      var businessName = row.businessName
      var match = businessName.match(/\[(.*?)\]/)
      if (match) {
        var businessNameWithPrefix = match[1]
        var businessCodeIndex = businessNameWithPrefix.indexOf('-')
        if (businessCodeIndex !== -1) {
          var businessCode = businessNameWithPrefix.substring(businessCodeIndex + 1)
          this.$router.push({
            name: row.viewPage,
            params: {
              code: businessCode
            }
          })
        }
      }
    }
  }
}
</script>

