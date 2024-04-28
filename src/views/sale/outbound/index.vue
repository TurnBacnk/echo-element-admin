<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="销售出库单编号" prop="saleOutboundCode">
        <el-input v-model="queryForm.saleOutboundCode" clearable size="mini" placeholder="请输入销售出库单编号" />
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
import {
  delSaleOutboundById,
  delSaleOutboundByIds,
  submitSaleOutboundOrderById,
  submitSaleOutboundOrderByIds
} from '@/api/business/sale-outbound'
import {getConstant} from '@/api/common/dict'

export default {
  name: 'Client',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        saleOutboundCode: undefined
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
      dataSource: '/api/sale-outbound/list',
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['SaleOutboundStatus']
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
          columnType: 'Link',
          prop: 'saleOrderCode',
          label: '销售订单',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'SaleOrderView',
                params: {
                  id: row.saleOrderId
                }
              })
            }
          }
        },
        {
          columnType: 'Link',
          prop: 'saleOutboundCode',
          label: '销售出库单编号',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'SaleOutboundView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'outboundTime',
          label: '出库日期'
        },
        {
          prop: 'clientName',
          label: '客户'
        },
        {
          prop: 'saleUserName',
          label: '销售人员'
        },
        {
          prop: 'discountAmount',
          label: '优惠金额'
        },
        {
          prop: 'afterDiscountReceiveAmount',
          label: '优惠后应收款'
        },
        {
          prop: 'status',
          label: '出库单状态',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['SaleOutboundStatus'],
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
                // 草稿可以修改
                if (row.approvalStatus === 0) {
                  return false
                }
                return true
              }
            },
            {
              text: '删除',
              css: 'text',
              click: (index, row) => {
                this.handleDelById(row.id)
              },
              isDisabled: (row) => {
                // 草稿允许删除
                if (row.approvalStatus === 0 || row.approvalStatus === 3) {
                  return false
                }
                return true
              }
            },
            {
              text: '提交',
              css: 'text',
              click: (index, row) => {
                submitSaleOutboundOrderById(row.id).then(res => {
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
              text: '销售退货',
              css: 'text',
              click: (index, row) => {
                this.$router.push({
                  name: 'SaleReturnOrderAdd',
                  params: {
                    saleOutboundId: row.id,
                    saleOutboundCode: row.saleOutboundCode
                  }
                })
              },
              isDisabled: (row) => {
                if (row.approvalStatus === 2) {
                  if (row.returnStatus !== 2) {
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
        name: 'SaleOutboundAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'SaleOutboundEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const rows = this.$refs.tableList.checkedRows()
      let canDel = true
      rows.forEach((ele) => {
        if (ele.approvalStatus === 1) {
          canDel = false
          this.$modal.msgWarning('勾选项中有审核通过订单，不可删除')
        } else if (ele.approvalStatus === 2) {
          canDel = false
          this.$modal.msgWarning('勾选项中有审核中的订单，不可删除')
        }
      })
      if (canDel) {
        const ids = this.$refs.tableList.checkedRowIds()
        delSaleOutboundByIds(ids).then(res => {
          const { msg, code } = res
          if (code === '100') {
            this.$modal.msgSuccess(msg)
            this.handleQuery()
          }
        })
      }
    },
    handleDelById(id) {
      delSaleOutboundById(id).then(res => {
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
    handleSubmitByIds() {
      var checkedRows = this.$refs.tableList.checkedRows()
      if (checkedRows.length === 0) {
        this.$modal.msgWarning('请选择数据')
        return
      }
      var canSubmit = true
      checkedRows.forEach(function(ele) {
        if (ele.approvalStatus === 1 || ele.approvalStatus === 2) {
          canSubmit = false
        }
      })
      if (canSubmit) {
        const ids = this.$refs.tableList.checkedRowIds()
        submitSaleOutboundOrderByIds(ids).then(res => {
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
    restQuery() {
      this.$refs.queryForm.resetFields()
    },
    changeSaleOutboundStatus(id, status) {



    }
  }
}

</script>
