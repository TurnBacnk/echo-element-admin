<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="编号"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="发起日期">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="300px" label="业务名称">
      <template slot-scope="{row}">
        <span>{{ row.title }}</span>
        <el-tag>{{ row.type }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="发起人">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="下级审批人">
      <template slot-scope="scope">
        <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" />
      </template>
    </el-table-column>

    <el-table-column align="center" label="审核意见" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.pageviews }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="审核状态" width="110">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { fetchList } from '@/api/article'

import { parseTime } from '@/utils'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'CN'
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
  created() {
    this.getList()
  },
  methods: {
    parseTime,
    getList() {
      this.loading = true
      this.$emit('create') // for test
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.loading = false
      // })
    }
  }
}
</script>

