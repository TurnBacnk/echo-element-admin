<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="业务模块" prop="moduleName">
        <el-select v-model="queryForm.moduleName" placeholder="请输入业务模块" clearable>
          <el-option
            v-for="module in javaCode['ModuleBuilder']"
            :key="module.key"
            :value="module.value"
            :label="module.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="流程名称" prop="approvalName">
        <el-input v-model="queryForm.approvalName" placeholder="请输入流程名称" clearable />
      </el-form-item>
      <el-form-item label="启停状态" prop="status">
        <el-select v-model="queryForm.status" placeholder="请输入启停状态">
          <el-option
            v-for="status in constant['StartPause']"
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
    <button-group :button-config="buttonConfig" :show-search.sync="showSearch" @quyertTable="handleQuery" />
    <page-table ref="tableList" :query-form="queryForm" :data-source="dataSource" :table-column-config="tableColumnConfig" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import { getConstant, getJavaCode } from '@/api/common/dict'
import { deleteConfigById, deleteConfigListByIds, startOrPauseApproval } from '@/api/config/approval'

export default {
  name: 'Client',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        approvalName: undefined,
        status: undefined,
        moduleName: undefined
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
      dataSource: '/api/approval-config/list',
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['StartPause', 'BusinessModel', 'Enable']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['ModuleBuilder']
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
          prop: 'moduleKey',
          label: '业务模块',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['BusinessModel'],
            type: (row) => {
              return ''
            },
            effect: 'light'
          }
        },
        {
          prop: 'approvalName',
          label: '流程名称'
        },
        {
          prop: 'status',
          label: '启停状态',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['Enable'],
            type: (row) => {
              if (row.status === 1) {
                return 'success'
              } else {
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
                if (row.status === 0) {
                  return true
                }
                return false
              }
            },
            {
              text: '启用',
              css: 'text',
              click: (index, row) => {
                this.handleStartOrPause(row, 0)
              },
              isDisabled: (row) => {
                return row.status === 0
              }
            },
            {
              text: '停用',
              css: 'text',
              click: (index, row) => {
                this.handleStartOrPause(row, 1)
              },
              isDisabled: (row) => {
                return row.status === 1
              }
            },
            {
              text: '删除',
              css: 'text',
              click: (index, row) => {
                this.deleteConfigById(row.id)
              },
              isDisabled: (row) => {
                return row.status === 0
              }
            }
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'ApprovalAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'ApprovalEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
      deleteConfigListByIds(ids).then(res => {
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
      this.queryForm = {
        approvalName: undefined,
        status: undefined,
        moduleName: undefined
      }
    },
    handleStartOrPause(row, status) {
      startOrPauseApproval(row.id, status).then(res => {
        const { msg, code } = res
        if (code === '100') {
          this.$modal.msgSuccess(msg)
          this.handleQuery()
        }
      })
    },
    deleteConfigById(id) {
      deleteConfigById(id).then(res => {
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
