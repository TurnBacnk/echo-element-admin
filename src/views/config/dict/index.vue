<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryForm" size="mini" :inline="true" v-if="showSearch">
      <el-form-item prop="dictName" label="字典名称">
        <el-input v-model="queryForm.dictName" clearable placeholder="请输入字典名称"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" type="primary" @click="resetQuery">重置</el-button>
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
import { batchDeleteDictionary, getSingleDict } from '@/api/config/dict'

export default {
  name: 'Dictionary',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        dictName: undefined
      },
      buttonConfig: [
        {
          text: '新增',
          click: () => {
            this.handleAdd()
          },
          plain: false,
          icon: 'el-icon-plus'
        },
        {
          text: '删除',
          type: 'danger',
          plain: false,
          click: () => {
            this.handleDel()
          },
          icon: 'el-icon-delete'
        }
      ],
      dataSource: '/api/dict/list',
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['DictionaryType']
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
          label: '字典名称',
          prop: 'dictionaryName'
        },
        {
          label: '字典标识',
          prop: 'dictionaryKey'
        },
        {
          label: '字典类型',
          prop: 'dictionaryType',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['DictionaryType'],
            type: (row) => {
              if (row.dictionaryType === 1) {
                return 'success'
              }
              if (row.dictionaryType === 2) {
                return 'warning'
              }
            },
            effect: 'light'
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
                this.handleEdit(row, index)
              },
              isDisabled: () => {
                return false
              }
            }
          ]
        }
      ]
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    resetQuery() {
      this.queryForm = {
        dictName: undefined
      }
    },
    handleAdd() {
      this.$router.push({
        name: 'DictAdd'
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
      batchDeleteDictionary(ids).then(res => {
        const { msg, code } = res
        if (code === 100) {
          this.$modal.msgSuccess(msg)
          this.handleQuery()
        }
      })

    },
    handleEdit(row, index) {
      this.$router.push({
        name: 'DictEdit',
        params: {
          id: row.id
        }
      })
    }
  }
}

</script>
