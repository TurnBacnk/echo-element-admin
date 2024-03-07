<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" :inline="true" size="small">
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="queryForm.postCode" placeholder="请输入岗位编码" />
      </el-form-item>
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="queryForm.postName" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="岗位状态" prop="status">
        <el-select v-model="queryForm.status" placeholder="岗位状态" clearable>
          <el-option v-for="status in constant['Enable']" :key="status.value" :label="status.label" :value="status.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
import { delPost, enablePost } from '@/api/config/post'

export default {
  name: 'Post',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        postCode: undefined,
        postName: undefined,
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
          }
        },
        {
          text: '删除',
          type: 'danger',
          click: () => {
            this.handleDel()
          }
        }
      ],
      dataSource: '/api/post/list',
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
    init() {
      this.tableColumnConfig = [
        {
          columnType: 'Index',
          type: 'selection'
        },
        {
          label: '岗位编号',
          prop: 'postNo'
        },
        {
          label: '岗位代码',
          prop: 'postCode'
        },
        {
          label: '岗位名称',
          prop: 'postName'
        },
        {
          label: '岗位编码',
          prop: 'postNo'
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
            },
            effect: 'light'
          },
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
            {
              text: '修改',
              css: 'warning',
              click: (index, row) => {
                this.handleEdit(index, row)
              },
              isDisabled: (row) => {
                return this.canEdit(row)
              }
            },
            {
              text: '启用',
              css: 'success',
              click: (index, row) => {
                this.handleEnable(row.id, 1)
              },
              isDisabled: (row) => {
                return row.status === 1
              }
            },
            {
              text: '禁用',
              css: 'danger',
              click: (index, row) => {
                this.handleEnable(row.id, 0)
              },
              isDisabled: (row) => {
                return row.status === 0
              }
            }
          ]
        }
      ]
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    handleAdd() {
      this.$router.push({
        name: 'Post-add'
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'Post-edit',
        params: {
          id: row.id
        }
      })
    },
    canEdit() {
      return false
    },
    handleEnable(id, status) {
      enablePost(id, status).then(res => {
        const { msg } = res
        this.$modal.msgSuccess(msg)
        this.handleQuery()
      })
    },
    handleDel() {
      const checkedRowsId = []
      this.$refs.tableList.checkedRows().forEach(function(element) {
        checkedRowsId.push(element.id)
      })
      delPost(checkedRowsId).then(res => {
        const { msg } = res
        this.$modal.msgSuccess(msg)
        this.handleQuery()
      }).catch(err => {
        const { msg } = err
        this.$modal.msgError(msg)
        this.handleQuery()
      })
    },
    resetQuery() {
      this.queryForm = {
        postCode: undefined,
        postName: undefined,
        status: undefined
      }
    }
  }
}

</script>
