<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="收款时间" prop="receiveOrderTime">
        <el-date-picker type="date" v-model="queryForm.receiveOrderTime" placeholder="请选择收款时间" value-format="yyyy-MM-dd" clearable/>
      </el-form-item>
      <el-form-item label="客户">
        <el-select v-model="queryForm.clientId" placeholder="请选择客户" clearable>
          <el-option
            v-for="client in javaCode['CustomerBuilder']"
            :key="client.value"
            :label="client.label"
            :value="client.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收款类型" prop="receiveType">
        <el-select v-model="queryForm.receiveType" clearable placeholder="请选择收款类型">
          <el-option
            v-for="type in constant['ReceiveType']"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收款人" prop="receiveUserId">
        <el-select v-model="queryForm.receiveUserId" placeholder="请选择收款人" clearable>
          <el-option
            v-for="user in javaCode['UserBuilder']"
            :key="user.value"
            :label="user.label"
            :value="user.value"
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
import { getConstant, getJavaCode } from '@/api/common/dict'

export default {
  name: 'ReceiveOrder',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        receiveOrderTime: undefined,
        clientId: undefined,
        receiveType: undefined,
        receiveUserId: undefined,
      },
      buttonConfig: [
        {
          text: '预收',
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
      dataSource: '/api/financial-receive-order/list',
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['ReceiveType'],
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CustomerBuilder', 'UserBuilder'],
      }
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
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
          prop: 'receiveOrderCode',
          label: '单据编号',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'ReceiveOrderView',
                params: {
                  id: row.id
                }
              })
            }
          },
          fixed: 'left',
          width: '250px'
        },
        {
          prop: 'receiveOrderTime',
          label: '收款日期'
        },
        {
          prop: 'clientName',
          label: '客户名称'
        },
        {
          prop: 'receiveUserName',
          label: '收款人'
        },
        {
          prop: 'receiveType',
          label: '收款类别',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['ReceiveType'],
            type: (row) => {
              return ''
            },
            effect: 'light'
          }
        },
        {
          prop: 'receiveAmount',
          label: '收款金额',
          columnType: 'Money'
        },
        {
          prop: 'preReceiveAmount',
          label: '预收金额',
          columnType: 'Money'
        },
        {
          prop: 'preReceiveRemainderAmount',
          label: '预收余额',
          columnType: 'Money'
        },
        {
          prop: 'capitalAccount',
          label: '资金账户'
        },
        {
          prop: 'createByName',
          label: '创建人'
        },
        {
          prop: 'remark',
          label: '单据备注'
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
              icon: 'el-icon-edit',
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
              icon: 'el-icon-s-promotion',
              click: (index, row) => {

              }
            },
            {
              text: '删除',
              css: 'text',
              icon: 'el-icon-delete',
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
            },
          ]
        }
      ]
    },
    handleAdd() {
      // 预收
      this.$router.push({
        name: 'FinancialReceiveOrderAdd',
        params: {
          receiveType: 2
        }
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'FinancialReceiveOrderEdit',
        params: {
          receiveType: row.receiveType,
          id: row.id,
          clientId: row.clientId,
          clientName: row.clientName
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
