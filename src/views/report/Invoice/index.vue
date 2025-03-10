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
      <el-table-column prop="name" :label="queryForm.type === 0 ?  '客户名称' : '供应商名称'" align="center" />
      <el-table-column prop="invoiceAmountWithoutTax" label="开票未税金额" align="center" />
      <el-table-column prop="taxAmount" label="税金" align="center" />
      <el-table-column prop="taxTotalAmount" label="价税合计" align="center" />
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'InvoiceStatistic',
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
          label: '客户',
          value: 0
        },
        {
          label: '供应商',
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
