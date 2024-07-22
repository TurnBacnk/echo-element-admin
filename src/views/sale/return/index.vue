<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="单据编号" prop="orderCode">
        <el-input v-model="queryForm.orderCode" size="mini" clearable placeholder="请输入单据编号" />
      </el-form-item>
      <el-form-item label="合同号" prop="contractNo">
        <el-input v-model="queryForm.contractNo" size="mini" clearable placeholder="请输入合同号" />
      </el-form-item>
      <el-form-item label="合同日期" prop="contractDate">
        <el-date-picker
          v-model="queryForm.contractDate"
          clearable
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @change="handleContractDateRangeChange"
        />
      </el-form-item>
      <el-form-item label="退货日期" prop="deliveryDate">
        <el-date-picker
          v-model="queryForm.returnDate"
          clearable
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @change="handleDeliveryDateRangeChange"
        />
      </el-form-item>
      <el-form-item prop="saleFromId" label="供应方">
        <el-select v-model="queryForm.saleFromId" placeholder="请选择供应方">
          <el-option
            v-for="company in javaCode['CompanyBuilder']"
            :key="company.key"
            :label="company.label"
            :value="company.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="saleToId" label="采购方">
        <el-select v-model="queryForm.saleToId" placeholder="请选择采购方">
          <el-option
            v-for="custom in javaCode['CustomerBuilder']"
            :key="custom.key"
            :label="custom.label"
            :value="custom.value"
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
import { getJavaCode } from '@/api/common/dict'
import { deleteProcurementOrderById, deleteProcurementOrderByIds } from '@/api/business/procurement-order'
import { submitProcurementReturnOrderByIds } from '@/api/business/procurement-return'
import { deleteReturnById, deleteReturnByIds, submitReturnByIds } from '@/api/business/sales-return'

export default {
  name: 'SalesReturnOrder',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        orderCode: undefined,
        saleFromId: undefined,
        saleToId: undefined,
        contractDate: undefined,
        contractStartDate: undefined,
        contractEndDate: undefined,
        returnDate: undefined,
        returnStartDate: undefined,
        returnEndDate: undefined,
        contractNo: undefined
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
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
      dataSource: '/api/sales/return/list',
      tableColumnConfig: [],
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CompanyBuilder', 'CustomerBuilder']
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
          columnType: 'Index',
        },
        {
          label: '单据编号',
          prop: 'orderCode',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'SalesReturnOrderView',
                params: {
                  id: row.id
                }
              })
            }
          },
          width: 180,
        },
        {
          label: '合同号',
          prop: 'contractNo'
        },
        {
          prop: 'saleFromName',
          label: '供应方'
        },
        {
          prop: 'saleToName',
          label: '采购方'
        },
        {
          prop: 'contractDate',
          label: '合同日期'
        },
        {
          prop: 'returnDate',
          label: '退货日期'
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
                deleteReturnById(row.id).then(response => {
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
        name: 'SalesReturnOrderAdd',
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'SalesReturnOrderEdit',
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
        deleteReturnByIds(ids).then(res => {
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
    handleContractDateRangeChange(value) {
      if (value && value.length === 2) {
        this.queryForm.contractStartDate = value[0]
        this.queryForm.contractEndDate = value[1]
      } else {
        this.queryForm.contractStartDate = ''
        this.queryForm.contractEndDate = ''
      }
    },
    handleDeliveryDateRangeChange(value) {
      if (value && value.length === 2) {
        this.queryForm.returnStartDate = value[1]
        this.queryForm.returnEndDate = value[2]
      } else {
        this.queryForm.returnStartDate = ''
        this.queryForm.returnEndDate = ''
      }
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
        submitReturnByIds(this.$refs.tableList.checkedRowIds()).then(res => {
          const { msg, code } = res
          if (code === '100') {
            this.$modal.msgSuccess(msg)
          }
        })
      } else {
        this.$modal.msgWarning('存在重复提交数据，请重新选择！')
      }
    }
  }
}

</script>
