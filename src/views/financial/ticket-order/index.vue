<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="发票号" prop="invoiceNo">
        <el-input v-model="queryForm.invoiceNo" size="mini" clearable placeholder="请输入发票号" />
      </el-form-item>
      <el-form-item label="供应商" prop="vendorId">
        <el-select v-model="queryForm.vendorId" placeholder="请选择供应商">
          <el-option
            v-for="vendor in javaCode['VendorBuilder']"
            :key="vendor.value"
            :value="vendor.value"
            :label="vendor.label"
          />
        </el-select>
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
  deleteTicketOrderById,
  deleteTicketOrderByIds,
  submitTicketOrderById,
  submitTicketOrderByIds
} from "@/api/business/ticket-order";
import {getJavaCode} from "@/api/common/dict";

export default {
  name: 'TicketOrder',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        invoiceNo: undefined,
        vendorId: undefined
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
      dataSource: '/api/financial-ticket-order/list',
      tableColumnConfig: [],
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['VendorBuilder']
      }
    }
  },
  async created() {
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
          columnType: 'Link',
          prop: 'invoiceNo',
          label: '开票号',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'FinancialTicketOrderView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'invoiceDate',
          label: '收票日期'
        },
        {
          prop: 'invoiceTitle',
          label: '发票抬头'
        },
        {
          prop: 'invoiceUserName',
          label: '收票人'
        },
        {
          prop: 'orderCode',
          label: '收票单据号',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'BuyInboundView',
                params: {
                  id: row.orderId
                }
              })
            }
          }
        },
        {
          prop: 'amount',
          label: '收票金额',
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
              text: '提交',
              css: 'text',
              click: (index, row) => {
                submitTicketOrderById(row.id).then(res => {
                  const { code, msg } = res
                  if (code === '100') {
                    this.$modal.msgSuccess(msg)
                    this.handleQuery()
                  }
                })
              },
              isDisabled: (row) => {
                if (row.approvalStatus === 0 || row.approvalStatus === 3) {
                  return false
                }
                return true
              }
            },
            {
              text: '删除',
              css: 'text',
              click: (index, row) => {
                deleteTicketOrderById(row.id).then(response => {
                  const { code, msg } = response
                  if (code === '100') {
                    this.$modal.msgSuccess(msg)
                    this.handleQuery()
                  }
                })
              },
              isDisabled: (row) => {
                return false
              }
            },
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: '',
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'FinancialTicketOrderEdit',
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
        deleteTicketOrderByIds(ids).then(res => {
          const { msg, code } = res
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
        var checkedRowIds = this.$refs.tableList.checkedRowIds();
        submitTicketOrderByIds(checkedRowIds).then(res =>{
          const { msg, code } = res
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
