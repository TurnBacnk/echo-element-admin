<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="组装单单号" prop="assemblyOrderCode">
        <el-input v-model="queryForm.assemblyOrderCode" clearable size="mini" placeholder="请输入组装单单号" />
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
  deleteAssemblyById,
  deleteAssemblyByIds,
  submitAssemblyBatchByIds,
  submitAssemblyById
} from '@/api/business/assembly'

export default {
  name: 'RepoAssembly',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        assemblyOrderCode: undefined
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
      dataSource: '/api/repo-assembly/list',
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
          prop: 'assemblyOrderCode',
          label: '组装单号',
          width: '240px',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'RepoAssemblyView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'assemblyOrderDate',
          label: '组装日期'
        },
        {
          prop: 'assemblyOrderAmount',
          label: '组装费用'
        },
        {
          prop: 'productCode',
          label: '成品编码'
        },
        {
          prop: 'productName',
          label: '成品名称'
        },
        {
          prop: 'productSpec',
          label: '成品规格'
        },
        {
          prop: 'unit',
          label: '单位'
        },
        {
          prop: 'warehouseName',
          label: '仓库名称'
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
              text: '提交',
              css: 'text',
              click: (index, row) => {
                submitAssemblyById(row.id).then(res => {
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
            },
            {
              text: '删除',
              css: 'text',
              click: (index, row) => {
                deleteAssemblyById(row.id).then(response => {
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
            }
          ]
        }
      ]
    },
    handleEdit(row) {
      this.$router.push({
        name: 'RepoAssemblyEdit',
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
        deleteAssemblyByIds(ids).then(res => {
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
        var ids = this.$refs.tableList.checkedRowIds()
        submitAssemblyBatchByIds(ids).then(res => {
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
