<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="销售退货单编号" prop="saleReturnOrderCode">
        <el-input v-model="queryForm.saleReturnOrderCode" clearable placeholder="请输入销售出库单编号" size="mini" />
      </el-form-item>
      <el-form-item label="退货日期">
        <el-date-picker type="date" v-model="queryForm.saleReturnOrderTime" placeholder="请选择退货日期" clearable  />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" @quyertTable="handleQuery" :show-search.sync="showSearch" />
    <page-table ref="tableList" :query-form="queryForm" :data-source="dataSource" :table-column-config="tableColumnConfig" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import {
  delSaleReturnOrderById, delSaleReturnOrderByIds,
  submitSaleReturnOrderById,
  submitSaleReturnOrderByIds
} from "@/api/business/sale-return";

export default {
  name: 'SaleReturnOrder',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        saleReturnOrderCode: undefined,
        saleReturnOrderTime: undefined
      },
      buttonConfig: [
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
      dataSource: '/api/sale-return/list',
      tableColumnConfig: []
    }
  },
  async created() {
    await this.init()
  },
  methods: {
    init() {
      this.tableColumnConfig = [
        {
          columnType: 'Index'
        },
        {
          prop: 'saleReturnOrderCode',
          label: '销售退货单编号',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'SaleReturnOrderView',
                params: {
                  id: row.id
                }
              })
            }
          },
          width: '300px'
        },
        {
          prop: 'saleOutboundOrderCode',
          label: '销售出库单',
          columnType: 'Link',
          width: '300px',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'SaleOutboundView',
                params: {
                  id: row.saleOutboundOrderId
                }
              })
            }
          }
        },
        {
          prop: 'saleReturnOrderTime',
          label: '退货日期'
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
          prop: 'discountAmount',
          label: '优惠金额',
          columnType: 'Money'
        },
        {
          prop: 'afterDiscountReceiveAmount',
          label: '优惠后应付款',
          columnType: 'Money'
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
              text: '删除',
              css: 'text',
              click: (index, row) => {
                delSaleReturnOrderById(row.id).then(res => {
                  const { code, msg } = res
                  if (code === '100') {
                    this.$modal.msgSuccess(msg)
                    this.handleQuery()
                  }
                })
              },
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
              text: '提交',
              css: 'text',
              click: (index, row) => {
                submitSaleReturnOrderById(row.id).then(res => {
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
        name: 'SaleReturnOrderAdd',
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'SaleReturnOrderEdit',
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
        delSaleReturnOrderByIds(ids).then(res => {
          const { code, msg } = res
          if (code === '100') {
            this.$modal.msgSuccess(msg)
            this.handleQuery()
          }
        })
      }

    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.$refs.queryForm.resetFields()
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
        let ids = this.$refs.tableList.checkedRowIds();
        submitSaleReturnOrderByIds(ids).then(res => {
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
