<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="核销日期" prop="writeOffTime">
        <el-date-picker
          v-model="queryForm.writeOffTime"
          value-format="yyyy-MM-dd"
          placeholder="请选择核销日期"
          clearable
          size="mini"
        />
      </el-form-item>
      <el-form-item label="客户" prop="clientId">
        <el-select
          v-model="queryForm.clientId"
          clearable
          placeholder="请选择客户"
        >
          <el-option
            v-for="client in javaCode['CustomerBuilder']"
            :key="client.key"
            :value="client.value"
            :label="client.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="核销人员" prop="writeOffUserId">
        <el-select
          v-model="queryForm.writeOffUserId"
          clearable
          placeholder="请选择客户"
        >
          <el-option
            v-for="user in javaCode['UserBuilder']"
            :key="user.key"
            :value="user.value"
            :label="user.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="核销编码" prop="writeOffCode">
        <el-input
          v-model="queryForm.writeOffCode"
          placeholder="请输入核销编码"
          clearable
        />
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
import { getJavaCode } from '@/api/common/dict'

export default {
  name: 'WriteOff',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        writeOffTime: undefined,
        clientId: undefined,
        writeOffUserId: undefined,
        writeOffCode: undefined
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
      dataSource: 'api/financial-write-off/list',
      tableColumnConfig: [],
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CustomerBuilder', 'UserBuilder']
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
          prop: 'writeOffCode',
          label: '核销单编号',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'FinancialWriteOffView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'writeOffTime',
          label: '核销日期'
        },
        {
          prop: 'writeOffType',
          label: '核销日期'
        },
        {
          prop: 'clientName',
          label: '客户'
        },
        {
          prop: 'vendorName',
          label: '供应商'
        },
        {
          prop: 'writeUserName',
          label: '核销人'
        },
        {
          prop: 'amount',
          label: '本次核销金额',
          columnType: 'Money'
        },
        {
          prop: 'remark',
          label: '备注'
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
                deleteOtherOutboundById(row.id).then(response => {
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
        name: ''
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: '',
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
        deleteOtherOutboundByIds(ids).then(res => {
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
        // TODO submit
      } else {
        this.$modal.msgWarning('存在重复提交数据，请重新选择！')
      }
    }
  }
}

</script>
