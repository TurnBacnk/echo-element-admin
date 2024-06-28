<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="queryForm.projectName" placeholder="请输入项目名称" clearable size="mini" />
      </el-form-item>
      <el-form-item label="项目日期" prop="projectDateList">
        <el-date-picker v-model="queryForm.projectDateList" start-placeholder="开始日期" end-placeholder="结束日期" clearable type="daterange" size="small" value-format="yyyy-MM-dd" :picker-options="pickerOptions" />
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
import {delProjectById, delProjectByIds} from '@/api/business/project'

export default {
  name: 'Project',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        projectName: undefined,
        projectDateList: undefined
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
      dataSource: '/api/sale/project/list',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
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
          prop: 'projectName',
          label: '项目名称',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'ProjectView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'projectCode',
          label: '项目编码'
        },
        {
          prop: 'projectDate',
          label: '项目日期'
        },
        {
          prop: 'quotationCount',
          label: '报价次数'
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
              text: '删除',
              css: 'text',
              click: (index, row) => {
                delProjectById(row.id).then(response => {
                  const { code, msg } = response
                  if (code === '100') {
                    this.$modal.msgSuccess(msg)
                    this.handleQuery()
                  }
                })
              },
              isDisabled: (row) => {
                return false
              }
            },
            {
              text: '报价',
              css: 'text',
              click: (index, row) => {
                this.$router.push({
                  name: 'Quotation',
                  params: {
                    projectId: row.id
                  }
                })
              },
              isDisabled: (row) => {
                return row.quotationStatus !== 0
              }
            }
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'ProjectAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'ProjectEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
      delProjectByIds(ids).then(res => {
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
      this.$refs.queryForm.resetFields()
    }
  }
}

</script>
