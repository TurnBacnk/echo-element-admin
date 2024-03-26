<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="客户名称" prop="clientName">
        <el-input v-model="queryForm.clientName" placeholder="请输入客户名称" clearable @keyup.enter.native />
      </el-form-item>
      <el-form-item label="客户编号" prop="clientCode">
        <el-input v-model="queryForm.clientCode" placeholder="请输入客户编号" clearable @keyup.enter.native />
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
import { getDictionary } from '@/api/common/dict'
import { delClient } from '@/api/business/client'

export default {
  name: 'Client',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        clientName: undefined,
        clientCode: undefined
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
      dataSource: '/api/client/list',
      tableColumnConfig: [],
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['ClientType']
      }
    }
  },
  async created() {
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
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
          prop: 'clientName',
          label: '客户名称'
        },
        {
          prop: 'clientCode',
          label: '客户编码'
        },
        {
          columnType: 'Dictionary',
          prop: 'clientType',
          label: '客户类型',
          dict: {
            dictList: this.dictionary['ClientType']
          }
        },
        {
          prop: 'address',
          label: '地址'
        },
        {
          prop: 'clientResponsiblePersonName',
          label: '负责人'
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
            }
          ]
        }
      ]
    },
    handleAdd() {
      this.$router.push({
        name: 'ClientAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'ClientEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
      delClient(ids).then(res => {
        if (res.code === '100') {
          this.$modal.msgSuccess(res.msg)
          this.handleQuery()
        }
      })
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.queryForm = {
        clientName: undefined,
        clientCode: undefined
      }
    }
  }
}

</script>
