<template>
  <div class="app-container">
    <form-table
      v-if="showForm"
      :content-text="contentText"
      :collapse-config="collapseConfig"
      :collapse-item-config="collapseItemConfig"
      :save-url="saveUrl"
      :submit-url="submitUrl"
      :form="form"
      :rules="rules"
      :can-submit="canSubmit"
      :is-view="true"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getJavaCode } from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'
import { getReturnById } from '@/api/business/sales-return'

export default {
  name: 'SalesReturnOrderView',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '销售退货单',
      saveUrl: '/api/sales/return/save',
      submitUrl: '/api/sales/return/save-and-submit',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '产品信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        orderCode: undefined,
        contractNo: undefined,
        contractDate: undefined,
        returnDate: undefined,
        saleFromId: undefined,
        saleToId: undefined
      },
      rules: {
        baseInfo: {
          orderCode: [{ required: true, message: '请输入销售单编号', trigger: 'blur' }],
          contractNo: [{ required: true, message: '请输入合同号', trigger: 'blur' }],
          contractDate: [{ required: true, message: '请选择合同日期', trigger: 'blur' }],
          returnDate: [{ required: true, message: '请选择交货日期', trigger: 'blur' }],
          saleFromId: [{ required: true, message: '请选择供货方', trigger: 'blur' }],
          saleToId: [{ required: true, message: '请选择采购方', trigger: 'blur' }]
        },
        goodsInfo: {
          productName: [{ required: true, message: '请选择产品', trigger: 'blur' }],
          productCode: [{ required: true, message: '请输入产品编号', trigger: 'blur' }],
          quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
          netUnitPrice: [{ required: true, message: '请输入净单价', trigger: 'blur' }],
          netTotalAmount: [{ required: true, message: '请输入净总价', trigger: 'blur' }],
          taxIncludedTotalAmount: [{ required: true, message: '请输入含税总价', trigger: 'blur' }],
          taxIncludedPrice: [{ required: true, message: '请输入含税单价', trigger: 'blur' }]
        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: []
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: []
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CompanyBuilder', 'CustomerBuilder']
      }
    }
  },
  async created() {
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getReturnById(this.$route.params.id).then(res => {
      Object.assign(this.form, res.data)
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '单据编号',
            prop: 'orderCode',
            type: 'input',
            disable: true
          },
          {
            label: '合同号',
            prop: 'contractNo',
            type: 'input'
          },
          {
            label: '合同日期',
            prop: 'contractDate',
            type: 'date'
          },
          {
            label: '退货日期',
            prop: 'returnDate',
            type: 'date'
          },
          {
            label: '供货方',
            prop: 'saleFromId',
            type: 'select',
            options: this.javaCode['CompanyBuilder'],
            bundle: {
              label: 'saleFromName',
              value: 'saleFromId'
            }
          },
          {
            label: '采购方',
            prop: 'saleToId',
            type: 'select',
            options: this.javaCode['CustomerBuilder'],
            bundle: {
              label: 'saleToName',
              value: 'saleToId'
            }
          }
        ],
        goodsInfo: {
          prop: 'productList',
          column: [
            {
              label: '产品名称',
              prop: 'productName',
              type: 'select',
              optionList: this.javaCode['ProductBuilder']
            },
            {
              label: '产品编码',
              prop: 'productCode',
              type: 'input'
            },
            {
              label: '数量',
              prop: 'quantity',
              type: 'number'
            },
            {
              label: '净单价',
              prop: 'netUnitPrice',
              type: 'number'
            },
            {
              label: '含税单价',
              prop: 'taxIncludedPrice',
              type: 'number'
            },
            {
              label: '净总价',
              prop: 'netTotalAmount',
              type: 'number'
            },
            {
              label: '含税总价',
              prop: 'taxIncludedTotalAmount',
              type: 'number'
            }
          ],
          showProduct: false,
          showButton: false,
          showSummary: true,
          totalColumns: ['netTotalAmount', 'taxIncludedTotalAmount']
        }
      }
      this.showForm = true
    },
    saveFun() {
      if (this.form.productList.length === 0) {
        this.$modal.msgWarning('请至少选择一项产品')
        return false
      }
      return true
    }
  }
}

</script>
