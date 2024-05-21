<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="" prop="">

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
import { getConstant } from '@/api/common/dict'

export default {
  name: 'Ticket',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {},
      buttonConfig: [
      ],
      dataSource: '/api/financial-ticket/list',
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['OrderType']
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
          prop: 'orderCode',
          label: '单据编号',
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
          label: '单据类型',
          prop: 'orderType',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['OrderType'],
            type: (row) => {
              return ""
            },
            effect: 'light'
          }
        },
        {
          label: '单据日期',
          prop: 'orderTime'
        },
        {
          prop: 'vendorName',
          label: '供应商d'
        },
        {
          label: '应开票金额',
          prop: 'invoiceAmount',
          columnType: 'Money'
        },
        {
          label: '已开票金额',
          prop: 'alreadyInvoiceAmount',
          columnType: 'Money'
        },
        {
          label: '未开票金额',
          prop: 'unInvoiceAmount',
          columnType: 'Money'
        },
        {
          label: '销售人员',
          prop: 'saleUserName'
        },
        {
          label: '开票状态',
          prop: 'invoiceStatus',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['ReceiveStatus'],
            type: (row) => {
              if (row.invoiceStatus === 0) {
                return 'warning'
              }
              return 'success'
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
