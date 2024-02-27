<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" size="small" v-if="showSearch">
      <el-form-item label="业务模块名称" prop="businessModuleKey">
        <el-input v-model="queryForm.businessModuleKey" placeholder="请输入模块名称"/>
      </el-form-item>
      <el-form-item label="是否启用" prop="status">
        <el-input v-model="queryForm.status" placeholder="请输入是否启用"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" :show-search.sync="showSearch"  @queryTable="handleQuery" />
    <page-table ref="tableList" :query-form="queryForm" :data-source="dataSource" :table-column-config="tableColumnConfig" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'

export default {
  name: 'FormsPanel',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        businessModuleKey: '',
        status: ''
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
      dataSource: '/api/work-flow/flow-definition-list',
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
          type: 'selection',
          columnType: 'Index'
        },
        {
          label: '流程名称',
          prop: 'workflowName'
        },
        {
          label: '业务模块',
          prop: 'businessModuleName'
        },
        {
          label: '业务名称',
          prop: 'businessName'
        },
        {
          label: '状态',
          prop: 'status'
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
            {
              text: '修改流程',
              css: 'warning',
              click: (index, row) => {
                this.handleEditFLow(index, row)
              }
            },
            {
              text: '流程挂载',
              css: 'success',
              click: (index, row) => {
                this.handleFlowAppend(index, row)
              }
            }
          ]
        }
      ]
    },
    resetQuery() {

    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    handleEditFLow() {

    },
    handleFlowAppend() {

    },
    handleAdd() {

    },
    handleDel() {

    }
  }
}

</script>
