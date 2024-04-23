<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="退货单编号" prop="returnOrderCode">
        <el-input v-model="queryForm.returnOrderCode" clearable size="mini" placeholder="请输入退货单编号" />
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
import {getConstant} from '@/api/common/dict'
import {delBuyReturnOrderByIds, submitReturnOrderById, submitReturnOrderByIds} from '@/api/business/buy-return'

export default {
  name: 'BuyReturnOrder',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        returnOrderCode: undefined
      },
      buttonConfig: [
        {
          text: '提交',
          type: 'warning',
          click: () => {
            this.handleSubmitByIds()
          },
          icon: 'el-icon-s-promotion',
          plain: true
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
      dataSource: '/api/return-order/list',
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['ReturnOrderStatus']
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
          prop: 'returnOrderCode',
          label: '退货单编号',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'BuyReturnOrderView',
                params: {
                  id: row.id
                }
              })
            }
          },
          width: '300px'
        },
        {
          prop: 'inboundOrderCode',
          label: '关联的入库单',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'BuyInboundView',
                params: {
                  id: row.inboundOrderId
                }
              })
            }
          },
          width: '300px'
        },
        {
          prop: 'returnOrderTime',
          label: '退货时间'
        },
        {
          prop: 'vendorName',
          label: '供应商名称'
        },
        {
          prop: 'procurementUserName',
          label: '采购人员'
        },
        {
          prop: 'discountAmount',
          label: '优惠金额',
          columnType: 'Money'
        },
        {
          prop: 'afterDiscountPayAmount',
          label: '优惠后应付款',
          columnType: 'Money'
        },
        {
          prop: 'status',
          label: '订单状态',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['ReturnOrderStatus'],
            type: (row) => {
              if (row.status === 0) {
                return 'info'
              }
              if (row.status === 1) {
                return ''
              }
              if (row.status === 2) {
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
                return false
              }
            },
            {
              text: '提交',
              css: 'text',
              click: (index, row) => {
                submitReturnOrderById(row.id).then(res => {
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
            }
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'BuyReturnOrderAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'BuyReturnOrderEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      var checkedRows = this.$refs.tableList.checkedRows()
      checkedRows.forEach(row => {
        if (row.approvalStatus === 2) {
          this.$modal.msgWarning('勾选项中有审核通过订单，不可删除')
        } else if (row.approvalStatus === 1) {
          this.$modal.msgWarning('勾选项中有审核中的订单，不可删除')
        } else {
          const ids = this.$refs.tableList.checkedRowIds()
          delBuyReturnOrderByIds(ids).then(res => {
            const { code, msg } = res
            if (code === '100') {
              this.$modal.msgSuccess(msg)
              this.handleQuery()
            }
          })
        }
      })
    },
    handleSubmitByIds() {
      var checkedRows = this.$refs.tableList.checkedRows()
      var canSubmit = true
      checkedRows.forEach(function(ele) {
        if (ele.approvalStatus === 1 || ele.approvalStatus === 2) {
          canSubmit = false
        }
      })
      if (canSubmit) {
        const ids = this.$refs.tableList.checkedRowIds()
        submitReturnOrderByIds(ids).then(res => {
          const { code, msg } = res
          if (code === '100') {
            this.$modal.msgSuccess(msg)
            this.handleQuery()
          }
        })
      } else {
        this.$modal.msgWarning('存在重复提交数据，请重新选择！')
      }
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.queryForm = {
        returnOrderCode: undefined
      }
    }
  }
}

</script>
