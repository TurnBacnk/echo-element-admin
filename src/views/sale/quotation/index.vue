<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" size="mini" :inline="true" :model="queryForm">
      <el-form-item label="报价单编号" prop="quotationCode">
        <el-input v-model="queryForm.quotationCode" clearable size="mini" placeholder="请输入报价单编号" />
      </el-form-item>
      <el-form-item label="报价单日期" prop="quotationDate">
        <el-date-picker v-model="queryForm.quotationDate" clearable type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" value-format="yyyy-MM-dd" :picker-options="pickerOptions" />
      </el-form-item>
      <el-form-item label="报价人" prop="quotationUserId">
        <el-select v-model="queryForm.quotationUserId" placeholder="请选择报价人">
          <el-option
            v-for="user in javaCode['UserBuilder']"
            :key="user.value"
            :label="user.label"
            :value="user.value"
          />
        </el-select>
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
import { getJavaCode } from '@/api/common/dict'

export default {
  name: 'Quotation',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        quotationUserId: undefined,
        quotationDate: undefined,
        quotationCode: undefined
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
      dataSource: '/api/sale/quotation/list',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tableColumnConfig: [],
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['UserBuilder']
      }
    }
  },
  async created() {
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
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
          prop: 'quotationCode',
          label: '报价单编号',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'QuotationView',
                params: {
                  id: row.id
                }
              })
            }
          }
        },
        {
          prop: 'quotationDate',
          label: '报价日期'
        },
        {
          prop: 'quotationUserName',
          label: '报价人'
        },
        {
          prop: 'quotationAmount',
          label: '报价金额',
          columnType: 'Money'
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
                deleteOtherOutboundById(row.id).then(response => {
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
        name: ''
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: '',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
      deleteOtherOutboundByIds(ids).then(res => {
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
