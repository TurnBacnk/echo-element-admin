<template>
  <div class="app-container">
    <el-table ref="list" :data="tableData" :span-method="spanMethod" :border="true" :stripe="true">
      <el-table-column label="主合同信息" align="center">
        <el-table-column prop="projectCode" label="项目编码" align="center">
          <template slot-scope="scope">
            <el-tag>
              {{ scope.row.projectCode }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="saleToName" label="销货单位" align="center"/>
        <el-table-column prop="contractNo" label="合同编号"/>
        <el-table-column prop="orderDate" label="签订日期" align="center">
          <el-table-column prop="year" label="年" align="center"/>
          <el-table-column prop="monthAndDay" label="月/日" align="center"/>
        </el-table-column>
        <el-table-column prop="amountWithTax" label="合同总金额/含税" align="center" width="150px"/>
        <el-table-column prop="amountWithoutTax" label="有效销售额/不含税" align="center" width="150p "/>
        <template slot-scope="scope">
          <el-tag>
            {{ convertYesOrNo(scope.row.delivery) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="交货信息" align="center">
        <el-table-column prop="outOrReturnCode" label="出库/退货单号" align="center" width="150px" />
        <el-table-column prop="outOrReturnDate" label="出库/退货日期" align="center" width="150px" />
        <el-table-column prop="outOrReturnAmountWithTax" label="出库/退货金额/含税" align="center" width="150px" />
        <el-table-column prop="ourOrReturnAmountWithoutTax" label="出库/退货金额/不含税" align="center" width="150px" />
        <el-table-column prop="delivery" label="是否已交货" align="center" width="150px" >
          <template slot-scope="scope">
            {{ convertYesOrNo(scope.row.delivery) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="发票信息" align="center">
        <el-table-column label="开票/现金收款日期">
          <el-table-column label="年" prop="yearForReceive" />
          <el-table-column label="月/日" prop="monthAndDayForReceive" />
        </el-table-column>
        <el-table-column label="开票金额" prop="invoiceAmount" align="center" />
        <el-table-column label="开票税额" prop="invoiceTax" align="center" />
        <el-table-column label="开票金额/含税" prop="invoiceAmountWithTax" align="center" width="150px"  />
        <el-table-column label="现金收款" prop="cash" align="center" />
      </el-table-column>
      <el-table-column label="收款信息" align="center">
        <el-table-column label="回款金额/含税" prop="paymentAmountWithTax" align="center" width="150px"  />
        <el-table-column label="回款日期" prop="paymentDate" align="center" />
        <el-table-column label="未收金额/含税(开票-收款)" prop="notReceiveAmountWithTax" width="180px"  />
      </el-table-column>
      <el-table-column label="毛利" align="center" prop="profit" />
      <el-table-column label="销售人员" align="center" prop="saleUser" />
      <el-table-column label="备注" align="center" />
    </el-table>
  </div>
</template>
<script>
import request from '@/utils/request'

export default {
  name: 'SaleReport',
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
    }
  }
}
</script>
