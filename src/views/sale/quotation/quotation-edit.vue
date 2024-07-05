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
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getJavaCode } from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'
import {getQuotationById} from "@/api/business/sale-quotation";

export default {
  name: 'QuotationAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '登记报价单',
      saveUrl: '/api/sale/quotation/save',
      submitUrl: '',
      canSubmit: false,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '产品信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        quotationCode: undefined,
        quotationFromName: undefined,
        quotationFromId: undefined,
        quotationToName: undefined,
        quotationToId: undefined,
        quotationDate: new Date(),
        projectId: undefined,
        quotationUserId: undefined,
        quotationUserName: undefined,
        quotationItemList: []
      },
      rules: {
        baseInfo: {
          quotationCode: [{ required: true, message: '请输入报价单编号', trigger: 'blur' }],
          quotationFromId: [{ required: true, message: '请选择产品供应方', trigger: 'blur' }],
          quotationToId: [{ required: true, message: '请选择买方', trigger: 'blur' }],
          quotationAmount: [{ required: true, message: '请选择产品', trigger: 'blur' }],
          quotationDate: [{ required: true, message: '请选择报价日期', trigger: 'blur' }],
          quotationUserId: [{ required: true, message: '请选择报价人', trigger: 'blur' }]
        },
        goodsInfo: {
          productId: [{ required: true, message: '请选择产品', trigger: 'blur' }],
          productCode: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
          productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
          quantity: [{ required: true, message: '请输入产品数量', trigger: blur }],
          netUnitPrice: [{ required: true, message: '请输入净单价', trigger: 'blur' }],
          taxIncludedPrice: [{ required: true, message: '请输入含税单价', trigger: 'blur' }],
          netTotalAmount: [{ required: true, message: '请输入净总价', trigger: 'blur' }],
          taxIncludedTotalAmount: [{ required: true, message: '请输入含税总价', trigger: 'blur' }]
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
        javaCodeNameList: ['UserBuilder', 'CustomerBuilder', 'ProductBuilder', 'CompanyBuilder']
      }
    }
  },
  async created() {
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getQuotationById(this.$route.params.id).then(res => {
      Object.assign(this.form, res.data)
    })
    await this.init()
    this.form.projectId = this.$route.params.projectId
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '报价单编号',
            prop: 'quotationCode',
            type: 'input',
            disabled: true
          },
          {
            label: '报价时间',
            prop: 'quotationDate',
            type: 'date'
          },
          {
            label: '供应商',
            prop: 'quotationFromId',
            type: 'select',
            bundle: {
              label: 'quotationFromName',
              value: 'quotationFromId'
            },
            options: this.javaCode['CompanyBuilder']
          },
          {
            label: '买方',
            prop: 'quotationToId',
            type: 'select',
            bundle: {
              label: 'quotationToName',
              value: 'quotationToId'
            },
            options: this.javaCode['CustomerBuilder']
          },
          {
            label: '报价人',
            prop: 'quotationUserId',
            type: 'select',
            bundle: {
              label: 'quotationUserName',
              value: 'quotationUserId'
            },
            options: this.javaCode['UserBuilder']
          }
        ],
        goodsInfo: {
          prop: 'quotationItemList',
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
              prop: 'taxIncludedTotalAmount',
              type: 'number'
            }
          ],
          totalColumns: ['taxIncludedPrice', 'taxIncludedTotalAmount'],
          showSummary: true,
          showButton: true,
          showProduct: true
        }
      }
      this.showForm = true
    },
    saveFun() {
      if (this.form.quotationItemList.length === 0) {
        this.$modal.msgWarning('请至少选择一项产品')
        return false
      }
      return true
    }
  }
}

</script>
