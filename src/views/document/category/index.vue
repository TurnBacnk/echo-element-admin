<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" size="small" v-if="showSearch" v-model="queryForm">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="queryForm.categoryName" clearable placeholder="请输入分类名称" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" @queryTable="handleQuery" :show-search.sync="showSearch" />
    <page-table :query-form="queryForm" :data-source="dataSource" :table-column-config="tableColumnConfig" :tree-config="{ children: 'children', hasChildren: 'hasChildren'}" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'

export default {
  name: 'ProductCategory',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      queryForm: {
        categoryName: undefined
      },
      showSearch: true,
      buttonConfig: [
        {
          text: '新增',
          click: () => {
            this.handleAdd()
          }
        }
      ],
      dataSource: '/api/category/list',
      tableColumnConfig: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleQuery() {

    },
    resetQuery() {
      this.$refs.queryForm.resetFields()
    },
    handleAdd() {
      this.$router.push({
        name: 'CategoryAdd'
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'CategoryEdit',
        params: {
          id: row.id
        }
      })
    },
    init() {
      this.tableColumnConfig = [
        {
          fixed: 'left',
          label: '分类名称',
          prop: 'categoryName'
        },
        {
          label: '排序',
          prop: 'orderNo'
        },
        {
          label: '分类备注',
          prop: 'remark'
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
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
              text: '删除',
              css: 'text',
              click: (index, row) => {
                this.handleDel(index, row)
              },
              isDisabled: (row) => {
                return !!row.children
              }
            }
          ]
        }
      ]
    }
  },
}

</script>
