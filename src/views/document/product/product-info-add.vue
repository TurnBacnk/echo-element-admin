<template>
  <div class="app-container">
    <form-table
      v-if="showForm"
      :save-url="saveUrl"
      :submit-url="submitUrl"
      :collapse-item-config="collapseItemConfig"
      :collapse-config="collapseConfig"
      :content-text="contextText"
      :form="form"
      :rules="rules"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getConstant, getDictionary, getJavaCode } from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'
import { getCategoryTree } from '@/api/business/category'

export default {
  name: 'ProductInfoAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      saveUrl: '/api/product-info/save',
      submitUrl: '/api/product-info/submit',
      collapseItemConfig: {},
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '历史采购价格', name: 'historyInfo', type: 'table' },
        { active: true, title: '库存状况', name: 'warehouseInfo', type: 'table' }
      ],
      contextText: '产品登记',
      form: {
        productName: undefined,
        productCode: undefined,
        specification: undefined,
        category: undefined,
        barCode: undefined,
        unit: undefined,
        historyPriceList: [],
        warehouseInfoList: [],
        pictureId: undefined,
        status: undefined,
        remark: undefined,
        productDescription: undefined
      },
      rules: {
        baseInfo: {
          productCode: [{ required: true, message: '请输入', trigger: 'blur' }],
          productName: [{ required: true, message: '请输入', trigger: 'blur' }],
          specification: [{ required: true, message: '请输入', trigger: 'blur' }],
          category: [{ required: true, message: '请选择', trigger: 'blur' }],
          barCode: [{ required: true, message: '请输入', trigger: 'blur' }],
          unit: [{ required: true, message: '请选择', trigger: 'change' }],
          status: [{ required: true, message: '请选择', trigger: 'change' }]
        },
        historyInfo: {
          beforeChangePrice: [{ required: true, message: '请输入', trigger: 'blur' }],
          afterChangePrice: [{ required: true, message: '请输入', trigger: 'blur' }],
          changeDateTime: [{ required: true, message: '请选择', trigger: 'blur' }]
        },
        warehouseInfo: {
          warehouseName: [{ required: true, message: '请选择', trigger: 'change' }]
        }
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['Unit']
      },
      constant: [],
      constantConfig: {
        constantNameList: ['Enable']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['WarehouseBuilder']
      },
      categoryTree: []
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await getCategoryTree().then(res => {
      this.categoryTree = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await this.generateCode()
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '产品编码',
            prop: 'productCode',
            disabled: true,
            type: 'input'
          },
          {
            label: '产品名称',
            prop: 'productName',
            type: 'input',
            placeholder: '请输入产品名称'
          },
          {
            label: '规格型号',
            prop: 'specification',
            type: 'input',
            placeholder: '请输入规格型号'
          },
          {
            label: '产品类别',
            prop: 'category',
            type: 'treeSelect',
            options: this.categoryTree
          },
          {
            label: '条形码',
            prop: 'barCode',
            type: 'input',
            placeholder: '请输入条形码编号'
          },
          {
            label: '单位',
            prop: 'unit',
            type: 'select',
            options: this.dictionary['Unit']
          },
          {
            label: '状态',
            prop: 'status',
            type: 'select',
            options: this.constant['Enable']
          },
          {
            label: '备注',
            prop: 'remark',
            type: 'input'
          },
          {
            label: '产品描述',
            prop: 'productDescription',
            type: 'input'
          }
        ],
        historyInfo: {
          prop: 'historyPriceList',
          column: [
            {
              label: '变动前单价',
              prop: 'beforeChangePrice',
              type: 'input',
              placeholder: '请输入变动前单价'
            },
            {
              label: '变动后单价',
              prop: 'afterChangePrice',
              type: 'input',
              placeholder: '请输入变动后单价'
            },
            {
              label: '变动日期',
              prop: 'changeDateTime',
              type: 'date'
            }
          ],
          showButton: true
        },
        warehouseInfo: {
          prop: 'warehouseInfoList',
          column: [
            {
              label: '仓库',
              prop: 'warehouseName',
              type: 'select',
              optionList: this.javaCode['WarehouseBuilder'],
              click: (event, row) => {
                const obj = this.javaCode['WarehouseBuilder'].find((item) => {
                  return item.value === event
                })
                row.warehouseId = obj.value
                row.warehouseName = obj.label
              }
            },
            {
              label: '数量',
              prop: 'num',
              type: 'input'
            }
          ],
          showButton: true
        }
      }
      this.showForm = true
    },
    generateCode() {
      generateCode('PRODUCT').then(res => {
        this.form.productCode = res.data
      })
    }
  }
}

</script>
