<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
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
            v-for="orderType in orderTypeList"
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
    <button-group :button-config="buttonConfig" @quyertTable="handleQuery" :show-search.sync="showSearch"/>
    <page-table ref="tableList" :query-form="queryForm" :data-source="dataSource"
                :table-column-config="tableColumnConfig"
    />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import {getConstant, getJavaCode} from "@/api/common/dict";
import {re} from "mathjs";

export default {
  name: 'Payment',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        orderCode: undefined,
        orderTime: undefined,
        orderType: 1,
        vendorId: undefined,
        procurementUserId: undefined,
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
        constantNameList: ['PayableOrderType', 'ReceiveStatus']
      },
      orderTypeList: [
        { label: '采购入库单', value: 0, key: 0 },
        { label: '采购订单', value: 1, key: 1 },
        { label: '预付', value: 2, key: 2 }
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
            constantList: this.constant['PayableOrderType'],
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
          prop: 'paymentAmount',
          label: '应付金额',
          columnType: 'Money'
        },
        {
          prop: 'alreadyPayAmount',
          label: '已付金额',
          columnType: 'Money'
        },
        {
          label: '未付金额',
          prop: 'unPayAmount',
          columnType: 'Money'
        },
        {
          prop: 'paymentStatus',
          label: '付款状态',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['ReceiveStatus'],
            type: (row) => {
              if (row.paymentStatus === 0) {
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
                const orderId = this.getOrderId(row)
                const paymentType = this.getPaymentType(row)
                this.$router.push({
                  name: 'FinancialPaymentOrderAdd',
                  params: {
                    orderId: orderId,
                    paymentType: paymentType,
                    vendorId: row.vendorId,
                    vendorName: row.vendorName
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
                  name: '',
                  params: {

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
              isDisabled:(row) => {

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
      if (row.orderType === 0) {
        return 0
      }
      if (row.orderType === 1) {
        return 1
      }
      if (row.orderType === 2) {
        return 3
      }
    }
  }
}

</script>
