<template>
  <div class="app-container">
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
        <el-form ref="queryForm" :inline="true" size="mini" v-if="showSearch">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="queryForm.productName" clearable placeholder="请输入产品编号"/>
          </el-form-item>
          <el-form-item label="产品编码" prop="productName">
            <el-input v-model="queryForm.productName" clearable placeholder="请输入产品编号"/>
          </el-form-item>
          <el-form-item label="规格" prop="specification">
            <el-input v-model="queryForm.specification" clearable placeholder="请输入规格"/>
          </el-form-item>
          <el-form-item label="产品分类" prop="category">
            <el-select v-model="queryForm.category" placeholder="请选择产品分类">
              <el-option
                v-for="category in javaCode['CategoryBuilder']"
                :key="category.key"
                :value="category.value"
                :label="category.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-select v-model="queryForm.unit" placeholder="请选择单位">
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
        <button-group :button-config="buttonConfig" :show-search.sync="showSearch" @queryTable="handleQuery"/>
        <page-table
          ref="tableList"
          :query-form="queryForm"
          :table-column-config="tableColumnConfig"
          :data-source="dataSource"
        />
      </el-col>
    </el-row>
    <upload-file ref="upload" action-url="/api/product-info/upload" business-name="product-info" />
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import { batchDeleteProductInfo } from '@/api/business/product-info'
import { getConstant, getDictionary, getJavaCode } from '@/api/common/dict'
import UploadFile from '@/components/UploadFile/index.vue'
import { getCategoryTree } from '@/api/business/category'

export default {
  name: 'ProductDocument',
  components: { UploadFile, PageTable, ButtonGroup },
  data() {
    return {
      // 左侧树
      category: undefined,
      categoryOptions: [],
      // 右侧表单
      showSearch: true,
      queryForm: {
        productCode: undefined,
        productName: undefined,
        specification: undefined,
        category: undefined,
        barCode: undefined,
        unit: undefined,
        openingBalance: undefined,
        pictureId: undefined,
        status: undefined,
        remark: undefined,
        createTime: undefined,
        salePrice: undefined,
        procurementPrice: undefined,
        productDescription: undefined
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CategoryBuilder']
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['Unit', 'Category']
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
        },
        {
          text: '导入',
          type: 'success',
          click: () => {
            this.handleUpload()
          },
          plain: true,
          icon: 'el-icon-cloudy'
        }
      ],
      tableColumnConfig: [],
      dataSource: '/api/product-info/list',
      constant: [],
      constantConfig: {
        constantNameList: ['Enable']
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
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getCategoryTree().then(res => {
      this.categoryOptions = res.data
    })
    await this.init()
  },
  methods: {
    init() {
      this.tableColumnConfig = [
        {
          columnType: 'Index',
          type: 'selection'
        }, {
          label: '产品编码',
          prop: 'productCode',
          fixed: 'left'
        }, {
          label: '产品名称',
          prop: 'productName',
          fixed: 'left'
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
          label: '图片',
          prop: 'pictureId'
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
        }, {
          label: '操作',
          columnType: 'Operation',
          button: [
            {
              text: '修改',
              css: 'text',
              click: (index, row) => {
                this.handleEdit(row, index)
              },
              plain: true,
              isDisabled: (row) => {
                return false
              },
              icon: 'el-icon-edit'
            }
          ]
        }
      ]
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.queryForm = {
        productCode: undefined,
        productName: undefined,
        specification: undefined,
        category: undefined,
        barCode: undefined,
        unit: undefined,
        openingBalance: undefined,
        pictureId: undefined,
        status: undefined,
        remark: undefined,
        createTime: undefined,
        salePrice: undefined,
        procurementPrice: undefined,
        productDescription: undefined
      }
    },
    handleAdd() {
      this.$router.push({
        name: 'ProductInfoAdd'
      })
    },
    handleDel() {
      const ids = this.$refs.tableList.checkedRowIds()
      batchDeleteProductInfo(ids).then(res => {
        const { msg, code } = res
        if (code === '100') {
          this.$modal.msgSuccess(msg)
          this.handleQuery()
        }
      })
    },
    handleEdit(row, index) {
      this.$router.push({
        name: 'ProductInfoEdit',
        params: {
          id: row.id
        }
      })
    },
    handleUpload() {
      this.$refs.upload.dialogVisible = true
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.queryForm.category = data.value
      this.handleQuery()
    }
  }
}

</script>
