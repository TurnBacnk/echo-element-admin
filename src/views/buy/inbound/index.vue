<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="采购入库单编号" prop="inboundCode">
        <el-input v-model="queryForm.inboundCode" clearable size="mini" placeholder="请输入采购入库单编号" />
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
import { delInboundOrderByIds } from '@/api/business/inbound'

export default {
  name: 'Inbound',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        inboundCode: undefined
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
          text: '废弃',
          type: 'danger',
          click: () => {
            this.handleDel()
          },
          plain: true,
          icon: 'el-icon-delete'
        }
      ],
      dataSource: '/api/inbound-order/list',
      tableColumnConfig: []
    }
  },
  async created() {
    await this.init()
  },
  methods: {
    init() {
      this.tableColumnConfig = [
        {
          columnType: 'Index'
        },
        {
          prop: 'inboundCode',
          label: '采购入库单编号'
        },
        {
          prop: 'inboundTime',
          label: '入库时间'
        },
        {
          prop: 'vendorName',
          label: '供应商'
        },
        {
          prop: 'procurementUserName',
          label: '采购人员'
        },
        {
          prop: 'discountAmount',
          label: '优惠金额',
          columnType: 'Money'
        },
        {
          prop: 'afterDiscountPayAmount',
          label: '优惠后应付款',
          columnType: 'Money'
        },
        {
          prop: 'saleContractCode',
          label: '关联的销售合同',
          columnType: 'Link',
          link: {
            click: (index, row) => {

            }
          }
        },
        {
          prop: 'orderCode',
          label: '关联的订单',
          columnType: 'Link',
          link: {
            click: (index, row) => {

            }
          }
        },
        {
          prop: 'returnOrderCode',
          label: '关联的退货单',
          columnType: 'Link',
          link: {
            click: (index, row) => {

            }
          }
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'InboundAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'InboundEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
      delInboundOrderByIds(ids).then(res => {
        const { msg, code } = res
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

    }
  }
}

</script>
