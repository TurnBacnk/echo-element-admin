<template>
  <div class="app-container">
    <el-form ref="queryForm" size="mini" :inline="true" :model="queryForm" v-if="showSearch">
      <el-form-item label="盘点人" prop="stocktakingUserId">
        <el-select v-model="queryForm.stocktakingUserId" placeholder="请选择盘点人" clearable>
          <el-option
            v-for="user in javaCode['UserBuilder']"
            :key="user.value"
            :value="user.value"
            :label="user.label"
          />
        </el-select>
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
import {getJavaCode} from "@/api/common/dict";

export default {
  name: 'Stocktaking',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        stocktakingUserId: undefined,
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
      dataSource: '/api/repo-stocktaking/list',
      tableColumnConfig: [],
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['UserBuilder'],
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
          prop: 'stocktakingCode',
          label: '盘点单编码',
          columnType: 'Link',
          link: {
            click: (index, row) => {
              this.$router.push({
                name: 'RepoStocktakingView',
                params: {
                  id: row.id,
                }
              })
            }
          }
        },
        {
          prop: 'stocktakingDate',
          label: '盘点时间'
        },
        {
          prop: 'warehouseName',
          label: '仓库'
        },
        {
          prop: 'stocktakingProductAmount',
          label: '盘点产品数量'
        },
        {
          prop: 'alreadyStocktakingAmount',
          label: '已盘点产品数量'
        },
        {
          prop: 'stocktakingUserName',
          label: '盘点人'
        },
        {
          prop: 'stocktakingProfit',
          label: '盘点盈亏'
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
        name: 'RepoStocktakingAdd',
      })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'RepoStocktakingEdit',
        params: {
          id: row.id
        }
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {

    },
    handleSubmit() {
      var checkedRows = this.$refs.tableList.checkedRows()
      var canSubmit = true
      checkedRows.forEach(function (ele) {
        if (ele.approvalStatus === 1 || ele.approvalStatus === 2) {
          canSubmit = false
        }
      })
      if (canSubmit) {
        // TODO submit
      } else {
        this.$modal.msgWarning('存在重复提交数据，请重新选择！')
      }
    }
  }
}

</script>
