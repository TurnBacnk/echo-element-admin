<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="采购入库单编号" prop="inboundCode">
        <el-input v-model="queryForm.inboundCode" clearable size="mini" placeholder="请输入采购入库单编号" />
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
import {
  delInboundOrderById,
  delInboundOrderByIds,
  submitInboundOrderById,
  submitInboundOrderByIds
} from '@/api/business/inbound'
import {delBuyOrderByIds} from "@/api/business/order";

export default {
  name: 'Inbound',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        inboundCode: undefined
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
            this.handleDelByIds()
          },
          plain: true,
          icon: 'el-icon-delete'
        }
      ],
      dataSource: '/api/inbound-order/list',
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
          prop: 'inboundCode',
          label: '采购入库单编号',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'BuyInboundView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'inboundTime',
          label: '入库时间'
        },
        {
          prop: 'vendorName',
          label: '供应商'
        },
        {
          prop: 'procurementUsername',
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
          prop: 'orderCode',
          label: '关联的采购订单',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'BuyOrderView',
                params: {
                  id: row.orderId
                }
              })
            }
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
              text: '提交',
              css: 'text',
              click: (index, row) => {
                submitInboundOrderById(row.id).then(res => {
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
              text: '删除',
              css: 'text',
              click: (index, row) => {
                delInboundOrderById(row.id).then(res => {
                  const { code, msg } = res
                  if (code === '100') {
                    this.$modal.msgSuccess(msg)
                    this.handleQuery()
                  }
                })
              },
              icon: 'el-icon-delete',
              isDisabled: (row) => {
                if (row.approvalStatus === 0 || row.approvalStatus === 3) {
                  return false
                }
                return true
              }
            },
            {
              text: '采购退货',
              css: 'text',
              click: (index, row) => {
                this.$router.push({
                  name: 'BuyOrderReturnAdd',
                  params: {
                    inboundCode: row.inboundCode,
                    inboundId: row.id
                  }
                })
              },
              icon: 'el-icon-error',
              isDisabled: (row) => {
                if (row.approvalStatus === 2) {
                  if (row.canReturn === 1) {
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
        name: 'InboundAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'BuyInboundEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDelByIds() {
      const rows = this.$refs.tableList.checkedRows()
      rows.forEach(row => {
        if (row.approvalStatus === 2) {
          this.$modal.msgWarning('勾选项中有审核通过订单，不可删除')
        } else if (row.approvalStatus === 1) {
          this.$modal.msgWarning('勾选项中有审核中的订单，不可删除')
        } else {
          const ids = this.$refs.tableList.checkedRowIds()
          delBuyOrderByIds(ids).then(res => {
            const { code, msg } = res
            if (code === '100') {
              this.$modal.msgSuccess(msg)
              this.handleQuery()
            }
          })
        }
      })
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {

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
        submitInboundOrderByIds(ids).then(res => {
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
