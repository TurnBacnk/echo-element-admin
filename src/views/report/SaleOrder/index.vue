<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="日期范围" prop="orderDate">
        <el-input v-model="queryForm.orderDate" size="mini" clearable placeholder="请输入单据编号" />
      </el-form-item>
      <el-form-item label="客户" prop="clientId">
        <el-select v-model="queryForm.clientId" placeholder="请选择客户" clearable>
          <el-option v-for="client in javaCode['CustomerBuilder']"
                     :value="client.value"
                     :key="client.value"
                     :label="client.label"

          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="list" :data="tableData" :span-method="spanMethod" :border="true" :stripe="true">
      <el-table-column prop="name" label="客户/供应商名称" align="center" />
      <el-table-column prop="customCode" label="客户编码" align="center" />
      <el-table-column prop="contractAmount" label="合同金额" align="center" />
      <el-table-column prop="outTaxTotalAmount" label="出库税价合计" align="center" />
      <el-table-column prop="returnTaxTotalAmount" label="退货税价合计" align="center" />
      <el-table-column prop="outAmount" label="出库金额合计" align="center" />
      <el-table-column prop="waitOutAmount" label="待出库金额" align="center" />
      <el-table-column prop="outCost" label="出库成本" align="center" />
      <el-table-column prop="returnCost" label="退货成本" align="center" />
      <el-table-column prop="outProfit" label="出库毛利" align="center" />
      <el-table-column prop="saleUserName" label="销售人员" align="center" />
    </el-table>
  </div>
</template>
<script>
import request from '@/utils/request'
import { getJavaCode } from '@/api/common/dict'

export default {
  name: 'DebtRepot',
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
        javaCodeNameList: ['CustomerBuilder']
      }
    }
  },
  async created() {
    await this.list()
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
  },
  methods: {
    list() {
      request({
        url: '/api/report/sale-report',
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
