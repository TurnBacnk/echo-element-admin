<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="采购订单编号" prop="orderCode">
        <el-input v-model="queryForm.orderCode" placeholder="请输入采购订单编号" clearable />
      </el-form-item>
      <el-form-item label="单据日期" prop="orderTime">
        <el-date-picker v-model="queryForm.orderTime" placeholder="请选择单据日期" clearable type="date" size="small" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="供应商" prop="vendorId">
        <el-select v-model="queryForm.vendorId">
          <el-option
            v-for="vendor in javaCode['VendorBuilder']"
            :key="vendor.key"
            :label="vendor.label"
            :value="vendor.value"
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
import {getConstant, getDictionary, getJavaCode} from '@/api/common/dict'
import {delBuyOrderByIds, submitBuyOrderById, submitBuyOrderByIds} from '@/api/business/order'

export default {
  name: 'BuyOrder',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        orderCode: undefined,
        deliverDate: undefined,
        vendorId: undefined,
        procurementUserId: undefined,
        warehouseId: undefined
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
          type: 'warning',
          click: () => {
            this.handleSubmitByIds()
          },
          icon: 'el-icon-s-promotion',
          plain: true
        },
        {
          text: '删除',
          type: 'danger',
          click: () => {
            this.handleDelByIds()
          },
          plain: true,
          icon: 'el-icon-delete'
        }
      ],
      dataSource: '/api/order/list',
      tableColumnConfig: [],
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['OrderStatus']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['VendorBuilder']
      },
      constant: [],
      constantConfig: {
        constantNameList: ['OrderStatus']
      }
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
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
          columnType: 'Index',
          type: 'selection'
        },
        {
          label: '采购订单编号',
          prop: 'orderCode',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'BuyOrderView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          label: '合同号',
          prop: 'contractCode'
        },
        {
          label: '单据日期',
          prop: 'orderTime'
        },
        {
          label: '交货日期',
          prop: 'deliveryDate'
        },
        {
          label: '供应商',
          prop: 'vendorName'
        },
        {
          label: '采购人员',
          prop: 'procurementUsername'
        },
        {
          label: '优惠金额',
          prop: 'discountAmount',
          columnType: 'Money'
        },
        {
          label: '优惠后应付款',
          prop: 'afterDiscountPayAmount',
          columnType: 'Money'
        },
        {
          label: '订单状态',
          prop: 'status',
          columnType: 'Tag',
          tag: {
            dictList: this.constant['OrderStatus'],
            type: (row) => {
              if (row === 0) {
                return 'info'
              }
              if (row === 1) {
                return 'success'
              }
              if (row === 2) {
                return 'info'
              }
              if (row === 3) {
                return 'primary'
              }
              if (row === 4) {
                return 'danger'
              }
              if (row === 5) {
                return 'success'
              }
              if (row === 6) {
                return 'primary'
              }
            },
            effect: 'light',
            isConvert: true
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
                if (row.approvalStatus === 0) {
                  return false
                }
                if (row.approvalStatus === 3) {
                  return false
                }
                return true
              },
              icon: 'el-icon-edit'
            },
            {
              text: '提交',
              css: 'text',
              click: (index, row) => {
                submitBuyOrderById(row.id).then(res => {
                  const { code, msg } = res
                  if (code === '100') {
                    this.$modal.msgSuccess(msg)
                    this.handleQuery()
                  }
                })
              },
              icon: 'el-icon-s-promotion',
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
              text: '采购入库',
              css: 'text',
              click: (index, row) => {
                this.$router.push({
                  name: 'BuyInboundAdd',
                  params: {
                    orderId: row.id,
                    orderCode: row.orderCode
                  }
                })
              },
              icon: 'el-icon-box',
              isDisabled: (row) => {
                if (row.approvalStatus === 2) {
                  return false
                }
                return true
              }
            }
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'BuyOrderAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'BuyOrderEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDelByIds() {
      const ids = this.$refs.tableList.checkedRowIds()
      delBuyOrderByIds(ids).then(res => {
        const { code, msg } = res
        if (code === '100') {
          this.$modal.msgSuccess(msg)
          this.handleQuery()
        }
      })
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.queryForm = {
        orderCode: undefined,
        deliverDate: undefined,
        vendorId: undefined,
        procurementUserId: undefined,
        warehouseId: undefined
      }
    },
    handleSubmitByIds() {
      var checkedRows = this.$refs.tableList.checkedRows()
      var canSubmit = true
      checkedRows.forEach(function(ele) {
        if (ele.approvalStatus === 1 || ele.approvalStatus === 2) {
          canSubmit = false
        }
      })
      if (canSubmit) {
        const ids = this.$refs.tableList.checkedRowIds()
        submitBuyOrderByIds(ids).then(res => {
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
