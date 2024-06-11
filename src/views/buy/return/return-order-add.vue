
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
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getProductInfoById } from '@/api/business/product-info'
import {getDictionary, getJavaCode} from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'
import { getVendorContactUserList } from '@/api/business/vendor'
import { getReturnOrderByInboundId } from '@/api/business/buy-return'

export default {
  name: 'DictAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '退货单登记',
      saveUrl: '/api/return-order/save',
      submitUrl: '/api/return-order/save-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '产品信息', name: 'productInfo', type: 'table' }
      ],
      form: {
        returnOrderCode: undefined,
        returnOrderTime: new Date(),
        vendorId: undefined,
        vendorName: undefined,
        inboundOrderCode: undefined,
        inboundOrderId: undefined,
        procurementUserId: undefined,
        procurementUserName: undefined,
        discountRate: undefined,
        discountAmount: undefined,
        afterDiscountPayAmount: undefined,
        returnOrderItemList: []
      },
      rules: {
        baseInfo: {
          returnOrderCode: [
            { required: true, message: '退货单编号不能为空', trigger: 'blur' }
          ],
          returnOrderTime: [
            { required: true, message: '退货时间不能不为空', trigger: 'blur' }
          ],
          vendorId: [
            { required: true, message: '供应商不能为空', trigger: 'blur' }
          ]
        },
        productInfo: {

        }
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
        javaCodeNameList: ['VendorBuilder', 'InboundOrderBuilder', 'UserBuilder', 'ProductBuilder', 'WarehouseBuilder']
      },
      vendorContactList: []
    }
  },
  watch: {
    'form.vendorId': {
      handler(newVal, oldVal) {
        getVendorContactUserList(newVal).then(res => {
          this.vendorContactList.length = 0
          res.data.forEach(item => {
            this.vendorContactList.push(item)
          })
        })
      }
    },
    'form.discountRate': {
      handler(newVal, oldVal) {
        let temp = 0
        this.form.inboundOrderItemList.forEach((ele) => {
          temp = this.$math.add(ele.taxTotalAmount, temp)
        })
        if (newVal === '0') {
          this.form.discountAmount = 0
          this.form.afterDiscountPayAmount = this.$math.format(temp, { precision: 2, notation: 'fixed' })
        } else {
          this.form.discountAmount = this.$math.format(this.$math.multiply(newVal * 0.01, temp), { precision: 2, notation: 'fixed' })
          this.form.afterDiscountPayAmount = this.$math.format(this.$math.subtract(temp, this.form.discountAmount), { precision: 2, notation: 'fixed' })
        }
      },
      deep: true
    },
    'form.returnOrderItemList.length': {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          // 数组为空
          this.form.afterDiscountPayAmount = 0
          this.form.discountAmount = 0
        } else {
          let temp = 0
          if (this.form.discountRate !== undefined) {
            this.form.returnOrderItemList.forEach((ele) => {
              temp = this.$math.add(ele.taxTotalAmount, temp)
            })
            this.form.discountAmount = this.$math.format(this.$math.multiply(this.$math.multiply(this.form.discountRate, 0.01), temp), { precision: 2, notation: 'fixed' })
            this.form.afterDiscountPayAmount = this.$math.format(this.$math.subtract(temp, this.form.discountAmount), { precision: 2, notation: 'fixed' })
          }
        }
      },
      deep: true
    }
  },
  async created() {
    await getReturnOrderByInboundId(this.$route.params.inboundId).then(res => {
      Object.assign(this.form, res.data)
      this.form.id = undefined
      this.form.procurementUserName = res.data.procurementUsername
      // res.data.inboundOrderItemList.forEach((ele) => {
      //   ele.id = undefined
      //   this.form.returnOrderItemList.push(ele)
      // })
      this.form.returnOrderItemList = []
    })
    await generateCode('PROCUREMENT_RETURN').then(res => {
      this.form.returnOrderCode = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await this.init()
    await this.initParams()
  },
  methods: {
    async initParams() {
      this.form.inboundOrderCode = this.$route.params.inboundCode
      this.form.inboundOrderId = this.$route.params.inboundId
    },
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '退货单编号',
            prop: 'returnOrderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '退货时间',
            prop: 'returnOrderTime',
            type: 'date'
          },
          {
            label: '供应商',
            prop: 'vendorId',
            type: 'select',
            bundle: {
              label: 'vendorName',
              value: 'vendorId'
            },
            options: this.javaCode['VendorBuilder'],
            disabled: true
          },
          {
            label: '入库单编号',
            prop: 'inboundOrderCode',
            type: 'select',
            options: this.javaCode['InboundOrderBuilder'],
            disabled: true
          },
          {
            label: '采购人员',
            prop: 'procurementUserId',
            type: 'select',
            options: this.javaCode['UserBuilder'],
            bundle: {
              label: 'procurementUserName',
              value: 'procurementUserId'
            },
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
            label: '优惠后应付款',
            prop: 'afterDiscountPayAmount',
            type: 'inputNumber',
            disabled: true
          },
          {
            label: '供应商联系人',
            prop: 'vendorContactId',
            type: 'select',
            bundle: {
              id: 'vendorContactId',
              contactName: 'vendorContactName',
              phone: 'vendorContactPhone',
              landLine: 'vendorContactLandLine',
              address: 'vendorContactAddress'
            },
            optionLabel: 'contactName',
            optionValue: 'id',
            options: this.vendorContactList,
            disabled: true
          },
          {
            label: '联系人手机',
            prop: 'vendorContactPhone',
            type: 'input',
            disabled: true
          },
          {
            label: '联系人座机',
            prop: 'vendorContactLandLine',
            type: 'input',
            disabled: true
          },
          {
            label: '联系人地址',
            prop: 'vendorContactAddress',
            type: 'input',
            disabled: true
          },
          {
            label: '供应商地址',
            prop: 'vendorAddress',
            type: 'input',
            disabled: true
          }
        ],
        productInfo: {
          prop: 'returnOrderItemList',
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
                  row.productSpec = data.specification
                  row.productDescription = data.productDescription
                  row.unit = data.unit
                })
              }
            },
            {
              label: '产品编码',
              prop: 'productCode',
              type: 'input',
              disabled: true
            },
            {
              label: '产品条码',
              prop: 'barCode',
              type: 'input',
              disabled: true
            },
            {
              label: '规格',
              prop: 'productSpec',
              type: 'input',
              disabled: true
            },
            {
              label: '产品描述',
              prop: 'productDescription',
              type: 'input',
              disabled: true
            },
            {
              label: '数量',
              prop: 'amount',
              type: 'number',
              input: (newNumber, currentRow) => {
                if (currentRow.procurementPrice) {
                  // 设置折扣额
                  currentRow.discountAmount = this.computeDiscountAmount(currentRow.procurementPrice, currentRow.discountRate, newNumber)
                  // 折扣额设置完成后，设置采购金额
                  currentRow.procurementAmount = this.computeProcurementAmount(currentRow.procurementPrice, newNumber, currentRow.discountAmount)
                  // 设置税额
                  currentRow.taxAmount = this.computeTaxAmount(currentRow.procurementAmount, currentRow.taxRate)
                  // 设置税价合计
                  currentRow.taxTotalAmount = this.computeTaxTotalAmount(currentRow.procurementAmount, currentRow.taxAmount)
                }
              }
            },
            {
              label: '单位',
              prop: 'unit',
              type: 'selectConstant',
              optionList: this.dictionary['Unit'],
              disabled: true
            },
            {
              label: '采购单价(元)',
              prop: 'procurementPrice',
              type: 'number',
              input: (newNumber, currentRow) => {
                currentRow.taxIncludedPrice = this.computeTaxIncludePrice(newNumber, currentRow.taxRate)
                // 有数量
                if (currentRow.amount) {
                  // 设置折扣额
                  currentRow.discountAmount = this.computeDiscountAmount(newNumber, currentRow.discountRate, currentRow.amount)
                  // 折扣额设置完成后，设置采购金额
                  currentRow.procurementAmount = this.computeProcurementAmount(newNumber, currentRow.amount, currentRow.discountAmount)
                  // 设置税额
                  currentRow.taxAmount = this.computeTaxAmount(currentRow.procurementAmount, currentRow.taxRate)
                  // 设置税价合计
                  currentRow.taxTotalAmount = this.computeTaxTotalAmount(currentRow.procurementAmount, currentRow.taxAmount)
                }
              }
            },
            {
              label: '含税价(元)',
              prop: 'taxIncludedPrice',
              type: 'number',
              disabled: true
            },
            {
              label: '折扣率(%)',
              prop: 'discountRate',
              type: 'number',
              defaultValue: 0,
              input: (newNumber, currentRow) => {
                if (currentRow.amount) {
                  if (currentRow.procurementPrice) {
                    // 有数量 有折扣率
                    // 设置折扣额
                    currentRow.discountAmount = this.computeDiscountAmount(currentRow.procurementPrice, newNumber, currentRow.amount)
                    // 折扣额设置完成后，设置采购金额
                    currentRow.procurementAmount = this.computeProcurementAmount(currentRow.procurementPrice, currentRow.amount, currentRow.discountAmount)
                    // 设置税额
                    currentRow.taxAmount = this.computeTaxAmount(currentRow.procurementAmount, currentRow.taxRate)
                    // 设置税价合计
                    currentRow.taxTotalAmount = this.computeTaxTotalAmount(currentRow.procurementAmount, currentRow.taxAmount)
                  }
                }
              }
            },
            {
              label: '折扣额(元)',
              prop: 'discountAmount',
              type: 'number',
              disabled: true
            },
            {
              label: '采购金额(元)',
              prop: 'procurementAmount',
              type: 'number'
            },
            {
              label: '税率(%)',
              prop: 'taxRate',
              type: 'number',
              defaultValue: this.$store.state.businessParam.taxRate,
              input: (newNumber, currentRow) => {
                if (currentRow.amount) {
                  if (currentRow.procurementPrice) {
                    // 设置含税价
                    currentRow.taxIncludedPrice = this.computeTaxIncludePrice(currentRow.procurementPrice, newNumber)
                    // 设置折扣额
                    currentRow.discountAmount = this.computeDiscountAmount(currentRow.procurementPrice, currentRow.discountRate, currentRow.amount)
                    // 折扣额设置完成后，设置采购金额
                    currentRow.procurementAmount = this.computeProcurementAmount(currentRow.procurementPrice, currentRow.amount, currentRow.discountAmount)
                    // 设置税额
                    currentRow.taxAmount = this.computeTaxAmount(currentRow.procurementAmount, newNumber)
                    // 设置税价合计
                    currentRow.taxTotalAmount = this.computeTaxTotalAmount(currentRow.procurementAmount, currentRow.taxAmount)
                  }
                }
              }
            },
            {
              label: '税额(元)',
              prop: 'taxAmount',
              type: 'number',
              disabled: true
            },
            {
              label: '税价合计(元)',
              prop: 'taxTotalAmount',
              type: 'number',
              disabled: true
            },
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
            }
          ],
          totalColumns: ['discountAmount', 'procurementAmount', 'taxAmount', 'taxTotalAmount'],
          showSummary: true,
          showButton: false,
          showReturn: true,
          returnQueryForm: {
            inboundOrderId: this.$route.params.inboundId
          }
        }
      }
      this.showForm = true
    },
    computeDiscountAmount(procurementPrice, discountRate, number) {
      return this.$math.format(this.$math.multiply(this.$math.multiply(procurementPrice, discountRate * 0.01), number), { precision: 2, notation: 'fixed' })
    },
    computeProcurementAmount(procurementPrice, number, discountAmount) {
      return this.$math.format(this.$math.subtract(this.$math.multiply(procurementPrice, number), discountAmount), { precision: 2, notation: 'fixed' })
    },
    computeTaxAmount(procurementAmount, taxRate) {
      return this.$math.format(this.$math.multiply(procurementAmount, taxRate * 0.01), { precision: 2, notation: 'fixed' })
    },
    computeTaxTotalAmount(procurementAmount, taxAmount) {
      return this.$math.format(this.$math.add(procurementAmount, taxAmount), { precision: 2, notation: 'fixed' })
    },
    computeTaxIncludePrice(procurementPrice, taxRate) {
      return this.$math.format(this.$math.multiply(procurementPrice, this.$math.add(1, taxRate * 0.01)), { precision: 2, notation: 'fixed' })
    },
    saveFun() {
      if (this.form.returnOrderItemList.length === 0) {
        this.$modal.msgWarning('请至少选择一项产品')
        return false
      }
      return true
    }
  }
}

</script>
