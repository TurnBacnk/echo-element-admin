<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="日期范围" prop="orderDate">
        <el-input v-model="queryForm.orderDate" size="mini" clearable placeholder="请输入单据编号" />
      </el-form-item>
      <el-form-item label="供应商" prop="vendorId">
        <el-select v-model="queryForm.vendorId" placeholder="请选择供应商">
          <el-option
            v-for="vendor in javaCode['VendorBuilder']"
            :key="vendor.value"
            :value="vendor.value"
            :label="vendor.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="list" :data="tableData" :span-method="spanMethod" :border="true" :stripe="true">
      <el-table-column prop="name" label="供应商名称" align="center" />
      <el-table-column prop="supplierCode" label="供应商编码" align="center" />
      <el-table-column prop="contractAmount" label="合同金额" align="center" />
      <el-table-column prop="inTaxTotalAmount" label="入库税价合计" align="center" />
      <el-table-column prop="returnTaxTotalAmount" label="退货税价合计" align="center" />
      <el-table-column prop="inAmount" label="入库金额合计" align="center" />
      <el-table-column prop="waitInAmount" label="待入库金额" align="center" />
      <el-table-column prop="username" label="经办人" align="center" />
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
        javaCodeNameList: ['VendorBuilder']
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
        url: '/api/report/procurement-report',
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
