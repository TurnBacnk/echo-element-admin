<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="销售出库单编号" prop="saleOutboundCode">
        <el-input v-model="queryForm.saleOutboundCode" clearable size="mini" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" @quyertTable="handleQuery" :show-search.sync="showSearch" />
    <page-table ref="tableList" :query-form="queryForm" :data-source="dataSource" :table-column-config="tableColumnConfig" :show-approval="true" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'

export default {
  name: 'Client',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        saleOutboundCode: undefined
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
      dataSource: '/api/sale-outbound/list',
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
          columnType: 'Link',
          prop: 'saleContractCode',
          label: '销售合同',
          link: {
            click: (row, index) => {

            }
          }
        },
        {
          prop: 'outboundTime',
          label: '出库日期'
        },
        {
          prop: 'clientName',
          label: '客户'
        },
        {
          prop: 'saleUserName',
          label: '销售人员'
        },
        {
          prop: 'discountAmount',
          label: '优惠金额'
        },
        {
          prop: 'afterDiscountReceiveAmount',
          label: '优惠后应收款'
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
                // 草稿可以修改
                if (row.approvalStatus === 0) {
                  return false
                }
                if (row.approvalStatus === undefined) {

                }
                return false
              }
            }
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'SaleOutboundAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'SaleOutboundEdit',
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
