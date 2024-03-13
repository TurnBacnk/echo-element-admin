<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="供应商编号" prop="vendorCode">
        <el-input v-model="queryForm.vendorCode" clearable placeholder="请输入供应商编号" />
      </el-form-item>
      <el-form-item label="供应商名称" prop="vendorCode">
        <el-input v-model="queryForm.vendorName" clearable placeholder="请输入供应商名称" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" @quyertTable="handleQuery" :show-search.sync="showSearch" />
    <page-table ref="tableList" :query-form="queryForm" :data-source="dataSource" :table-column-config="tableColumnConfig" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import { delVendorByIds } from '@/api/business/vendor'
import { getDictionary } from '@/api/common/dict'

export default {
  name: 'Vendor',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        vendorName: undefined,
        vendorCode: undefined
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
      dataSource: '/api/vendor/list',
      tableColumnConfig: [],
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['VendorType']
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
          columnType: 'Index'
        },
        {
          label: '供应商名称',
          prop: 'vendorName'
        },
        {
          label: '供应商编号',
          prop: 'vendorCode',
          fixed: 'left'
        },
        {
          label: '供应商类型',
          prop: 'vendorType',
          columnType: 'Dictionary',
          dict: {
            dictList: this.dictionary['VendorType']
          }
        },
        {
          label: '地址',
          prop: 'address'
        },
        {
          label: '负责人',
          prop: 'vendorResponsiblePersonName'
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
        name: 'VendorAdd',
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'VendorEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
      delVendorByIds(ids).then(res => {
        const { code, msg } = res
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
      this.queryForm = {
        vendorName: undefined,
        vendorCode: undefined

      }
    }
  }
}

</script>
