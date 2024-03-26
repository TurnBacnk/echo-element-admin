<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input v-model="queryForm.warehouseName" placeholder="请输入仓库名称" />
      </el-form-item>
      <el-form-item label="仓库编码" prop="warehouseCode">
        <el-input v-model="queryForm.warehouseCode" placeholder="请输入仓库编码" />
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
import { disableOrEnabledWarehouse } from '@/api/business/warehouse'
import { getConstant } from '@/api/common/dict'

export default {
  name: 'Warehouse',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        warehouseName: undefined,
        warehouseCode: undefined
      },
      buttonConfig: [
        {
          text: '新增',
          click: () => {
            this.handleAdd()
          },
          plain: true,
          icon: 'el-icon-plus'
        }
      ],
      dataSource: '/api/warehouse/list',
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['Enable']
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
          columnType: 'Index',
        },
        {
          label: '仓库名称',
          prop: 'warehouseName'
        },
        {
          label: '仓库编码',
          prop: 'warehouseCode',
          fixed: 'left'
        },
        {
          label: '仓库地址',
          prop: 'address'
        },
        {
          label: '负责人',
          prop: 'warehouseResponsiblePersonName'
        },
        {
          label: '联系方式',
          prop: 'phone'
        },
        {
          label: '状态',
          prop: 'enable',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['Enable'],
            type: (row) => {
              if (row.enable === 1) {
                return 'success'
              }
              if (row.enable === 0) {
                return 'info'
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
            },
            {
              text: '启用',
              css: 'text',
              click: (index, row) => {
                this.handleEnableOrDisabled(row, 1)
              },
              isDisabled: (row) => {
                return row.enable === 1
              }
            },
            {
              text: '禁用',
              css: 'text',
              click: (index, row) => {
                this.handleEnableOrDisabled(row, 0)
              },
              isDisabled: (row) => {
                return row.enable === 0
              }
            }
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'WarehouseAdd',
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'WarehouseEdit',
        params: {
          id: row.id
        }
      })
    },
    handleEnableOrDisabled(row, status) {
      disableOrEnabledWarehouse(row.id, status).then(res => {
        const { msg, code} = res
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
        warehouseName: undefined,
        warehouseCode: undefined
      }
    }
  }
}

</script>
