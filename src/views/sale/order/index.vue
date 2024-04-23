<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="销售订单编码" prop="saleOrderCode">
        <el-input v-model="queryForm.saleOrderCode" clearable placeholder="请输入销售订单编码" size="mini" />
      </el-form-item>
      <el-form-item label="销售合同号" prop="contractNo">
        <el-input v-model="queryForm.contractNo" clearable placeholder="请输入销售合同号" size="mini" />
      </el-form-item>
      <el-form-item label="销售人员" prop="saleUserId">
        <el-select v-model="queryForm.saleUserId" placeholder="请选择销售人员">
          <el-option
            v-for="saleUser in javaCode['UserBuilder']"
            :key="saleUser.value"
            :label="saleUser.label"
            :value="saleUser.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户">
        <el-select v-model="queryForm.clientId">
          <el-option
            v-for="client in javaCode['CustomerBuilder']"
            :key="client.value"
            :label="client.label"
            :value="client.value"
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
import {delSaleOrderById, delSaleOrderByIds, submitBatchByIds, submitSingleById} from '@/api/business/sale-order'
import { getConstant } from '@/api/common/dict'

export default {
  name: 'SaleOrder',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        saleOrderCode: undefined,
        contractNo: undefined,
        saleUserId: undefined
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
      dataSource: '/api/sale-order/list',
      tableColumnConfig: [],
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['UserBuilder', 'CustomerBuilder']
      },
      constant: [],
      constantConfig: {
        constantNameList: ['ContractType']
      }
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
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
          prop: 'saleOrderCode',
          label: '销售订单编号',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'SaleOrderView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'contractNo',
          label: '合同号'
        },
        {
          prop: 'contractType',
          label: '合同类型',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['ContractType'],
            type: (row) => {
              if (row.contractType === 0) {
                return ''
              } else {
                return 'warning'
              }
            },
            effect: 'light'
          }
        },
        {
          prop: 'saleUserName',
          label: '销售人员'
        },
        {
          prop: 'discountRate',
          label: '优惠率(%)'
        },
        {
          prop: 'discountAmount',
          label: '优惠金额',
          columnType: 'Money'
        },
        {
          prop: 'afterDiscountReceiveAmount',
          label: '优惠后应收金额',
          columnType: 'Money'
        },
        {
          prop: 'clientName',
          label: '客户'
        },
        {
          prop: 'clientContactName',
          label: '客户联系人'
        },
        {
          prop: 'procurementInboundOrderNum',
          label: '采购入库单',
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
          prop: 'saleOutboundOrderNum',
          label: '销售出库单',
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
                if (row.approvalStatus === 0) {
                  return false
                }
                if (row.approvalStatus === 3) {
                  return false
                }
                return true
              },
              icon: 'el-icon-edit'
            },
            {
              text: '删除',
              css: 'text',
              click: (index, row) => {
                this.handleDelById(row.id)
              },
              isDisabled: (row) => {
                if (row.approvalStatus === 0) {
                  return false
                }
                if (row.approvalStatus === 3) {
                  return false
                }
                return true
              },
              icon: 'el-icon-delete'
            },
            {
              text: '提交',
              css: 'text',
              click: (index, row) => {
                submitSingleById(row.id).then(res => {
                  const { code, msg } = res
                  if (code === '100') {
                    this.$modal.msgSuccess(msg)
                    this.handleQuery()
                  }
                })
              },
              icon: 'el-icon-s-promotion',
              isDisabled: (row) => {
                if (row.approvalStatus === 0) {
                  return false
                }
                if (row.approvalStatus === 3) {
                  return false
                }
                return true
              }
            },
            {
              text: '采购订单 ',
              css: 'text',
              click: (index, row) => {
                this.$router.push({
                  name: 'BuyOrderAdd',
                  params: {
                    saleOrderCode: row.saleOrderCode,
                    saleOrderId: row.id
                  }
                })
              },
              icon: 'el-icon-box',
              isDisabled: (row) => {
                if (row.approvalStatus === 2) {
                  if (row.canProcurement === 1) {
                    return false
                  }
                }
                return true
              }
            },
            {
              text: '销售出库',
              css: 'text',
              click: (index, row) => {
                this.$router.push({
                  name: 'SaleOutboundAdd',
                  params: {
                    saleOrderCode: row.saleOrderCode,
                    saleOrderId: row.id
                  }
                })
              },
              icon: 'el-icon-sell',
              isDisabled: (row) => {
                if (row.approvalStatus === 2) {
                  if (row.canOutbound === 1) {
                    return false
                  }
                }
                return true
              }
            }
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'SaleOrderAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'SaleOrderEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
      delSaleOrderByIds(ids).then(res => {
        const { code, msg } = res
        if (code === '100') {
          this.$modal.msgSuccess(msg)
          this.handleQuery()
        }
      })
    },
    handleDelById(id) {
      delSaleOrderById(id).then(res => {
        const { code, msg } = res
        if (code === '100') {
          this.$modal.msgSuccess(msg)
          this.handleQuery()
        }
      })
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {

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
        const ids = this.$refs.tableList.checkedRowIds();
        submitBatchByIds(ids).then(res => {
          const { code, msg } = res
          if (code === '100') {
            this.$modal.msgSuccess(msg)
            this.handleQuery()
          }
        })
      } else {
        this.$modal.msgWarning('存在重复提交数据，请重新选择！')
      }
    }
  }
}

</script>
