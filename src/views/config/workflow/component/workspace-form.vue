<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" :inline="true" size="small">
      <el-form-item label="模块名称" prop="businessModuleName">
        <el-input
          v-model="queryForm.businessModuleName"
          clearable
          placeholder="请输入业务模块名称"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <page-table
      :ref="pageConfig.key"
      :data-source="pageConfig.dataSource"
      :query-form="queryForm"
      :table-column-config="tableColumnConfig"
      :pageable="false"
    />
  </div>
</template>
<script>
import PageTable from '@/components/ListTable/index.vue'

export default {
  name: 'WorkspaceForm',
  components: { PageTable },
  props: {
    pageConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showSearch: true,
      queryForm: {
        businessModuleName: undefined
      },
      tableColumnConfig: [],
    }
  },
  async activated() {
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
          label: '业务模块',
          prop: 'businessModuleName'
        },
        {
          label: '发起人',
          prop: 'submitUser'
        },
        {
          label: '发起时间',
          prop: 'submitDateTime'
        },
        {
          label: '审核历史',
          columnType: 'Link',
          prop: 'auditHistory',
        },
        {
          label: '当前状态',
          prop: 'status'
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
            {
              text: '审核',
              css: 'warning',
              click: (index, row) => {
                this.handleAudit(index, row)
              }
            }
          ]
        }
      ]
    },
    handleQuery() {

    },
    resetQuery() {

    },
    handleAudit() {

    }
  }
}
</script>
