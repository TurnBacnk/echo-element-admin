<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="调拨单编号" prop="transferOrderCode">
        <el-input clearable size="mini" placeholder="请输入调拨单编号" v-model="queryForm.transferOrderCode" />
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
  deleteTransferOrderById,
  deleteTransferOrderByIds,
  submitTransferOrderById,
  submitTransferOrderByIds
} from "@/api/business/repo-transfer";

export default {
  name: 'RepoTransferOrder',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        transferOrderCode: undefined
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
      dataSource: '/api/repo-transfer-order/list',
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
          prop: 'transferOrderCode',
          label: '调拨单编号',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'RepoTransferOrderView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'transferOutWarehouseName',
          label: '调出仓库'
        },
        {
          prop: 'transferInWarehouseName',
          label: '调入仓库'
        },
        {
          prop: 'transferOrderDate',
          label: '调拨日期'
        },
        {
          prop: 'createByName',
          label: '调拨人'
        },
        {
          prop: 'totalAmount',
          columnType: 'Money',
          label: '调拨合计成本'
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
                if (row.approvalStatus === 2) {
                  return true
                }
                if (row.approvalStatus === 1) {
                  return true
                }
                return false
              }
            },
            {
              text: '删除',
              css: 'text',
              click: (index, row) => {
                deleteTransferOrderById(row.id).then(response => {
                  const { code, msg } = response
                  if (code === '100') {
                    this.$modal.msgSuccess(msg)
                    this.handleQuery()
                  }
                })
              },
              isDisabled: (row) => {
                if (row.approvalStatus === 2) {
                  return true
                }
                if (row.approvalStatus === 1) {
                  return true
                }
                return false
              }
            },
            {
              text: '提交',
              css: 'text',
              click: (index, row) => {
                submitTransferOrderById(row.id).then(res => {
                  const { code, msg } = res
                  if (code === '100') {
                    this.$modal.msgSuccess(msg)
                    this.handleQuery()
                  }
                })
              },
              isDisabled: (row) => {
                if (row.approvalStatus === 2) {
                  return true
                }
                if (row.approvalStatus === 1) {
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
        name: 'RepoTransferOrderAdd',
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'RepoTransferOrderEdit',
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
        deleteTransferOrderByIds(ids).then(res => {
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
        const ids = this.$refs.tableList.checkedRowIds()
        submitTransferOrderByIds(ids).then(res => {
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
