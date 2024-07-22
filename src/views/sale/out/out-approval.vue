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
      :is-approval="true"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getJavaCode } from '@/api/common/dict'
import { getOutByCode, getOutById } from '@/api/business/sales-out'

export default {
  name: 'OutOrderView',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '审核销售出库单',
      saveUrl: '/api/sales/out/update',
      submitUrl: '/api/sales/out/update-and-submit',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '产品信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        orderCode: undefined,
        contractNo: undefined,
        contractDate: undefined,
        outDate: undefined,
        saleFromId: undefined,
        saleToId: undefined,
        salesFromName: undefined,
        salesToName: undefined,
        productList: []
      },
      rules: {
        baseInfo: {
          orderCode: [{ required: true, message: '请输入销售单编号', trigger: 'blur' }],
          contractNo: [{ required: true, message: '请输入合同号', trigger: 'blur' }],
          contractDate: [{ required: true, message: '请选择合同日期', trigger: 'blur' }],
          outDate: [{ required: true, message: '请选择出库日期', trigger: 'blur' }],
          saleFromId: [{ required: true, message: '请选择供货方', trigger: 'blur' }],
          saleToId: [{ required: true, message: '请选择采购方', trigger: 'blur' }]
        },
        goodsInfo: {}
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
    await getOutByCode(this.$route.params.code).then(res => {
      Object.assign(this.form, res.data)
      this.form.instanceId = this.$route.params.instanceId
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
            label: '出库日期',
            prop: 'outDate',
            type: 'date'
          },
          {
            label: '供货方',
            prop: 'saleFromId',
            type: 'select',
            options: this.javaCode['CompanyBuilder']
          },
          {
            label: '采购方',
            prop: 'saleToId',
            type: 'select',
            options: this.javaCode['CustomerBuilder']
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
