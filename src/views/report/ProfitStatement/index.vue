<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="单据编号" prop="orderCode">
        <el-input v-model="queryForm.orderCode" size="mini" clearable placeholder="请输入单据编号" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="list" :data="tableData" :span-method="spanMethod">
      <el-table-column
        prop="projectType"
        label="项目类别"
        :filters="projectTypeFilters"
        :filter-method="handleProjectTypeFilter"
        align="center"
      >
        <template slot-scope="dictionaryScope">
          <el-tag>
            {{ projectTypeConvert(dictionaryScope.row[dictionaryScope.column.property]) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="currency" label="币种" align="center">
        <el-table-column prop="hongKongDollar" label="港币" align="center" />
        <el-table-column prop="dollar" label="美金" align="center" />
        <el-table-column prop="rmb" label="人民币" align="center" />
        <el-table-column prop="euro" label="欧元" align="center" />
        <el-table-column prop="canadianDollar" label="加元" align="center" />
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import PageTable from '@/components/ListTable/index.vue'
import ButtonGroup from '@/components/ButtonGroup/index.vue'
import request from '@/utils/request'

export default {
  name: 'ProfitStatement',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        code: undefined
      },
      projectTypeFilters: [
        {
          text: '销售收入',
          value: '0'
        },
        {
          text: '利息收入',
          value: '1'
        },
        {
          text: '税金支出',
          value: '2'
        },
        {
          text: '货款支出',
          value: '3'
        },
        {
          text: '运费',
          value: '4'
        },
        {
          text: '服务费/佣金',
          value: '5'
        },
        {
          text: '银行手续',
          value: '6'
        },
        {
          text: '员工工资',
          value: '7'
        }
      ],
      currencyFilters: [
        {
          text: ''
        }
      ],
      tableData: []
    }
  },
  async created() {
    await this.list()
  },
  methods: {
    list() {
      request({
        url: '/api/report/profit-statement',
        method: 'post',
        data: this.queryForm
      }).then(res => {
        const { data } = res
        this.tableData = data
      })
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.$refs.queryForm.resetFields()
    },
    handleProjectTypeFilter() {
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      // 只针对 ProjectType 列（第一列）进行合并
      if (columnIndex === 0) { // ProjectType 是第一列，索引为 0
        // 如果是第一行或与上一行的 ProjectType 不同，则显示该单元格
        if (rowIndex === 0 || row.projectType !== this.tableData[rowIndex - 1].projectType) {
          // 统计相同 ProjectType 的行数
          const rowspan = this.tableData.filter(item => item.projectType === row.projectType).length
          return { rowspan, colspan: 1 } // 显示合并后的单元格
        } else {
          // 如果与上一行的 ProjectType 相同，隐藏该单元格
          return { rowspan: 0, colspan: 0 } // 不显示该单元格
        }
      }
      return { rowspan: 1, colspan: 1 } // 默认不合并其他列
    },
    projectTypeConvert(projectType) {
      if (projectType == 0) {
        return '销售收入'
      }
      if (projectType == 1) {
        return '利息收入'
      }
      if (projectType == 2) {
        return '税金支出'
      }
      if (projectType == 3) {
        return '货款支出'
      }
      if (projectType == 4) {
        return '运费'
      }
      if (projectType == 5) {
        return '服务费/佣金'
      }
      if (projectType == 6) {
        return '银行手续'
      }
      if (projectType == 7) {
        return '员工工资'
      }
    }
  }
}
</script>
