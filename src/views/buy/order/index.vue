<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="采购订单编号" prop="orderCode">
        <el-input v-model="queryForm.orderCode" placeholder="请输入采购订单编号" clearable />
      </el-form-item>
      <el-form-item label="单据日期" prop="orderTime">
        <el-date-picker v-model="queryForm.orderTimeList" start-placeholder="开始日期" end-placeholder="结束日期" clearable type="daterange" size="small" value-format="yyyy-MM-dd" :picker-options="pickerOptions" />
      </el-form-item>
      <el-form-item label="供应商" prop="vendorId">
        <el-select v-model="queryForm.vendorIds" multiple>
          <el-option
            v-for="vendor in javaCode['VendorBuilder']"
            :key="vendor.key"
            :label="vendor.label"
            :value="vendor.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="approvalStatus">
        <el-select v-model="queryForm.approvalStatusList" placeholder="请选择审核状态" clearable multiple>
          <el-option
            v-for="approvalStatus in constant['ApprovalTextConstant']"
            :key="approvalStatus.value"
            :value="approvalStatus.value"
            :label="approvalStatus.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="采购人员" prop="procurementUserId">
        <el-select v-model="queryForm.procurementUserIds" placeholder="请选择采购人员" clearable multiple>
          <el-option
            v-for="user in javaCode['UserBuilder']"
            :key="user.value"
            :label="user.label"
            :value="user.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="queryForm.orderStatusList" placeholder="请选择订单状态" clearable multiple>
          <el-option
            v-for="status in constant['OrderStatus']"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" :show-search.sync="showSearch" @quyertTable="handleQuery" :upload-url="uploadUrl" />
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
        vendorIds: undefined,
        procurementUserIds: undefined,
        warehouseId: undefined,
        orderStatusList: undefined,
        orderTimeList: this.getCurrentMonthRange(),
        approvalStatusList: undefined
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
      uploadUrl: '/api/order/upload',
      tableColumnConfig: [],
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['OrderStatus']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['VendorBuilder', 'UserBuilder']
      },
      constant: [],
      constantConfig: {
        constantNameList: ['OrderStatus', 'ApprovalTextConstant']
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
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
          },
          width: '300px'
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
          columnType: 'Money',
          width: '150'
        },
        {
          label: '优惠后应付款',
          prop: 'afterDiscountPayAmount',
          columnType: 'Money',
          width: '150'
        },
        {
          label: '已入库金额',
          prop: 'alreadyInboundAmount',
          columnType: 'Money',
          width: '150'
        },
        {
          label: '未入库金额',
          prop: 'unInboundAmount',
          columnType: 'Money',
          width: '150'
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
                  if (row.canInbound === 1) {
                    return false
                  }
                }
                return true
              }
            }
          ]
        }
      ]
    },
    getCurrentMonthRange() {
      const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      return [start, end];
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
      var checkedRows = this.$refs.tableList.checkedRows();
      let canDel = true
      checkedRows.forEach(row => {
        if (row.approvalStatus === 2) {
          canDel = false
          this.$modal.msgWarning('勾选项中有审核通过订单，不可删除')
        } else if (row.approvalStatus === 1) {
          canDel = false
          this.$modal.msgWarning('勾选项中有审核中的订单，不可删除')
        }
      })
      if (canDel) {
        const ids = this.$refs.tableList.checkedRowIds()
        delBuyOrderByIds(ids).then(res => {
          const { code, msg } = res
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
