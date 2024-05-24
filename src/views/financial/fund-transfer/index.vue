<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="转出账户" prop="transferFormId">
        <el-select
          v-model="queryForm.transferFormId"
          placeholder="请选择转出账户"
          clearable
          size="mini"
        >
          <el-option
            v-for="account in javaCode['CapitalAccountBuilder']"
            :key="account.value"
            :value="account.value"
            :label="account.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转入账户" prop="transferToId">
        <el-select
          v-model="queryForm.transferToId"
          placeholder="请选择转入账户"
          clearable
          size="mini"
        >
          <el-option
            v-for="account in javaCode['CapitalAccountBuilder']"
            :key="account.value"
            :value="account.value"
            :label="account.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单据编号" prop="transferCode">
        <el-input v-model="queryForm.transferCode" clearable size="mini" placeholder="请输入单据编号" />
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
import { getJavaCode } from '@/api/common/dict'
import {
  deleteFundTransferById,
  deleteFundTransferByIds,
  submitFundTransferById,
  submitFundTransferByIds
} from '@/api/business/fund-transfer'
import { submitTransferOrderById } from '@/api/business/repo-transfer'

export default {
  name: 'FinancialFundTransfer',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        transferCode: undefined,
        transferFormId: undefined,
        transferToId: undefined
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
      dataSource: '/api/financial-fund-transfer/list',
      tableColumnConfig: [],
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CapitalAccountBuilder']
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
          prop: 'transferCode',
          label: '单据编号',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'FinancialFundTransferView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'transferDate',
          label: '转账日期'
        },
        {
          prop: 'transferFromName',
          label: '转出账户'
        },
        {
          prop: 'transferToName',
          label: '转入账户'
        },
        {
          prop: 'amount',
          label: '转账金额',
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
                submitFundTransferById(row.id).then(res => {
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
                deleteFundTransferById(row.id).then(response => {
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
            }
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'FinancialFundTransferAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'FinancialFundTransferEdit',
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
        deleteFundTransferByIds(ids).then(res => {
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
        submitFundTransferByIds(ids).then(response => {
          const { code, msg } = response
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
