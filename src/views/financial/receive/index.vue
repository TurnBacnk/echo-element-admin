<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="单据日期" prop="outboundTime">
        <el-date-picker v-model="queryForm.outboundTime" placeholder="请选择单据日期" type="date" />
      </el-form-item>
      <el-form-item label="客户" prop="clientId">
        <el-select v-model="queryForm.clientId" placeholder="请选择客户">
          <el-option
            v-for="client in javaCode['CustomerBuilder']"
            :key="client.value"
            :label="client.label"
            :value="client.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="销售人员" prop="saleUserId">
        <el-select v-model="queryForm.saleUserId" placeholder="请选择销售人员">
          <el-option
            v-for="user in javaCode['UserBuilder']"
            :key="user.value"
            :label="user.label"
            :value="user.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" :show-search.sync="showSearch" @quyertTable="handleQuery" />
    <page-table ref="tableList" :query-form="queryForm" :data-source="dataSource" :table-column-config="tableColumnConfig" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import {getConstant, getJavaCode} from '@/api/common/dict'

export default {
  name: 'SaleReturnOrder',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        outboundTime: undefined,
        clientId: undefined,
        saleUserId: undefined
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
      dataSource: '/api/financial-receive/list',
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['ReceiveStatus']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CustomerBuilder', 'UserBuilder']
      }
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
          prop: 'saleOutboundCode',
          label: '销售出库单号',
          width: '250px'
        },
        {
          prop: 'outboundTime',
          label: '单据日期'
        },
        {
          prop: 'clientName',
          label: '客户名称'
        },
        {
          prop: 'saleUserName',
          label: '销售人员'
        },
        {
          prop: 'afterDiscountReceiveAmount',
          label: '应收金额',
          columnType: 'Money'
        },
        {
          prop: 'receivedAmount',
          label: '已收金额',
          columnType: 'Money'
        },
        {
          prop: 'unReceivedAmount',
          label: '未收金额',
          columnType: 'Money'
        },
        {
          prop: 'lastReceivedTime',
          label: '最后收款日期'
        },
        {
          prop: 'receiveStatus',
          label: '收款状态',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['ReceiveStatus'],
            type: (row) => {
              if (row.status === 0) {
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
              text: '收款',
              css: 'text',
              click: (index, row) => {

              },
              isDisabled: (row) => {
                return false
              }
            },
            {
              text: '结案',
              css: 'text',
              click: (index, row) => {

              },
              isDisabled: (row) => {
                return false
              }
            }, {
              text: '核销',
              css: 'text',
              click: (index, row) => {

              },
              isDisabled: (row) => {
                return false
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

    }
  }
}

</script>
