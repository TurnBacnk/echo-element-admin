<template>
  <div>
    <el-dialog :visible.sync="showDialog" title="选择产品信息" fullscreen>
      <!-- 这里插入你的产品列表组件 -->
      <el-row :gutter="20">
        <el-col :span="4" :xs="24">
          <div class="head-container">
            <el-input v-model="category" placeholder="请输入产品分类" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
          </div>
          <div class="head-container">
            <el-tree
              ref="tree"
              :data="categoryOptions"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              :props="{ children: 'children', label: 'label'}"
              default-expand-all
              highlight-current
              node-key="id"
              @node-click="handleNodeClick"
            />
          </div>
        </el-col>
        <el-col :span="20" :xs="24">
          <el-form v-if="showSearch" ref="queryForm" :inline="true" size="mini">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="baseQueryForm.productName" clearable placeholder="请输入产品编号" />
            </el-form-item>
            <el-form-item label="产品编码" prop="productCode">
              <el-input v-model="baseQueryForm.productCode" clearable placeholder="请输入产品编号" />
            </el-form-item>
            <el-form-item label="规格" prop="specification">
              <el-input v-model="baseQueryForm.specification" clearable placeholder="请输入规格" />
            </el-form-item>
            <el-form-item label="产品分类" prop="category">
              <el-select v-model="baseQueryForm.category" placeholder="请选择产品分类">
                <el-option
                  v-for="category in javaCode['CategoryBuilder']"
                  :key="category.key"
                  :value="category.value"
                  :label="category.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
              <el-select v-model="baseQueryForm.unit" placeholder="请选择单位">
                <el-option
                  v-for="unit in javaCode['UnitBuilder']"
                  :key="unit.key"
                  :value="unit.value"
                  :label="unit.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <button-group :button-config="buttonConfig" :show-search.sync="showSearch" @queryTable="handleQuery" />
          <page-table
            ref="tableList"
            :query-form="baseQueryForm"
            :table-column-config="tableColumnConfig"
            :data-source="dataSource"
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmSelection">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import PageTable from '@/components/ListTable/index.vue'
import { getConstant, getDictionary, getJavaCode } from '@/api/common/dict'
import { getCategoryTree } from '@/api/business/category'
import ButtonGroup from '@/components/ButtonGroup/index.vue'

export default {
  name: 'ProductInfoSelect',
  components: { ButtonGroup, PageTable },
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    selected: {
      type: Array,
      default: () => []
    },
    dataSource: {
      type: String,
      default: '/api/product-info/list'
    },
    queryForm: {
      type: Object,
      default: () => {}
    },
    formData: {
      type: Array,
      default: () => []
    },
    isSale: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showSearch: true,
      buttonConfig: [],
      buttonText: '批量选择产品',
      inputValue: '',
      selectedItems: this.selected,
      baseQueryForm: {
        productName: undefined,
        productCode: undefined,
        specification: undefined,
        category: undefined,
        productCodeList: []
      },
      tableColumnConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['Enable']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CategoryBuilder']
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['Unit', 'Category']
      },
      category: undefined,
      categoryOptions: [],
      innerDialog: this.showDialog
    }
  },
  watch: {
    showDialog(newVal) {
      this.innerDialog = newVal
      if (newVal) {
        this.handleQuery()
      }
    },
    innerDialog(newVal) {
      if (!newVal) {
        this.$emit('update:showDialog', false)
      }
    },
    'formData': {
      handler(newVal, oldVal) {
        const codeArr = []
        newVal.forEach(item => {
          codeArr.push(item.productCode)
        })
        this.baseQueryForm.productCodeList = codeArr
      },
      immediate: true
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getCategoryTree().then(res => {
      this.categoryOptions = res.data
    })
    await this.init()
    await this.initParams()
  },
  methods: {
    restQuery() {
      this.$refs.queryForm.resetFields()
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    initParams() {
      Object.assign(this.baseQueryForm, this.queryForm)
    },
    init() {
      this.tableColumnConfig = [
        {
          columnType: 'Index',
          type: 'selection'
        }, {
          label: '产品编码',
          prop: 'productCode',
          fixed: 'left',
          width: 250
        }, {
          label: '税收编码',
          prop: 'taxCode',
          fixed: 'left'
        }, {
          label: '产品名称',
          prop: 'productName'
        }, {
          label: '产品规格',
          prop: 'specification'
        }, {
          label: '产品分类',
          prop: 'category',
          columnType: 'Dictionary',
          dict: {
            dictList: this.javaCode['CategoryBuilder']
          }
        }, {
          label: '条形码',
          prop: 'barCode'
        }, {
          label: '单位',
          prop: 'unit',
          constant: 'Dictionary',
          dict: {
            dictList: this.dictionary['Unit']
          }
        }, {
          label: '期初数量',
          prop: 'num'
        }, {
          label: '状态',
          prop: 'status',
          columnType: 'Constant',
          constant: {
            constantList: this.constant['Enable'],
            type: (row) => {
              if (row.status === 1) {
                return 'success'
              }
              if (row.status === 0) {
                return 'info'
              }
            },
            effect: 'light'
          }
        }, {
          label: '备注',
          prop: 'remark'
        }, {
          label: '创建时间',
          prop: 'createTime'
        }, {
          label: '销售单价',
          prop: 'salePrice',
          columnType: 'Money'
        }, {
          label: '采购单价',
          prop: 'procurementPrice',
          columnType: 'Money'
        }, {
          label: '产品描述',
          prop: 'productDescription'
        }
      ]
    },
    handleSelect(selectedItems) {
      this.selectedItems = selectedItems
    },
    confirmSelection() {
      // this.buttonText = this.selectedItems.map(item => item.name).join(', ') || '请选择产品信息';
      this.selectedItems = this.$refs.tableList.checkedRows()
      this.selectedItems.forEach((ele) => {
        ele.productId = ele.id
        ele.id = undefined
        ele.taxRate = 13
        ele.discountRate = 0
        if (this.isSale) {
          ele.netUnitPrice = ele.salePrice
          ele.taxIncludedPrice = ele.salePriceTax
        } else {
          ele.netUnitPrice = ele.procurementPrice
          ele.taxIncludedPrice = ele.procurementPriceTax
        }
      })
      this.$emit('update:selected', this.selectedItems)
      this.$refs.tableList.clearSelect()
      this.closeDialog()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.queryForm.category = data.value
      this.handleQuery()
    },
    closeDialog() {
      this.innerDialog = false;
    }
  }
}

</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
