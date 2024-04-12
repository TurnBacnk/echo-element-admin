
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
import { getClientContactListById } from '@/api/business/client'
import { getProductInfoById } from '@/api/business/product-info'

export default {
  name: 'SaleOutboundAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '',
      saveUrl: '/api/sale-outbound/save',
      submitUrl: '/api/sale-outbound/update',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '物资信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        saleContractId: undefined,
        saleContractCode: undefined,
        saleOutboundCode: undefined,
        outboundTime: undefined,
        clientId: undefined,
        clientName: undefined,
        saleUserId: undefined,
        saleUserName: undefined,
        otherAmount: undefined,
        discountAmount: undefined,
        discountRate: undefined,
        afterDiscountReceiveAmount: undefined,
        clientContactId: undefined,
        clientContactName: undefined,
        contactPhone: undefined,
        contactLandLine: undefined,
        contactAddress: undefined,
        clientAddress: undefined,
        clientRegion: undefined,
        logisticsCompany: undefined,
        trackingNumber: undefined,
        saleOutboundItemList: []
      },
      rules: {
        baseInfo: {

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
        javaCodeNameList: ['SaleContractBuilder', 'CustomerBuilder', 'UserBuilder', 'ProductBuilder']
      },
      saleContractDisabled: false,
      clientContactUser: []
    }
  },
  watch: {
    'form.clientId': {
      handler(newVal, oldVal) {
        getClientContactListById(newVal).then(res => {
          res.data.forEach(item => {
            this.clientContactUser.push(item)
          })
        })
      },
      immediate: true,
      deep: true
    }
  },
  async created() {
    await generateCode('SALE-OUTBOUND').then(res => {
      this.form.saleOutboundCode = res.data
    })
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
            label: '销售合同',
            prop: 'saleContractId',
            type: 'selectTemplate',
            bundle: {
              label: 'saleContractCode',
              value: 'saleContractId'
            },
            options: this.javaCode['SaleContractBuilder'],
            disabled: this.saleContractDisabled
          },
          {
            label: '销售出库单编号',
            prop: 'saleOutboundCode',
            type: 'input',
            disabled: true
          },
          {
            label: '出库日期',
            prop: 'saleOutboundTime',
            type: 'date'
          },
          {
            label: '客户',
            prop: 'clientId',
            type: 'select',
            bundle: {
              label: 'clientName',
              value: 'clientId'
            },
            options: this.javaCode['CustomerBuilder']
          },
          {
            label: '销售人员',
            prop: 'saleUserId',
            type: 'select',
            bundle: {
              label: 'saleUserName',
              value: 'saleUserId'
            },
            options: this.javaCode['UserBuilder']
          },
          {
            label: '其他费用',
            prop: 'otherAmount',
            type: 'inputNumber'
          },
          {
            label: '优惠率',
            prop: 'discountRate',
            type: 'inputNumber'
          },
          {
            label: '优惠金额',
            prop: 'discountAmount',
            type: 'inputNumber'
          },
          {
            label: '优惠后应收款',
            prop: 'afterDiscountReceiveAmount',
            type: 'inputNumber'
          },
          {
            label: '客户联系人',
            prop: 'clientContactId',
            type: 'select',
            bundle: {
              id: 'clientContactId',
              contactName: 'clientContactName',
              phone: 'contactPhone',
              landLine: 'clientLandLine',
              address: 'clientAddress'
            },
            options: this.clientContactUser,
            optionLabel: 'contactName',
            optionValue: 'id'
          },
          {
            label: '联系人手机号',
            prop: 'contactPhone',
            type: 'input'
          },
          {
            label: '联系人座机',
            prop: 'clientLandLine',
            type: 'input'
          },
          {
            label: '联系人地址',
            prop: 'clientAddress',
            type: 'input'
          },
          {
            label: '联系人地区',
            prop: 'clientRegion ',
            type: 'input'
          },
          {
            label: '物流公司',
            prop: 'logisticsCompany',
            type: 'input'
          },
          {
            label: '物流单号',
            prop: 'trackingNumber',
            type: 'input'
          }
        ],
        goodsInfo: {
          prop: 'saleOutboundItemList',
          column: [
            {
              label: '产品名称',
              prop: 'productName',
              type: 'select',
              optionList: this.javaCode['ProductBuilder'],
              click: (event, row) => {
                getProductInfoById(event).then(res => {
                  const { data } = res
                  row.productName = data.productName
                  row.productId = data.productId
                  row.productCode = data.productCode
                  row.barCode = data.barCode
                  row.specification = data.specification
                  row.unit = data.unit
                  row.productDescription = data.productDescription
                })
              }
            },
            {
              label: '产品编码',
              prop: 'productCode',
              type: 'input',
              disabled: true,
              width: '200px'
            },
            {
              label: '产品条码',
              prop: 'barCode',
              type: 'input',
              disabled: true
            },
            {
              label: '产品规格',
              prop: 'specification',
              type: 'input',
              disabled: true
            },
            {
              label: '单位',
              prop: 'unit',
              type: 'input',
              disabled: true
            },
            {
              label: '数量',
              prop: 'number',
              type: 'number',
              input: (newNumber, currentRow) => {
                if (currentRow.salePrice) {
                  // 销售单价存在
                  if (currentRow.discountRate) {
                    // 优惠率存在 计算优惠金额
                    currentRow.discountAmount = this.computeDiscountAmount(currentRow.salePrice, currentRow.discountRate, newNumber)
                    currentRow.salePriceAfterTax = this.computeSalePriceAfterTax(currentRow.salePrice, newNumber, currentRow.discountAmount)
                    // 税率存在
                    if (currentRow.taxRate) {
                      currentRow.taxAmount = this.computeTaxAmount(currentRow.salePriceAfterTax, currentRow.taxRate, newNumber)
                      currentRow.totalTaxAmount = this.computeTotalTaxAmount(currentRow.salePriceAfterTax, currentRow.taxAmount)
                    }
                  }
                }
              }
            },
            {
              label: '销售单价',
              prop: 'salePrice',
              type: 'number',
              input: (newSalePrice, currentRow) => {
                if (currentRow.taxRate) {
                  // 存在税率，计算含税价格
                  currentRow.includeTaxPrice = this.computeIncludeTaxPrice(newSalePrice, currentRow.taxRate)
                }
                // 销售单价发生变化
                if (currentRow.discountRate) {
                  // 优惠率已经填写
                  // 计算优惠金额
                  currentRow.discountAmount = this.computeDiscountAmount(newSalePrice, currentRow.discountRate, currentRow.number)
                  // 优惠价格变化 重新计算销售价格
                  currentRow.salePriceAfterTax = this.computeSalePriceAfterTax(newSalePrice, currentRow.number, currentRow.discountAmount)
                  // 销售价格发生变化 且税率已经填写 重新计算税额
                  if (currentRow.taxRate) {
                    currentRow.taxAmount = this.computeTaxAmount(currentRow.salePriceAfterTax, currentRow.taxRate, currentRow.number)
                    // 重新计算含税价格合计
                    currentRow.totalTaxAmount = this.computeTotalTaxAmount(currentRow.salePriceAfterTax, currentRow.taxAmount)
                  }
                }
              }
            },
            {
              label: '含税价格',
              prop: 'includeTaxPrice',
              type: 'number',
              disabled: true
            },
            {
              label: '优惠率',
              prop: 'discountRate',
              type: 'number',
              input: (newDiscountRate, currentRow) => {
                // 优惠价格
                currentRow.discountAmount = this.computeDiscountAmount(currentRow.salePrice, newDiscountRate, currentRow.number)
                // 销售价格
                currentRow.salePriceAfterTax = this.computeSalePriceAfterTax(currentRow.salePrice, currentRow.number, currentRow.discountAmount)
                // 如果税率存在，计算税额，计算含税价格
                if (currentRow.taxRate) {
                  // 税额
                  currentRow.taxAmount = this.computeTaxAmount(currentRow.salePriceAfterTax, currentRow.taxRate, currentRow.number)
                  // 含税金额
                  currentRow.totalTaxAmount = this.computeTotalTaxAmount(currentRow.salePriceAfterTax, currentRow.taxAmount)
                }
              }
            },
            {
              label: '优惠金额',
              prop: 'discountAmount',
              type: 'number',
              disabled: true
            },
            {
              label: '销售价格',
              prop: 'salePriceAfterTax',
              type: 'number',
              disabled: true
            },
            {
              label: '税率',
              prop: 'taxRate',
              type: 'number',
              input: (newTaxRate, currentRow) => {
                // 税率变化影响 含税价格，税额，税额合计价格
                if (currentRow.salePrice) {
                  // 销售单价已填写，改变含税价格
                  currentRow.includeTaxPrice = this.computeIncludeTaxPrice(currentRow.salePrice, newTaxRate)
                }
                if (currentRow.salePriceAfterTax) {
                  // 税额
                  currentRow.taxAmount = this.computeTaxAmount(currentRow.salePriceAfterTax, newTaxRate, currentRow.number)
                  // 税额合计
                  currentRow.totalTaxAmount = this.computeTotalTaxAmount(currentRow.salePriceAfterTax, currentRow.taxAmount)
                }
              }
            },
            {
              label: '税额',
              prop: 'taxAmount',
              type: 'number',
              disabled: true
            },
            {
              label: '税额合计价格',
              prop: 'totalTaxAmount',
              type: 'number',
              disabled: true
            },
            {
              label: '备注',
              prop: 'remark',
              type: 'input'
            },
            {
              label: '产品描述',
              prop: 'productDescription',
              type: 'input',
              disabled: true
            }
          ],
          totalColumns: ['discountAmount', 'salePriceAfterTax', 'taxAmount', 'totalTaxAmount'],
          showSummary: true
        }
      }
      this.showForm = true
    },
    computeIncludeTaxPrice(salePrice, taxRate) {
      return this.$math.format(this.$math.add(this.$math.multiply(salePrice, taxRate * 0.01), salePrice), { precision: 2, notation: 'fixed' })
    },
    computeDiscountAmount(salePrice, discountRate, number) {
      return this.$math.format(this.$math.multiply(this.$math.multiply(salePrice, discountRate * 0.01), number), { precision: 2, notation: 'fixed' })
    },
    computeSalePriceAfterTax(salePrice, number, discountAmount) {
      return this.$math.format(this.$math.subtract(this.$math.multiply(salePrice, number), discountAmount), { precision: 2, notation: 'fixed' })
    },
    computeTaxAmount(salePriceAfterTax, taxRate, number) {
      return this.$math.format(this.$math.multiply(salePriceAfterTax, taxRate * 0.01), { precision: 2, notation: 'fixed' })
    },
    computeTotalTaxAmount(salePriceAfterTax, taxAmount) {
      return this.$math.add(salePriceAfterTax, taxAmount)
    }
  }
}

</script>
