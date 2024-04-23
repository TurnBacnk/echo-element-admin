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
      :save-fun="saveFun"
      :is-approval="true"
      :is-view="true"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import {getDictionary, getJavaCode} from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'
import { getClientContactListById } from '@/api/business/client'
import { getProductInfoById } from '@/api/business/product-info'
import {getSaleOrderInfoById} from "@/api/business/sale-order";
import EditTable from "@/components/EditTable/index.vue";
import {getSaleOutboundInfoByCode, getSaleOutboundInfoById} from "@/api/business/sale-outbound";

export default {
  name: 'SaleOutboundEdit',
  components: {EditTable, FormTable },
  data() {
    return {
      showForm: false,
      contentText: '销售出库审核',
      saveUrl: '/api/sale-outbound/update',
      submitUrl: '/api/sale-outbound/update-and-single-submit',
      canSubmit: true,
      collapseConfig: [
        {active: true, title: '基本信息', name: 'baseInfo', type: 'form'},
        {active: true, title: '物资信息', name: 'goodsInfo', type: 'table'},
        {active: true, title: '其他费用', name: 'otherAmount', type: 'table'}
      ],
      form: {
        saleOrderID: undefined,
        saleOrderCode: undefined,
        saleOutboundCode: undefined,
        outboundTime: new Date(),
        clientId: undefined,
        clientName: undefined,
        saleUserId: undefined,
        saleUserName: undefined,
        otherAmount: 0,
        discountAmount: 0,
        discountRate: 0,
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
        saleOutboundItemList: [],
        saleOutboundOtherAmounts: []
      },
      rules: {
        baseInfo: {
          saleContractId: [{required: true, message: '请选择销售合同', trigger: 'blur'}],
          clientId: [{required: true, message: '请选择客户', trigger: 'blur'}],
          saleUserId: [{required: true, message: '请选择销售人员', trigger: 'blur'}]
        },
        goodsInfo: {
          productId: [{required: true, message: '请选择产品', trigger: 'blur'}],
          number: [{required: true, message: '请输入数量', trigger: 'blur'}],
          discountRate: [{required: true, message: '请输入优惠率', trigger: 'blur'}],
          taxRate: [{required: true, message: '请输入税率', trigger: 'blur'}]
        },
        otherAmount: {}
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: []
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['Unit']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['SaleOrderBuilder', 'CustomerBuilder', 'UserBuilder', 'ProductBuilder', 'VendorBuilder']
      },
      saleContractDisabled: false,
      clientContactUser: []
    }
  },
  watch: {
    'form.otherAmount': {
      handler(newVal, oldVal) {
        if (this.form.discountRate !== 0) {
          // 有优惠
          let temp = 0
          this.form.saleOutboundItemList.forEach((ele) => {
            temp = this.$math.add(ele.totalTaxAmount, temp)
          })
          this.form.afterDiscountReceiveAmount = this.$math.format(this.$math.multiply(this.$math.add(temp, newVal), this.form.discountRate + 1), {
            precision: 2,
            notation: 'fixed'
          })
        } else {
          this.form.afterDiscountReceiveAmount = this.$math.add(newVal, this.form.afterDiscountReceiveAmount)
        }
      }
    },
    'form.clientId': {
      handler(newVal, oldVal) {
        getClientContactListById(newVal).then(res => {
          this.clientContactUser.length = 0
          res.data.forEach(item => {
            this.clientContactUser.push(item)
          })
        })
      },
      immediate: true,
      deep: true
    },
    'form.saleOutboundItemList.length': {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          // 数组为空
          this.form.afterDiscountReceiveAmount = 0
          this.form.discountAmount = 0
        } else {
          var temp = 0
          if (this.form.discountRate) {
            this.form.saleOutboundItemList.forEach((ele) => {
              temp = this.$math.add(ele.totalTaxAmount, temp)
            })
            this.form.discountAmount = this.$math.format(this.$math.multiply(this.form.discountRate * 0.01, temp), {
              precision: 2,
              notation: 'fixed'
            })
            this.form.afterDiscountReceiveAmount = this.$math.format(this.$math.subtract(temp, this.form.discountAmount), {
              precision: 2,
              notation: 'fixed'
            })
          }
        }
      }
    },
    'form.discountRate': {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          this.form.discountAmount = 0
        } else {
          var temp = 0
          this.form.saleOutboundItemList.forEach((ele) => {
            temp = this.$math.add(ele.totalTaxAmount, temp)
          })
          this.form.discountAmount = this.$math.format(this.$math.multiply(newVal * 0.01, temp), {
            precision: 2,
            notation: 'fixed'
          })
          this.form.afterDiscountReceiveAmount = this.$math.format(this.$math.subtract(temp, this.form.discountAmount), {
            precision: 2,
            notation: 'fixed'
          })
        }
      }
    },
    'form.saleOutboundOtherAmounts.length': {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          this.form.otherAmount = 0
        } else {
          let _this = this
          this.form.otherAmount = 0
          this.form.saleOutboundOtherAmounts.forEach((ele) => {
            this.form.otherAmount = _this.$math.add(this.form.otherAmount, ele.clientPayAmount)
          })
        }
      }
    }
  },
  async created() {
    await this.initParams()
    await getSaleOutboundInfoByCode(this.$route.params.code).then(res => {
      Object.assign(this.form, res.data)
      this.form.instanceId = this.$route.params.instanceId
    })
    await generateCode('SALE-OUTBOUND').then(res => {
      this.form.saleOutboundCode = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await this.init()
  },
  methods: {
    initParams() {
      if (this.$route.params.saleOrderId) {
        this.form.saleOrderCode = this.$route.params.saleOrderCode
        this.form.saleOrderId = this.$route.params.saleOrderId
        this.saleContractDisabled = true
      }
    },
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '销售合同',
            prop: 'saleOrderId',
            type: 'selectTemplate',
            bundle: {
              rightLabel: 'saleOrderCode',
              value: 'saleOrderId'
            },
            options: this.javaCode['SaleOrderBuilder'],
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
            prop: 'outboundTime',
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
            label: '其他费用',
            prop: 'otherAmount',
            type: 'inputNumber',
            blur: () => {
              this.dialogVisible = true
            }
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
              landLine: 'clientLandLine',
              address: 'clientAddress'
            },
            options: this.clientContactUser,
            optionLabel: 'contactName',
            optionValue: 'id',
            disabled: true
          },
          {
            label: '联系人手机号',
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
            label: '客户地区',
            prop: 'clientRegion',
            type: 'input',
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
                  const {data} = res
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
              type: 'selectConstant',
              optionList: this.dictionary['Unit'],
              disabled: true
            },
            {
              label: '数量',
              prop: 'amount',
              type: 'number',
              input: (newNumber, currentRow) => {
                if (currentRow.salePrice) {
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
                if (currentRow.taxRate) {
                  // 存在税率，计算含税价格
                  currentRow.includeTaxPrice = this.computeIncludeTaxPrice(newSalePrice, currentRow.taxRate)
                }
                // 销售单价发生变化
                if (currentRow.discountRate) {
                  // 优惠率已经填写
                  // 计算优惠金额
                  currentRow.discountAmount = this.computeDiscountAmount(newSalePrice, currentRow.discountRate, currentRow.amount)
                  // 优惠价格变化 重新计算销售价格
                  currentRow.salePriceAfterTax = this.computeSalePriceAfterTax(newSalePrice, currentRow.amount, currentRow.discountAmount)
                  // 销售价格发生变化 且税率已经填写 重新计算税额
                  if (currentRow.taxRate) {
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
                if (currentRow.taxRate) {
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
                if (currentRow.salePrice) {
                  // 销售单价已填写，改变含税价格
                  currentRow.includeTaxPrice = this.computeIncludeTaxPrice(currentRow.salePrice, newTaxRate)
                }
                if (currentRow.salePriceAfterTax) {
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
          showSummary: true
        },
        otherAmount: {
          prop: 'saleOutboundOtherAmounts',
          column: [
            {
              prop: 'vendorName',
              type: 'select',
              label: '供应商',
              optionList: this.javaCode['VendorBuilder'],
              click: (event, row) => {
                const obj = this.javaCode['VendorBuilder'].find(ele => {
                  if (ele.value === event) {
                    return ele
                  }
                })
                row.vendorName = obj.label
                row.vendorId = obj.value
              }
            },
            {
              prop: 'costType',
              type: 'selectConstant',
              optionList: this.dictionary['Unit'],
              label: '费用类型',
              click: (event, row) => {
                row.costType = event
              }
            },
            {
              prop: 'amount',
              type: 'number',
              label: '费用金额',
              input: (newNumber, currentRow) => {
                currentRow.clientPayAmount = newNumber
              }
            },
            {
              prop: 'clientPayAmount',
              type: 'number',
              label: '客户承担金额'
            }
          ],
          totalColumns: ['amount', 'clientPayAmount'],
          showSummary: true
        }
      }
      this.showForm = true
    },
    computeIncludeTaxPrice(salePrice, taxRate) {
      return this.$math.format(this.$math.add(this.$math.multiply(salePrice, taxRate * 0.01), salePrice), {
        precision: 2,
        notation: 'fixed'
      })
    },
    computeDiscountAmount(salePrice, discountRate, number) {
      return this.$math.format(this.$math.multiply(this.$math.multiply(salePrice, discountRate * 0.01), number), {
        precision: 2,
        notation: 'fixed'
      })
    },
    computeSalePriceAfterTax(salePrice, number, discountAmount) {
      return this.$math.format(this.$math.subtract(this.$math.multiply(salePrice, number), discountAmount), {
        precision: 2,
        notation: 'fixed'
      })
    },
    computeTaxAmount(salePriceAfterTax, taxRate, number) {
      return this.$math.format(this.$math.multiply(salePriceAfterTax, taxRate * 0.01), {
        precision: 2,
        notation: 'fixed'
      })
    },
    computeTotalTaxAmount(salePriceAfterTax, taxAmount) {
      return this.$math.add(salePriceAfterTax, taxAmount)
    },
    computeTotalAfterDiscountAmount(oldAmount, newAmount) {
      if (oldAmount === undefined) {
        oldAmount = 0
      }
      this.form.afterDiscountReceiveAmount = this.$math.format(this.$math.add(this.$math.subtract(this.form.afterDiscountReceiveAmount, oldAmount), newAmount), {
        precision: 2,
        notation: 'fixed'
      })
      if (this.form.discountRate && this.form.discountRate > 0) {
        this.form.discountAmount = this.$math.format(this.$math.multiply(this.form.discountRate * 0.01, this.form.afterDiscountReceiveAmount), {
          precision: 2,
          notation: 'fixed'
        })
      }
    },
    saveFun() {
      if (this.form.saleOutboundItemList.length === 0) {
        this.$modal.msgWarning('请至少选择一项产品')
        return false
      }
      return true
    },
    handleDataUpdate(updateData, prop) {
      this.form.saleOutboundOtherAmounts = updateData
    },
    customAppendFun() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.form.otherAmount = 0
          let _this = this
          this.form.saleOutboundOtherAmounts.forEach((ele) => {
            this.form.otherAmount = _this.$math.add(this.form.otherAmount, ele.clientPayAmount)
          })
          this.dialogVisible = false
        })
        .catch(_ => {
          this.dialogVisible = false
        });
    }
  }
}

</script>
