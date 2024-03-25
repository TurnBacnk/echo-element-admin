<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="采购订单编号" prop="orderCode">
        <el-input v-model="queryForm.orderCode" placeholder="请输入采购订单编号" clearable/>
      </el-form-item>
      <el-form-item label="单据日期" prop="deliverDate">
        <el-input v-model="queryForm.deliverDate" placeholder="请输入交货日期" clearable/>
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
    <button-group :button-config="buttonConfig" @quyertTable="handleQuery" :show-search.sync="showSearch" />
    <page-table ref="tableList" :query-form="queryForm" :data-source="dataSource" :table-column-config="tableColumnConfig" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import { getDictionary, getJavaCode } from '@/api/common/dict'

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
          text: '删除',
          type: 'danger',
          click: () => {
            this.handleDel()
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
      }
    }
  },
  async created() {
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
          label:'采购订单编号',
          prop: 'orderCode'
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
          prop: 'vendorName',
        },
        {
          label: '采购人员',
          prop: 'procurementUsername'
        },
        {
          label: '仓库',
          prop: 'warehouseName'
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
            dictList: this.dictionary['OrderStatus'],
            type: (row) => {
              if (row.status === 0) {
                return 'info'
              } else {
                return 'success'
              }
            },
            effect: 'light',
            isConvert: true
          }
        },
        {
          label: '关联的入库单',
          prop: 'associatedInboundOrderId'
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
            }
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
      const ids = this.$refs.tableList.checkedRowIds()
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {

    }
  }
}

</script>
