
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
      :is-approval="false"
      :is-view="false"
      :save-fun="saveFun"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import {getJavaCode} from "@/api/common/dict";
import {getClientContactListById} from "@/api/business/client";
import {getProductInfoById} from "@/api/business/product-info";
import {generateCode} from "@/api/config/generate-code";
import {getSaleOutboundInfoByCode, getSaleOutboundList} from "@/api/business/sale-outbound";
import {getSaleReturnOrderById} from "@/api/business/sale-return";

export default {
  name: 'SaleReturnOrderEdit',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '销售退货修改',
      saveUrl: '/api/sale-return/update',
      submitUrl: '/api/sale-return/update-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '物资信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        saleReturnOrderCode: undefined,
        saleReturnOrderTime: new Date(),
        clientId: undefined,
        clientName: undefined,
        saleOutboundOrderId: undefined,
        saleOutboundOrderCode: undefined,
        saleUserId: undefined,
        saleUserName: undefined,
        discountRate: undefined,
        discountAmount: undefined,
        afterDiscountReceiveAmount: undefined,
        clientContactId: undefined,
        clientContactName: undefined,
        contactPhone: undefined,
        contactLandLine: undefined,
        contactAddress: undefined,
        clientAddress: undefined,
        saleReturnItemList: []
      },
      rules: {
        baseInfo: {
          saleReturnOrderCode: [{ required: true, message: '请输入退货单编号', trigger: 'blur' }],
          clientId: [{ required: true, message: '请选择客户', trigger: 'blur' }],
          saleOutboundContractId: [{ required: true, message: '请选择销售出库单', trigger: 'blur' }],
          saleUserId: [{ required: true, message: '请选择', trigger: 'blur' }]
        },
        goodsInfo: {
          productId: [{ required: true, message: '请选择产品', trigger: 'blur' }],
          amount: [{ required: true, message: '请输入数量', trigger: 'blur' }],
          discountRate: [{ required: true, message: '请输入优惠率', trigger: 'blur' }],
          taxRate: [{ required: true, message: '请输入税率', trigger: 'blur' }]
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
        javaCodeNameList: ['UserBuilder', 'CustomerBuilder', 'ProductBuilder']
      },
      clientContactUser: []
    }
  },
  watch: {
    'form.clientId': {
      handler(newVal, oldVal) {
        getClientContactListById(newVal).then((res) => {
          res.data.forEach(item => {
            this.clientContactUser.push(item)
          })
        })
      }
    },
    'form.discountRate': {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          this.form.discountAmount = 0
        } else {
          var temp = 0
          this.form.saleReturnItemList.forEach((ele) => {
            temp = this.$math.add(ele.totalTaxAmount, temp)
          })
          this.form.discountAmount = this.$math.format(this.$math.multiply(newVal * 0.01, temp), { precision: 2, notation: 'fixed' })
          this.form.afterDiscountReceiveAmount = this.$math.format(this.$math.subtract(temp, this.form.discountAmount), { precision: 2, notation: 'fixed' })
        }
      }
    },
    'form.saleReturnItemList.length': {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          // 数组为空
          this.form.afterDiscountReceiveAmount = 0
          this.form.discountAmount = 0
        } else {
          var temp = 0
          if (this.form.discountRate) {
            this.form.saleReturnItemList.forEach((ele) => {
              temp = this.$math.add(ele.totalTaxAmount, temp)
            })
            this.form.discountAmount = this.$math.format(this.$math.multiply(this.form.discountRate * 0.01, temp), { precision: 2, notation: 'fixed' })
            this.form.afterDiscountReceiveAmount = this.$math.format(this.$math.subtract(temp, this.form.discountAmount), { precision: 2, notation: 'fixed' })
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  async created() {
    await getSaleReturnOrderById(this.$route.params.id).then(res => {
      const { data } = res
      Object.assign(this.form, res.data)
    })
    await generateCode('SALE_RETURN_ORDER').then(res => {
      this.form.saleReturnOrderCode = res.data
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
            label: '销售出库单',
            prop: 'saleOutboundOrderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '销售退货单编号',
            prop: 'saleReturnOrderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '退货时间',
            prop: 'saleReturnOrderTime',
            type: 'date',
          },
          {
            label: '客户',
            prop: 'clientId',
            type: 'select',
            bundle: {
              label: 'clientName',
              value: 'clientId'
            },
            options: this.javaCode['CustomerBuilder'],
            disabled: true
          },
          {
            label: '销售人员',
            prop: 'saleUserId',
            type: 'select',
            bundle: {
              label: 'saleUserName',
              value: 'saleUserId'
            },
            options: this.javaCode['UserBuilder'],
            disabled: true
          },
          {
            label: '优惠率',
            prop: 'discountRate',
            type: 'inputNumber',
            disabled: true
          },
          {
            label: '优惠金额',
            prop: 'discountAmount',
            type: 'inputNumber',
            disabled: true
          },
          {
            label: '优惠后应收款',
            prop: 'afterDiscountReceiveAmount',
            type: 'inputNumber',
            disabled: true
          },
          {
            label: '客户联系人',
            prop: 'clientContactId',
            type: 'select',
            bundle: {
              id: 'clientContactId',
              contactName: 'clientContactName',
              phone: 'contactPhone',
              landLine: 'contactLandLine',
              address: 'contactAddress'
            },
            options: this.clientContactUser,
            optionLabel: 'contactName',
            optionValue: 'id',
            disabled: true
          },
          {
            label: '联系人手机',
            prop: 'contactPhone',
            type: 'input',
            disabled: true
          },
          {
            label: '联系人座机',
            prop: 'contactLandLine',
            type: 'input',
            disabled: true
          },
          {
            label: '联系人地址',
            prop: 'contactAddress',
            type: 'input',
            disabled: true
          },
          {
            label: '客户地址',
            prop: 'clientAddress',
            type: 'input',
            disabled: true
          }
        ],
        goodsInfo: {
          prop: 'saleReturnItemList',
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
                  row.productId = data.id
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
              prop: 'amount',
              type: 'number',
              input: (newNumber, currentRow) => {
                if (currentRow.salePrice !== undefined) {
                  // 销售单价存在
                  if (currentRow.discountRate !== undefined) {
                    // 优惠率存在 计算优惠金额
                    currentRow.discountAmount = this.computeDiscountAmount(currentRow.salePrice, currentRow.discountRate, newNumber)
                    currentRow.salePriceAfterTax = this.computeSalePriceAfterTax(currentRow.salePrice, newNumber, currentRow.discountAmount)
                    // 税率存在
                    if (currentRow.taxRate !== undefined) {
                      currentRow.taxAmount = this.computeTaxAmount(currentRow.salePriceAfterTax, currentRow.taxRate, newNumber)
                      var temp = currentRow.totalTaxAmount
                      currentRow.totalTaxAmount = this.computeTotalTaxAmount(currentRow.salePriceAfterTax, currentRow.taxAmount)
                      this.computeTotalAfterDiscountAmount(temp, currentRow.totalTaxAmount)
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
                if (currentRow.taxRate !== undefined) {
                  // 存在税率，计算含税价格
                  currentRow.includeTaxPrice = this.computeIncludeTaxPrice(newSalePrice, currentRow.taxRate)
                }
                // 销售单价发生变化
                if (currentRow.discountRate !== undefined) {
                  // 优惠率已经填写
                  // 计算优惠金额
                  currentRow.discountAmount = this.computeDiscountAmount(newSalePrice, currentRow.discountRate, currentRow.amount)
                  // 优惠价格变化 重新计算销售价格
                  currentRow.salePriceAfterTax = this.computeSalePriceAfterTax(newSalePrice, currentRow.amount, currentRow.discountAmount)
                  // 销售价格发生变化 且税率已经填写 重新计算税额
                  if (currentRow.taxRate !== undefined) {
                    currentRow.taxAmount = this.computeTaxAmount(currentRow.salePriceAfterTax, currentRow.taxRate, currentRow.amount)
                    // 重新计算含税价格合计
                    var temp = currentRow.totalTaxAmount
                    currentRow.totalTaxAmount = this.computeTotalTaxAmount(currentRow.salePriceAfterTax, currentRow.taxAmount)
                    this.computeTotalAfterDiscountAmount(temp, currentRow.totalTaxAmount)
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
                currentRow.discountAmount = this.computeDiscountAmount(currentRow.salePrice, newDiscountRate, currentRow.amount)
                // 销售价格
                currentRow.salePriceAfterTax = this.computeSalePriceAfterTax(currentRow.salePrice, currentRow.amount, currentRow.discountAmount)
                // 如果税率存在，计算税额，计算含税价格
                if (currentRow.taxRate !== undefined) {
                  // 税额
                  currentRow.taxAmount = this.computeTaxAmount(currentRow.salePriceAfterTax, currentRow.taxRate, currentRow.amount)
                  // 含税金额
                  var temp = currentRow.totalTaxAmount
                  currentRow.totalTaxAmount = this.computeTotalTaxAmount(currentRow.salePriceAfterTax, currentRow.taxAmount)
                  this.computeTotalAfterDiscountAmount(temp, currentRow.totalTaxAmount)
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
                if (currentRow.salePrice !== undefined) {
                  // 销售单价已填写，改变含税价格
                  currentRow.includeTaxPrice = this.computeIncludeTaxPrice(currentRow.salePrice, newTaxRate)
                }
                if (currentRow.salePriceAfterTax !== undefined  ) {
                  // 税额
                  currentRow.taxAmount = this.computeTaxAmount(currentRow.salePriceAfterTax, newTaxRate, currentRow.amount)
                  // 税额合计
                  var temp = currentRow.totalTaxAmount
                  currentRow.totalTaxAmount = this.computeTotalTaxAmount(currentRow.salePriceAfterTax, currentRow.taxAmount)
                  this.computeTotalAfterDiscountAmount(temp, currentRow.totalTaxAmount)
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
          showSummary: true,
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
    },
    computeTotalAfterDiscountAmount(oldAmount, newAmount) {
      if (oldAmount === undefined) {
        oldAmount = 0
      }
      this.form.afterDiscountReceiveAmount = this.$math.format(this.$math.add(this.$math.subtract(this.form.afterDiscountReceiveAmount, oldAmount), newAmount), { precision: 2, notation: 'fixed' })
      if (this.form.discountRate && this.form.discountRate > 0) {
        this.form.discountAmount = this.$math.format(this.$math.multiply(this.form.discountRate * 0.01, this.form.afterDiscountReceiveAmount), { precision: 2, notation: 'fixed' })
      }
    },
    saveFun() {
      if (this.form.saleReturnItemList.length === 0) {
        this.$modal.msgWarning('请至少选择一项产品')
        return false
      }
      return true
    }
  }
}

</script>
