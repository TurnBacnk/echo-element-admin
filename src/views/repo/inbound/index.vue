<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="其他出库单编号" prop="otherInboundCode">
        <el-input size="mini" clearable placeholder="请输入其他出库单编号" />
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
import {deleteOtherInboundByIds, submitOtherInboundById, submitOtherInboundByIds} from "@/api/business/other-inbound";
import {submitInboundOrderByIds} from "@/api/business/inbound";

export default {
  name: 'OtherInbound',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {},
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
      dataSource: '/api/repo-other-inbound/list',
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
          prop: 'otherInboundCode',
          label: '入库单编号',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'RepoOtherInboundView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'otherInboundDate',
          label: '入库时间'
        },
        {
          prop: 'warehouseName',
          label: '仓库'
        },
        {
          prop: 'totalAmount',
          label: '总金额',
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
                submitOtherInboundById(row.id).then(res => {
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
        name: 'RepoOtherInboundAdd',
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'RepoOtherInboundEdit',
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
        deleteOtherInboundByIds(ids).then(res => {
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

    },
    handleSubmit() {
      const checkedRows = this.$refs.tableList.checkedRows()
      let canSubmit = true
      checkedRows.forEach(function(ele) {
        if (ele.approvalStatus === 1 || ele.approvalStatus === 2) {
          canSubmit = false
        }
      })
      if (canSubmit) {
        const ids = this.$refs.tableList.checkedRowIds();
        submitOtherInboundByIds(ids).then(res => {
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
