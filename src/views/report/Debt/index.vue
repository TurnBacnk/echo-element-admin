<template>
  <div class="app-container">
    <el-table ref="list" :data="tableData" :span-method="spanMethod" :border="true" :stripe="true">
      <el-table-column prop="name" label="客户/供应商名称" align="center" />
      <el-table-column prop="beginningOfReceive" label="期初应收余额" align="center" />
      <el-table-column prop="acceptedReceive" label="本期应收款" align="center" />
      <el-table-column prop="receive" label="本期收款" align="center" />
      <el-table-column prop="balanceReceivable" label="结存应收余额" align="center" />
    </el-table>
  </div>
</template>
<script>
import request from '@/utils/request'

export default {
  name: 'DebtRepot',
  data() {
    return {
      showSearch: true,
      queryForm: {
        code: undefined
      },
      tableData: []
    }
  },
  async created() {
    await this.list()
  },
  methods: {
    list() {
      request({
        url: '/api/report/debt-report',
        method: 'post'
      }).then(res => {
        const { data } = res
        this.tableData = data
      })
    },
    spanMethod() {

    },
    convertYesOrNo(delivery) {
      return '是'
    }
  }
}
</script>
