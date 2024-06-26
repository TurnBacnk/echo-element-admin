<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="单据日期" prop="orderTime">
        <el-date-picker v-model="queryForm.orderTime" placeholder="请选择单据日期" type="date" />
      </el-form-item>
      <el-form-item label="客户" prop="vendorId">
        <el-select v-model="queryForm.vendorId" placeholder="请选择供应商">
          <el-option
            v-for="client in javaCode['VendorBuilder']"
            :key="client.value"
            :label="client.label"
            :value="client.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="销售人员" prop="procurementUserId">
        <el-select v-model="queryForm.procurementUserId" placeholder="请选择采购人员">
          <el-option
            v-for="user in javaCode['UserBuilder']"
            :key="user.value"
            :label="user.label"
            :value="user.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单据类型" prop="orderType">
        <el-select v-model="queryForm.orderType" placeholder="请选择单据类型">
          <el-option
            v-for="orderType in orderType"
            :key="orderType.value"
            :label="orderType.label"
            :value="orderType.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" :show-search.sync="showSearch" @quyertTable="handleQuery" />
    <page-table
      ref="tableList"
      :query-form="queryForm"
      :data-source="dataSource"
      :table-column-config="tableColumnConfig"
    />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import { getConstant, getJavaCode } from '@/api/common/dict'

export default {
  name: 'Payment',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        orderCode: undefined,
        orderTime: undefined,
        orderType: 4,
        vendorId: undefined,
        procurementUserId: undefined
      },
      buttonConfig: [
        {
          text: '批量结案',
          click: () => {
            this.batchClosed()
          },
          plain: true
        }
      ],
      dataSource: '/api/financial-payable/list',
      tableColumnConfig: [],
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['VendorBuilder', 'UserBuilder']
      },
      constant: [],
      constantConfig: {
        constantNameList: ['OrderType', 'ReceiveStatus']
      },
      orderType: [
        { label: '采购订单', value: 4, key: 4 },
        { label: '采购入库单', value: 3, key: 3 },
        { label: '预付单', value: 5, key: 5 }
      ]
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await this.init()
  },
  methods: {
    init() {
      this.tableColumnConfig = [
        {
          columnType: 'Index'
        },
        {
          prop: 'orderCode',
          label: '单据编号',
          width: '250px'
        },
        {
          prop: 'orderType',
          label: '单据类型',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['OrderType'],
            type: (row) => {
              return ''
            },
            effect: 'light'
          }
        },
        {
          prop: 'orderTime',
          label: '单据时间'
        },
        {
          prop: 'vendorName',
          label: '供应商'
        },
        {
          prop: 'expectedAmount',
          label: '应付金额',
          columnType: 'Money'
        },
        {
          prop: 'alreadyAmount',
          label: '已付金额',
          columnType: 'Money'
        },
        {
          label: '未付金额',
          prop: 'unAmount',
          columnType: 'Money'
        },
        {
          prop: 'receivePayStatus',
          label: '付款状态',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['ReceiveStatus'],
            type: (row) => {
              if (row.receivePayStatus === 0) {
                return 'warning'
              }
              return 'success'
            },
            effect: 'light'
          }
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
            {
              text: '付款',
              css: 'text',
              click: (index, row) => {
                this.$router.push({
                  name: 'FinancialPaymentOrderAdd',
                  params: {
                    id: row.id,
                    orderType: row.orderType,
                    paymentType: this.getPaymentType(row),
                    vendorId: row.vendorId,
                    vendorName: row.vendorName,
                    orderId: row.orderId
                  }
                })
              },
              isDisabled: (row) => {
                return false
              }
            },
            {
              text: '核销',
              css: 'text',
              click: (index, row) => {
                this.$router.push({
                  name: 'FinancialWriteOffAdd',
                  params: {
                    clientId: row.clientId,
                    clientName: row.clientName,
                    orderId: row.orderId,
                    writeOffType: 1
                  }
                })
              },
              isDisabled: (row) => {

              }
            },
            {
              text: '结案',
              css: 'text',
              click: (index, row) => {

              },
              isDisabled: (row) => {

              }
            }
          ]
        }
      ]
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.$refs.queryForm.resetFields()
    },
    batchClosed() {

    },
    getOrderId(row) {
      return row.orderId
    },
    getPaymentType(row) {
      if (row.orderType === 3) {
        return 0
      }
      if (row.orderType === 4) {
        return 1
      }
      if (row.orderType === 5) {
        return 3
      }
    }
  }
}

</script>
