<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="物资清单编码" prop="materialsOrderCode">
        <el-input v-model="queryForm.materialsOrderCode" clearable size="mini" placeholder="请输入物资清单编码" />
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
import { deleteMaterialsById, deleteMaterialsByIds } from '@/api/business/materials'

export default {
  name: 'Materials',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        materialsOrderCode: undefined
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
      dataSource: '/api/repo-materials/list',
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
          prop: 'materialsOrderCode',
          label: '物料清单编码',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'RepoMaterialsView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'createTime',
          label: '创建日期'
        },
        {
          prop: 'remark',
          label: '单据备注'
        },
        {
          prop: 'productName',
          label: '成品名称'
        },
        {
          prop: 'productCode',
          label: '成品编号'
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
            {
              text: '组装入库',
              css: 'text',
              click: (index, row) => {
                this.$router.push({
                  name: 'RepoAssemblyAdd',
                  params: {
                    id: row.id
                  }
                })
              },
              isDisabled: (row) => {
                return false
              }
            },
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
                deleteMaterialsById(row.id).then(response => {
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
            }
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'RepoMaterialsAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'RepoMaterialsEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const rows = this.$refs.tableList.checkedRows()
      let canDel = true
      rows.forEach((ele) => {
        if (ele.approvalStatus === 1) {
          canDel = false
          this.$modal.msgWarning('勾选项中有审核通过订单，不可删除')
        } else if (ele.approvalStatus === 2) {
          canDel = false
          this.$modal.msgWarning('勾选项中有审核中的订单，不可删除')
        }
      })
      if (canDel) {
        const ids = this.$refs.tableList.checkedRowIds()
        deleteMaterialsByIds(ids).then(res => {
          const { msg, code } = res
          if (code === '100') {
            this.$modal.msgSuccess(msg)
            this.handleQuery()
          }
        })
      }
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
