<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="类型" prop="orderDate">
        <el-select v-model="queryForm.type" size="mini" clearable placeholder="请选择统计类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="list" :data="tableData" :span-method="spanMethod" :border="true" :stripe="true">
      <el-table-column prop="invoiceNo" label="发票号" align="center" />
      <el-table-column prop="date" label="发票日期" align="center" />
      <el-table-column prop="invoiceTitle" label="抬头" align="center" />
      <el-table-column prop="invoiceUser" label="开票人" align="center" />
      <el-table-column prop="invoiceAmount" label="发票金额" align="center" />
      <el-table-column prop="tax" label="税金" align="center" />
      <el-table-column prop="taxAmount" label="税价合计" align="center" />
      <el-table-column prop="billNo" label="开票单据号" align="center" />
      <el-table-column prop="reamrk" label="单据备注" align="center" />
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
