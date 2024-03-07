<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" size="small" v-if="showSearch">
      <el-form-item label="业务模块名称" prop="businessModuleName">
        <el-input v-model="queryForm.businessModuleName" clearable placeholder="请输入业务模块名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" @queryTable="handleQuery" :show-search.sync="showSearch" />
    <page-table ref="tableList" :data-source="dataSource" :query-form="queryForm" :table-column-config="tableColumnConfig" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import { getConstant } from '@/api/common/dict'
import PageTable from '@/components/ListTable/index.vue'
import { delModule } from '@/api/config/module'

export default {
  name: 'Module',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        businessModuleName: undefined
      },
      buttonConfig: [
        {
          text: '注册',
          click: () => {
            this.handleAdd()
          },
          plain: true,
          icon: 'el-icon-plus'
        },
        {
          text: '删除',
          click: () => {
            this.handleDel()
          },
          plain: true,
          type: 'danger',
          icon: 'el-icon-delete'
        }
      ],
      dataSource: '/api/module/list',
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
          type: 'selection'
        },
        {
          label: '模块名称',
          prop: 'businessModuleName'
        },
        {
          label: '排序',
          prop: 'orderNo'
        },
        {
          label: '模块流程挂载数',
          prop: 'businessModuleFlowNumber'
        },
        {
          columnType: 'Constant',
          label: '启用状态',
          prop: 'status',
          constant: {
            constantList: this.constant['Enable'],
            type: (row) => {
              if (row.status === 0) {
                return ''
              } else {
                return 'success'
              }
            }
          }
        }
      ]
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.queryForm = {
        businessModuleName: undefined
      }
    },
    handleAdd() {
      this.$router.push({
        name: 'ModuleAdd'
      })
    },
    handleDel(id) {
      const ids = this.$refs.tableList.checkedRowIds()
      delModule(ids).then(() => {
        this.$message.success('删除成功')
        this.handleQuery()
      })
    }
  }
}

</script>
