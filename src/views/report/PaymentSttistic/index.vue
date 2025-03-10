<template>
  <div class="app-container">
    <el-table ref="list" :data="tableData" :span-method="spanMethod" :border="true" :stripe="true">
      <el-table-column prop="name" label="供应商" align="center" />
      <el-table-column prop="beginningArrears" label="期初欠款" align="center" />
      <el-table-column prop="BeginningDebtInvoice" label="期初欠票" align="center" />
      <el-table-column prop="contractAmount" label="2024合同金额" align="center" />
      <el-table-column prop="alreadyPayAmount" label="2024已付款" align="center" />
      <el-table-column prop="debtAmount" label="2024欠款金额" align="center" />
      <el-table-column prop="invoiceAmount" label="2024收票金额" align="center" />
      <el-table-column prop="debtInvoice" label="2024欠票" align="center" />
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
        url: '/api/report/payment-statistic-report',
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
