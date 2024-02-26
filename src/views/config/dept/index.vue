<template>
  <div class="app-container">
    <el-form ref="form" :model="queryParams" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
          <el-option v-for="status in constant['Enable']" :value="status.value" :label="status.label" :key="status.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" @queryTable="handleQuery" :show-search.sync="showSearch"/>
    <page-table
      ref="tableList"
      :query-form="queryParams"
      :data-source="dataSource"
      :table-column-config="tableColumnConfig"
      :pageable="false"
      :tree-config="{ children: 'children', hasChildren: 'hasChildren' }"
    />
  </div>
</template>

<script>
import { getConstant } from '@/api/common/dict'
import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import { delDept } from '@/api/dept'

export default {
  name: 'Dept',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      constant: [],
      constantConfig: {
        constantNameList: ['Enable']
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
      dataSource: '/api/dept/list',
      tableColumnConfig: []
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await this.init()
  },
  methods: {
    handleQuery() {
      this.$refs.tableList.list()
    },
    init() {
      this.tableColumnConfig = [
        {
          label: '部门名称',
          prop: 'deptName'
        },
        {
          label: '排序',
          prop: 'orderNum',
        },
        {
          columnType: 'Constant',
          label: '状态',
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
        },
        {
          label: '创建时间',
          prop: 'createTime'
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
                return false
              }
            }
          ]
        }
      ]
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'DeptEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel(index, row) {
      delDept(row.id).then(res => {
        const { msg, code } = res
        if (code === '100') {
          this.$modal.msgSuccess(msg)
          this.handleQuery()
        }
      })
    },
    handleAdd() {
      this.$router.push({
        name: 'DeptAdd'
      })
    },
    restQuery() {
      this.queryParams = {
        deptName: undefined,
        status: undefined
      }
    }
  }
}

</script>
