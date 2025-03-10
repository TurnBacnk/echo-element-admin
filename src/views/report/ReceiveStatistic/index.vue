<template>
  <div class="app-container">
    <el-table ref="list" :data="tableData" :span-method="spanMethod" :border="true" :stripe="true">
      <el-table-column prop="name" label="客户" align="center" />
      <el-table-column prop="beginningReceive" label="期初应收" align="center" />
      <el-table-column prop="BeginningWaitReceive" label="期初待开票" align="center" />
      <el-table-column prop="BeginningWaitShipping" label="期初未发货" align="center" />
      <el-table-column prop="contract" label="2024签订合同" align="center" />
      <el-table-column prop="shippingAmount" label="2024发货金额" align="center" />
      <el-table-column prop="invoiceAmount" label="2024开票金额" align="center" />
      <el-table-column prop="noInvoiceAmount" label="待开票金额" align="center" />
      <el-table-column prop="receiveAmount" label="2024回款金额" align="center" />
      <el-table-column prop="endReceiveAmount" label="期末应收金额" align="center" />
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
        url: '/api/report/receive-statistic-report',
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
