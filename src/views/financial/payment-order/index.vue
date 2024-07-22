<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="付款时间" prop="paymentOrderTime">
        <el-date-picker v-model="queryForm.receiveOrderTime" type="date" placeholder="请选择收款时间" value-format="yyyy-MM-dd" clearable />
      </el-form-item>
      <el-form-item label="供应商" prop="vendorId">
        <el-select v-model="queryForm.vendorId" placeholder="请选择供应商" clearable>
          <el-option
            v-for="vendor in javaCode['VendorBuilder']"
            :key="vendor.value"
            :label="vendor.label"
            :value="vendor.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="付款类型" prop="paymentType">
        <el-select v-model="queryForm.paymentType" clearable placeholder="请选择付款类型">
          <el-option
            v-for="type in constant['PaymentType']"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="付款人" prop="payUserId">
        <el-select v-model="queryForm.payUserId" placeholder="请选择付款人" clearable>
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
    <button-group :button-config="buttonConfig" :show-search.sync="showSearch" @quyertTable="handleQuery" />
    <page-table ref="tableList" :query-form="queryForm" :data-source="dataSource" :table-column-config="tableColumnConfig" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import { getConstant, getJavaCode } from '@/api/common/dict'
import {
  deletePaymentOrderById,
  deletePaymentOrderByIds,
  submitPaymentOrderById,
  submitPaymentOrderByIds
} from '@/api/business/payment-order'

export default {
  name: 'PaymentOrder',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        paymentOrderTime: undefined,
        vendorId: undefined,
        paymentType: undefined,
        payUserId: undefined
      },
      buttonConfig: [
        {
          text: '预付',
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
      dataSource: '/api/financial-payment-order/list',
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['PaymentType']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['VendorBuilder', 'UserBuilder']
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
          prop: 'paymentOrderCode',
          label: '单据编号',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'FinancialPaymentOrderView',
                params: {
                  id: row.orderId,
                  paymentType: row.paymentType,
                  vendorId: row.vendorId,
                  vendorName: row.vendorName
                }
              })
            }
          },
          fixed: 'left',
          width: '250px'
        },
        {
          prop: 'paymentType',
          label: '付款类型',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['PaymentType'],
            type: (row) => {
              return ''
            },
            effect: 'light'
          },
          width: '100px'
        },
        {
          prop: 'payTime',
          label: '付款日期',
          width: '150px'
        },
        {
          prop: 'vendorName',
          label: '供应商',
          width: '150px'
        },
        {
          prop: 'amount',
          label: '应付金额',
          columnType: 'Money',
          width: '150px'
        },
        {
          prop: 'procurementUserName',
          label: '采购人员',
          width: '150px'
        },
        {
          label: '付款人员',
          prop: 'payUserName',
          width: '150px'
        },
        {
          prop: 'remark',
          label: '单据备注',
          width: '150px'
        },
        {
          prop: 'lastPayTime',
          label: '最后付款日期',
          width: '150px'
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
                submitPaymentOrderById(row.id).then(res => {
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
              text: '删除',
              css: 'text',
              icon: 'el-icon-delete',
              click: (index, row) => {
                deletePaymentOrderById(row.id).then(response => {
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
          ],
          fixed: 'right',
          width: '200px'
        }
      ]
    },
    handleAdd() {
      // 预收
      this.$router.push({
        name: 'FinancialPaymentOrderAdd',
        params: {
          paymentType: 2
        }
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'FinancialPaymentOrderEdit',
        params: {
          paymentType: row.paymentType,
          id: row.orderId
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
        deletePaymentOrderByIds(ids).then(res => {
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
      const checkedRows = this.$refs.tableList.checkedRows()
      let canSubmit = true
      checkedRows.forEach(function(ele) {
        if (ele.approvalStatus === 1 || ele.approvalStatus === 2) {
          canSubmit = false
        }
      })
      if (canSubmit) {
        const checkedRowIds = this.$refs.tableList.checkedRowIds()
        submitPaymentOrderByIds(checkedRowIds).then(res => {
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
