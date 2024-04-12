<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="退货单编号" prop="returnOrderCode">
        <el-input v-model="queryForm.returnOrderCode" clearable size="mini" placeholder="请输入退货单编号" />
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
import {getConstant} from "@/api/common/dict";

export default {
  name: 'Return',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        returnOrderCode: undefined
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
      dataSource: '/api/return-order/list',
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['ReturnOrderStatus']
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
          prop: 'returnOrderCode',
          label: '退货单编号',
          columnType: 'Link',
          link: {
            click: (index, row) => {}
          }
        },
        {
          prop: 'inboundOrderCode',
          label: '关联的入库单',
          columnType: 'Link',
          link: {
            click: (index, row) => {}
          }
        },
        {
          prop: 'returnOrderTime',
          label: '退货时间'
        },
        {
          prop: 'vendorName',
          label: '供应商名称'
        },
        {
          prop: 'procurementUserName',
          label: '采购人员'
        },
        {
          prop: 'discountAmount',
          label: '优惠金额'
        },
        {
          prop: 'afterDiscountPayAmount',
          label: '优惠后应付款'
        },
        {
          prop: 'status',
          label: '订单状态',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['ReturnOrderStatus'],
            type: (row) => {
              if (row.status === 0) {
                return 'info'
              }
              if (row.status === 1) {
                return ''
              }
              if (row.status === 2) {
                return 'success'
              }
            },
            effect: 'light'
          }
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
        name: 'ReturnOrderAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'ReturnEdit',
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
      this.queryForm = {
        returnOrderCode: undefined
      }
    }
  }
}

</script>
