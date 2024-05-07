<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="资金账户编号" prop="capitalAccountCode">
        <el-input v-model="queryForm.capitalAccountCode" clearable placeholder="请输入资金账户编号" />
      </el-form-item>
      <el-form-item label="资金账户名称" prop="capitalAccountName">
        <el-input v-model="queryForm.capitalAccountName" clearable placeholder="请输入资金账户名称" />
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
import { deleteCapitalAccountById, deleteCapitalAccountByIds, setDefaultById } from '@/api/business/capital-account'
import {getConstant, getDictionary} from "@/api/common/dict";

export default {
  name: 'SaleReturnOrder',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        capitalAccountCode: undefined,
        capitalAccountName: undefined
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
          text: '提交',
          click: () => {
            this.handleSubmit()
          },
          plain: true,
          type: 'warning',
          icon: 'el-icon-s-promotion'
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
      dataSource: '/api/capital-account/list',
      tableColumnConfig: [],
      dictionaryConfig: {
        dictionaryNameList: ['SettlementType']
      },
      dictionary: [],
      constant: [],
      constantConfig: {
        constantNameList: ['YesOrNo']
      }
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
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
          prop: 'capitalAccountCode',
          label: '账户编号',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'CapitalAccountView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'capitalAccountName',
          label: '账户名称'
        },
        {
          prop: 'capitalAccountSettlementType',
          label: '结算类型',
          columnType: 'Constant',
          constant: {
            constantList: this.dictionary['SettlementType'],
            type: (row) => {
              return ''
            },
            effect: 'light'
          }
        },
        {
          prop: 'accountBalance',
          label: '账户余额',
          columnType: 'Money'
        },
        {
          prop: 'isDefault',
          label: '是否默认账户',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['YesOrNo'],
            type: (row) => {
              return ''
            },
            effect: 'light'
          }
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
            {
              text: '设为默认',
              css: 'text',
              click: (index, row) => {
                setDefaultById(row.id).then(res => {
                  const { code, msg } = res
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
                deleteCapitalAccountById(row.id).then(response => {
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
        name: 'CapitalAccountAdd'
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'CapitalAccountEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
      deleteCapitalAccountByIds(ids).then(res => {
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
