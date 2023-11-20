<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" size="small">

      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryForm.productName"
          clearable
          placeholder="请输入产品名称"
          @keyup.enter.native="handlerQuery"
        />
      </el-form-item>
      <el-form-item label="产品编码" prop="productCode">
        <el-input
          v-model="queryForm.productCode"
          clearable
          placeholder="请输入产品编码"
          @keyup.enter.native="handlerQuery"
        />
      </el-form-item>
      <el-form-item label="产品单位" prop="productUnit">
        <el-select v-model="queryForm.productUnit" clearable placeholder="产品单位">
          <el-option
            v-for="unit in constant.productUnit"
            :key="unit.value"
            :label="unit.label"
            :value="unit.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="启用状态" prop="enable">
        <el-select v-model="queryForm.enable" clearable placeholder="启用状态">
          <el-option
            v-for="enable in constant['Enable']"
            :key="enable.value"
            :label="enable.label"
            :value="enable.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handlerQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
      <button-group :button-config="buttonsConfig"/>
    </el-form>
    <page-table
      ref="tableList"
      :data-source=dataSource
      :query-form="queryForm"
      :table-column-config=tableColumnConfig
    />
  </div>
</template>

<script>
import { getConstant, getDictionary } from '@/api/common/dict'
import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'

export default {
  name: 'ProductCategory',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      showSearch: true,
      queryForm: {
        productName: undefined,
        productCode: undefined,
        productUnit: undefined,
        enable: undefined
      },
      // 总数
      total: undefined,
      dictionaryConfig: {
        dictionaryNameList: ['测试字典']
      },
      dictionary: [],
      constantConfig: {
        constantNameList: ['Enable']
      },
      constant: [],
      buttonsConfig: [
        {
          text: '新增',
          click: () => {
            this.handleAdd()
          },
          plain: true,
          icon: 'el-icon-plus'
        },
        {
          text: '修改',
          type: 'warning',
          click: () => {
            this.handleEdit()
          },
          plain: true,
          icon: 'el-icon-edit'
        },
        {
          text: '删除',
          type: 'danger',
          click: () => {
            this.handleDel()
          },
          plain: true,
          icon: 'el-icon-delete'
        },
        {
          text: '导入',
          type: 'success',
          click: () => {
            this.handleEdit()
          },
          plain: true,
          icon: 'el-icon-cloudy'
        },
        {
          text: '导出',
          click: () => {
            this.handleEdit()
          },
          plain: true,
          icon: 'el-icon-download'
        }
      ],
      dataSource: '/api/product/category/list',
      tableColumnConfig: []
    }
  },
  async created() {
    await getDictionary(this.dictionaryConfig).then(res => {
      const { data } = res
      this.dictionary = data
    })

    await getConstant(this.constantConfig).then(res => {
      const { data } = res
      this.constant = data
    })

    await this.init()
  },
  methods: {
    init() {
      this.tableColumnConfig = [
        {
          type: 'selection',
          columnType: 'Index'
        },
        {
          label: '产品名称',
          prop: 'productName',
          fixed: true
        },
        {
          label: '产品编号',
          prop: 'productCode'
        },
        {
          label: '产品规格',
          prop: 'productSpec'
        },
        {
          label: '单位',
          prop: 'productUnit'
        },
        {
          columnType: 'Dictionary',
          label: '分类',
          prop: 'category',
          dict: {
            dictList: this.dictionary['测试字典']
          }
        },
        {
          columnType: 'Money',
          label: '销售单价',
          prop: 'salePrice'
        },
        {
          columnType: 'Money',
          label: '采购单价',
          prop: 'costUnitPrice'
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
            {
              text: '提交',
              css: 'primary',
              click: (index, row) => {
                this.handleDel(index, row)
              },
              isDisabled: (row) => {
                return this.canSubmit(row)
              }
            },
            {
              text: '查看',
              css: 'info',
              click: (index, row) => {
                this.handleDel(index, row)
              },
              isDisabled: (row) => {
                return this.canSubmit(row)
              }
            }
          ]
        }
      ]
    },
    handlerQuery() {
      this.getList()
    },
    getList() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.queryForm = {
        productName: undefined,
        productCode: undefined,
        productUnit: undefined,
        enable: undefined
      }
    },
    handleAdd() {
      const id = 1
      this.$router.push(`categoryAdd/${id}`)
    },
    handleEdit() {
      const id = 2
      this.$router.push(`categoryEdit/${id}`)
    },
    handleDel() {
      this.$confirm('是否删除选中数据, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    canSubmit(row) {
      return row.productName == '测试产品1'
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
