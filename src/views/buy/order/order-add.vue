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
import {
  netTotalAmountWithNetPrice, netUnitPriceWithNetTotal, netUnitPriceWithTaxPrice,
  taxIncludedPriceWithNetPrice, taxIncludedPriceWithTaxTotal,
  taxIncludedTotalAmountWithNetPrice
} from "@/utils/product-price";

export default {
  name: 'ProcurementOrderAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '新增采购订单',
      saveUrl: '/api/procurement/order/save',
      submitUrl: '/api/procurement/order/save-and-submit',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '产品信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        orderCode: undefined,
        contractNo: undefined,
        contractDate: undefined,
        deliveryDate: undefined,
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
          deliveryDate: [{ required: true, message: '请选择交货日期', trigger: 'blur' }],
          saleFromId: [{ required: true, message: '请选择供货方', trigger: 'blur' }],
          saleToId: [{ required: true, message: '请选择采购方', trigger: 'blur' }]
        },
        goodsInfo: {

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
            label: '交货日期',
            prop: 'deliveryDate',
            type: 'date'
          },
          {
            label: '供货方',
            prop: 'saleFromId',
            type: 'select',
            options: this.javaCode['CustomerBuilder']
          },
          {
            label: '采购方',
            prop: 'saleToId',
            type: 'select',
            options: this.javaCode['CompanyBuilder']
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
              type: 'number',
              input: (newVal, currentRow) => {
                newVal = newVal.replace(/[^0-9.]/g,'')
                currentRow.quantity = newVal
                // 有净单价
                if (currentRow.netUnitPrice !== undefined || currentRow.quantity !== '') {
                  currentRow.netTotalAmount = netTotalAmountWithNetPrice(currentRow.quantity, currentRow.netUnitPrice)
                  currentRow.taxIncludedTotalAmount = taxIncludedTotalAmountWithNetPrice(currentRow.quantity, currentRow.taxIncludedPrice)
                }
              }
            },
            {
              label: '净单价',
              prop: 'netUnitPrice',
              type: 'number',
              input: (newNumber, currentRow) => {
                newNumber = newNumber.replace(/[^0-9.]/g,'')
                currentRow.netUnitPrice = newNumber
                currentRow.taxIncludedPrice = taxIncludedPriceWithNetPrice(newNumber)
                if (currentRow.quantity === undefined || currentRow.quantity === '') {
                  // 未填写数量，不做任何操作
                  this.$modal.msgWarning('请先设置产品数量')
                  currentRow.netUnitPrice = undefined
                } else {
                  currentRow.netTotalAmount = netTotalAmountWithNetPrice(currentRow.quantity, newNumber)
                  currentRow.taxIncludedTotalAmount = taxIncludedTotalAmountWithNetPrice(currentRow.quantity, currentRow.taxIncludedPrice)
                }
              }
            },
            {
              label: '含税单价',
              prop: 'taxIncludedPrice',
              type: 'number',
              input: (newVal, currentRow) => {
                newVal = newVal.replace(/[^0-9.]/g,'')
                currentRow.taxIncludedPrice = newVal
                if (currentRow.quantity === undefined || currentRow.quantity === '') {
                  this.$modal.msgWarning('请先设置产品数量')
                  currentRow.taxIncludedPrice = undefined
                } else {
                  currentRow.netUnitPrice = netUnitPriceWithTaxPrice(newVal)
                  currentRow.taxIncludedTotalAmount = taxIncludedTotalAmountWithNetPrice(currentRow.quantity, newVal)
                  currentRow.netTotalAmountWithNetPrice = netTotalAmountWithNetPrice(currentRow.quantity, currentRow.netUnitPrice)
                  currentRow.taxIncludedTotalAmount = taxIncludedTotalAmountWithNetPrice(currentRow.quantity, newVal)
                }
              }
            },
            {
              label: '净总价',
              prop: 'netTotalAmount',
              type: 'number',
              input: (newVal, currentRow) => {
                newVal = newVal.replace(/[^0-9.]/g,'')
                currentRow.netTotalAmount = newVal
                if (currentRow.quantity === undefined || currentRow.quantity === '') {
                  this.$modal.msgWarning('请先设置产品数量')
                  currentRow.netTotalAmount = undefined
                } else {
                  currentRow.netUnitPrice = netUnitPriceWithNetTotal(newVal, currentRow.quantity)
                  currentRow.taxIncludedPrice = taxIncludedPriceWithNetPrice(currentRow.netUnitPrice)
                  currentRow.taxIncludedTotalAmount = taxIncludedTotalAmountWithNetPrice(currentRow.quantity, currentRow.taxIncludedPrice)
                }
              }
            },
            {
              label: '含税总价',
              prop: 'taxIncludedTotalAmount',
              type: 'number',
              input: (newVal, currentRow) => {
                newVal = newVal.replace(/[^0-9.]/g,'')
                currentRow.taxIncludedTotalAmount = newVal
                if (currentRow.quantity === undefined || currentRow.quantity === '') {
                  this.$modal.msgWarning('请先设置产品数量')
                  currentRow.taxIncludedTotalAmount = undefined
                } else {
                  currentRow.taxIncludedPrice = taxIncludedPriceWithTaxTotal(newVal, currentRow.quantity)
                  currentRow.netUnitPrice = netUnitPriceWithTaxPrice(currentRow.taxIncludedPrice)
                  currentRow.netTotalAmount = netTotalAmountWithNetPrice(currentRow.quantity, currentRow.netUnitPrice)
                }
              }
            }
          ],
          showProduct: true,
          showButton: true,
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
