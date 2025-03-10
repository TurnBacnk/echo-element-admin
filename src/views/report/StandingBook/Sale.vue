<template>
  <div class="app-container">
    <el-table ref="list" :data="tableData" :span-method="spanMethod" :border="true" :stripe="true">
      <el-table-column prop="code" label="流水号" align="center" />
      <el-table-column prop="contractNo" label="合同号" align="center" />
      <el-table-column prop="signDate" label="签订日期" align="center" />
      <el-table-column prop="amount" label="合同总价(元)" align="center" />
      <el-table-column prop="outCode" label="出库单号" align="center" />
      <el-table-column prop="outDate" label="出库日期" align="center" />
      <el-table-column prop="outAmount" label="销售出库金额" align="center" />
      <el-table-column prop="notOutAmount" label="销售未出库金额" align="center" />
      <el-table-column label="收款情况" align="center">
        <el-table-column prop="receiveDate" label="日期" />
        <el-table-column prop="receiveAmount" label="金额" />
      </el-table-column>
      <el-table-column prop="debtAmount" label="欠款金额" />
      <el-table-column label="发票情况">
        <el-table-column prop="invoiceDate" label="日期" />
        <el-table-column prop="invoiceNo" label="票号" />
        <el-table-column prop="invoiceAmount" label="金额" />
        <el-table-column prop="invoiceTax" label="税额" />
      </el-table-column>
      <el-table-column prop="debtInvoice" label="欠票"/>
      <el-table-column prop="remark" label="备注"/>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'InvoiceDetail',
  data() {
    return {
      showSearch: true,
      queryForm: {
        orderDate: undefined,
        clientId: undefined
      },
      tableData: [],
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['VendorBuilder']
      },
      typeOptions: [
        {
          label: '开票',
          value: 0
        },
        {
          label: '收票',
          value: 1
        }
      ]
    }
  },
  created() {
  },
  methods: {
    spanMethod() {

    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.$refs.queryForm.resetFields()
    }
  }
}
</script>
