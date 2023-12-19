<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" size="small">
      <el-form-item label="任务名称" prop="menuName">
        <el-input
          v-model="queryForm.menuName"
          clearable
          placehodler="请输入任务名称"
          @keyup.enter.native="handlerQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handlerQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <page-table
      ref="tableList"
      :query-form="queryForm"
      :data-source="dataSource"
      :table-column-config="tableColumnConfig"
    />
  </div>
</template>

<script>

import PageTable from '@/components/ListTable/index.vue'

export default {
  name: 'Task',
  components: { PageTable },
  data() {
    return {
      queryForm: {
        menuName: undefined
      },
      dataSource: '/api/task/list',
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
          fixed: 'left',
          label: '任务名称',
          prop: 'menuName'
        },
        {
          label: '开启状态',
          prop: 'enable'
        },
        {
          label: '运行状态',
          prop: 'status'
        },
        {
          label: '执行周期',
          prop: 'cronExpression'
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
            {
              text: '立即执行',
              css: 'text',
              click: (index, row) => {
                this.handleExecute(index, row)
              },
              isDisabled: () => {
                return false
              }
            },
            {
              text: '修改',
              css: 'text',
              click: (index, row) => {
                this.handleEdit(index, row)
              },
              isDisabled: (row) => {
                return false
              }
            },
            {
              text: '启用',
              css: 'success',
              click: (index, row) => {
                this.handleEnable(row)
              },
              isDisabled: (row) => {
                return row.enable === 1
              }
            },
            {
              text: '停用',
              css: 'danger',
              click: (index, row) => {
                this.handleEnable(row)
              },
              isDisabled: (row) => {
                return row.enable === 0
              }
            }
          ]
        }
      ]
    },
    handlerQuery() {

    },
    restQuery() {
      this.$refs.queryForm.resetFields()
    },
    handleEdit(index, row) {

    },
    handleEnable(row) {

    },
    handleDisable(row) {

    },
    handleExecute(row) {

    }
  }
}

</script>
