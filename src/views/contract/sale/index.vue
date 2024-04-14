<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="合同号" prop="contractCode">
        <el-input v-model="queryForm.contractCode" clearable placeholder="请输入合同号"/>
      </el-form-item>
      <el-form-item label="合同名称" prop="contractCode">
        <el-input v-model="queryForm.contractName" clearable placeholder="请输入合同名称" />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerId">
        <el-select v-model="queryForm.customerId">
          <el-option
            v-for="customer in javaCode['CustomerBuilder']"
            :key="customer.key"
            :value="customer.value"
            :label="customer.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" @quyertTable="handleQuery" :show-search.sync="showSearch" />
    <page-table ref="tableList" :query-form="queryForm" :data-source="dataSource" :table-column-config="tableColumnConfig" :show-approval="true"/>
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import { getConstant, getJavaCode } from '@/api/common/dict'
import { removeSaleContract } from '@/api/business/sale-contract'

export default {
  name: 'Client',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        contractCode: undefined,
        contractName: undefined,
        customerId: undefined
      },
      buttonConfig: [
        {
          text: '新增',
          click: () => {
            this.handleAdd()
          },
          plain: true,
          icon: 'el-icon-plus'
        },
        {
          text: '提交',
          click: () => {
            this.handleSubmit()
          },
          plain: true,
          type: 'warning',
          icon: 'el-icon-s-promotion'
        },
        {
          text: '删除',
          type: 'danger',
          click: () => {
            this.handleDel()
          },
          plain: true,
          icon: 'el-icon-delete'
        }
      ],
      dataSource: '/api/sale-contract/list',
      tableColumnConfig: [],
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CustomerBuilder']
      },
      constant: [],
      constantConfig: {
        constantNameList: ['ContractStatus']
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
          prop: 'contractNo',
          label: '合同编号',
          fixed: 'left',
          width: '250',
          columnType: 'Link',
          link: {
            click: (index, row) => {

            }
          }
        },
        {
          label: '合同号',
          fixed: 'left',
          prop: 'contractCode'
        },
        {
          label: '合同名称',
          fixed: 'left',
          prop: 'contractName'
        },
        {
          label: '客户名称',
          prop: 'customerName'
        },
        {
          label: '合同签署人名称',
          prop: 'contractSignUserName'
        },
        {
          label: '合同签署日期',
          prop: 'signDateTime'
        },
        {
          label: '合同额',
          prop: 'contractAmount',
          columnType: 'Money'
        },
        {
          label: '实际收入',
          prop: 'actualIncomeAmount',
          columnType: 'Money'
        },
        {
          label: '累计成本',
          prop: 'accruedCost',
          columnType: 'Money'
        },
        {
          label: '采购订单数量',
          prop: 'procurementOrderCount',
          columnType: 'Tag',
          tag: {
            type: (tag) => {
              return ''
            },
            isConvert: false,
            effect: 'light'
          }
        },
        {
          label: '入库订单数量',
          prop: 'inboundOrderCount',
          columnType: 'Tag',
          tag: {
            type: (tag) => {
              return ''
            },
            isConvert: false,
            effect: 'light'
          }
        },
        {
          label: '出库单数量',
          prop: 'outboundOrderCount',
          columnType: 'Tag',
          tag: {
            type: (tag) => {
              return ''
            },
            isConvert: false,
            effect: 'light'
          }
        },
        {
          label: '发票数量',
          prop: 'billingCount',
          columnType: 'Tag',
          tag: {
            type: (tag) => {
              return ''
            },
            isConvert: false,
            effect: 'light'
          }
        },
        {
          label: '合同状态',
          prop: 'status',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['ContractStatus'],
            type: (row) => {
              if (row.status === 2) {
                return ''
              } else {
                return 'success'
              }
            },
            effect: 'light'
          }
        },
        {
          prop: 'approvalStatus',
          label: '审批状态',
          columnType: 'ApprovalStatus'
        },
        {
          prop: 'approvalUserName',
          label: '审核人'
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
            {
              text: '修改',
              css: 'text',
              click: (index, row) => {
                this.handleEdit(row)
              },
              isDisabled: (row) => {
                return row.approvalStatus !== 0
              }
            },
            {
              text: '执行',
              css: 'text',
              click: (index, row) => {
              },
              isDisabled: (row) => {
                if (row.approvalStatus === 0) {
                  return true
                }
                if (row.status !== 5) {
                  return true
                }
                return false
              }
            },
            {
              text: '挂载入库',
              css: 'text',
              click: (index, row) => {
                this.handleInbound(row)
              },
              isDisabled: (row) => {
                // 草稿无法挂载
                if (row.approvalStatus === 0) {
                  return true
                }
                // 非草稿，合同完结，无法挂载
                if (row.status === 1) {
                  return true
                }
                return false
              }
            },
            {
              text: '挂载出库',
              css: 'text',
              click: (index, row) => {
                this.handleOutbound(row)
              },
              isDisabled: (row) => {
                // 草稿无法挂载
                if (row.approvalStatus === 0) {
                  return true
                }
                // 非草稿，合同完结，无法挂载
                if (row.status === 1) {
                  return true
                }
                return false
              }
            },
            {
              text: '挂载采购',
              css: 'text',
              click: (index, row) => {
                this.handleOrder(row)
              },
              isDisabled: (row) => {
                // 草稿无法挂载
                if (row.approvalStatus === 0) {
                  return true
                }
                // 非草稿，合同完结，无法挂载
                if (row.status === 1) {
                  return true
                }
                return false
              }
            },
            {
              text: '结案',
              css: 'text',
              click: (index, row) => {

              },
              isDisabled: (row) => {
                // 非审核通过的合同不允许结案
                if (row.approvalStatus !== 2) {
                  return true
                }
                return false
              }
            },
            {
              text: '开票',
              css: 'text',
              click: (index, row) => {

              },
              isDisabled: (row) => {
                // 草稿无法挂载
                if (row.approvalStatus === 0) {
                  return true
                }
                // 非草稿，合同完结，无法挂载
                if (row.status === 1) {
                  return true
                }
                return false
              }
            }
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'SaleContractAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'SaleContractEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
      removeSaleContract(ids).then(res => {
        const { code, msg } = res
        if (code === '100') {
          this.$modal.msgSuccess(msg)
        }
      })
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.queryForm = {
        contractCode: undefined,
        contractName: undefined,
        customerId: undefined
      }
    },
    handleOrder(row) {
      this.$router.push({
        name: 'OrderAdd',
        params: {
          saleContractCode: row.contractCode,
          saleContractId: row.id
        }
      })
    },
    handleInbound(row) {
      this.$router.push({
        name: 'InboundAdd',
        params: {
          saleContractCode: row.contractCode,
          saleContractId: row.id
        }
      })
    },
    handleSubmit() {
      var checkedRows = this.$refs.tableList.checkedRows()
      var canSubmit = true
      checkedRows.forEach(function(ele) {
        if (ele.approvalStatus === 1 || ele.approvalStatus === 2) {
          canSubmit = false
        }
      })
      if (canSubmit) {
        // TODO submit
      } else {
        this.$modal.msgWarning('存在重复提交数据，请重新选择！')
      }
    },
    handleOutbound(row) {
      this.$router.push({
        name: 'SaleOutboundAdd',
        params: {
          saleContractCode: row.contractCode,
          saleContractId: row.id
        }
      })
    }
  }
}

</script>
