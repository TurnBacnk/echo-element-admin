<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryForm" size="mini" :inline="true" v-if="showSearch">
      <el-form-item label="业务标识" prop="businessKey">
        <el-input v-model="queryForm.businessKey" />
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-select v-model="queryForm.status" placeholder="请选择启用状态" clearable>
          <el-option
            v-for="status in constant['Enable']"
            :key="status.value"
            :value="status.value"
            :label="status.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" :show-search.sync="showSearch" @queryTable="handleQuery" />
    <page-table ref="tableList" :query-form="queryForm" :data-source="dataSource" :table-column-config="tableColumnConfig" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import { getConstant } from '@/api/common/dict'
import { enableOrDisableGenerateCodeRule } from '@/api/config/generate-code'

export default {
  name: 'GenerateCode',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        businessKey: undefined,
        status: undefined
      },
      buttonConfig: [
        {
          text: '新增',
          click: () => {
            this.handleAdd()
          },
          plain: false,
          icon: 'el-icon-plus'
        },
        {
          text: '删除',
          type: 'danger',
          plain: false,
          click: () => {
            this.handleDel()
          },
          icon: 'el-icon-delete'
        }
      ],
      dataSource: '/api/generate-code/list',
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['Enable', 'YesOrNo']
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
          type: 'selection'
        },
        {
          label: '业务标识',
          prop: 'businessKey'
        },
        {
          columnType: 'Constant',
          label: '是否附加日期',
          prop: 'withDate',
          constant: {
            constantList: this.constant['YesOrNo'],
            type: (row) => {
              if (row.withDate === 1) {
                return 'success'
              }
              if (row.withDate === 0) {
                return 'info'
              }
            },
            effect: 'light'
          }
        },
        {
          label: '业务表名',
          prop: 'tableName'
        },
        {
          label: '业务字段',
          prop: 'tableCode'
        },
        {
          columnType: 'Constant',
          label: '启用状态',
          prop: 'status',
          constant: {
            constantList: this.constant['Enable'],
            type: (row) => {
              if (row.status === 1) {
                return 'success'
              }
              if (row.status === 0) {
                return 'info'
              }
            },
            effect: 'light'
          }
        },
        {
          label: '操作',
          columnType: 'Operation',
          button: [
            {
              text: '修改',
              css: 'text',
              click: (index, row) => {
                this.handleEdit(row, index)
              },
              plain: true,
              isDisabled: (row) => {
                return false
              },
              icon: 'el-icon-edit'
            },
            {
              text: '禁用',
              css: 'text',
              click: (index, row) => {
                this.handleDisableOrEnable(row, 0)
              },
              isDisabled: (row) => {
                return row.status === 0
              }
            },
            {
              text: '启用',
              css: 'text',
              click: (index, row) => {
                this.handleDisableOrEnable(row, 1)
              },
              isDisabled: (row) => {
                return row.status === 1
              }
            }
          ]
        }
      ]
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    resetQuery() {
      this.queryForm = {
        businessKey: undefined,
        status: undefined
      }
    },
    handleDel() {

    },
    handleAdd() {
      this.$router.push({
        name: 'GenerateCodeAdd'
      })
    },
    handleEdit(row, index) {
      this.$router.push({
        name: 'GenerateCodeEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDisableOrEnable(row, status) {
      enableOrDisableGenerateCodeRule(row.id, status).then(res => {
        const { msg, code } = res
        if (code === '100') {
          this.$modal.msgSuccess(msg)
          this.handleQuery()
        }
      })
    }
  }
}
</script>
