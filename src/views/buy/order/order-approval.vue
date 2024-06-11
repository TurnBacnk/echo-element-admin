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
      :is-view="true"
      :is-approval="true"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getDictionary, getJavaCode } from '@/api/common/dict'
import { getProductInfoById } from '@/api/business/product-info'
import { getVendorContactUserList } from '@/api/business/vendor'
import { getBuyOrderByCode } from '@/api/business/order'

export default {
  name: 'BuyOrderApproval',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '采购订单审核',
      saveUrl: '/api/order/save',
      submitUrl: '/api/order/submit',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '物料信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        orderCode: undefined,
        orderTime: undefined,
        deliveryDate: undefined,
        vendorId: undefined,
        vendorName: undefined,
        procurementUserId: undefined,
        procurementUserName: undefined,
        contractCode: undefined,
        contractTime: undefined,
        discountRate: 0,
        discountAmount: undefined,
        afterDiscountPayAmount: undefined,
        vendorContactId: undefined,
        vendorContactName: undefined,
        vendorContactPhone: undefined,
        vendorContactLandLine: undefined,
        vendorContactAddress: undefined,
        vendorAddress: undefined,
        saleContractId: undefined,
        saleContractCode: undefined,
        orderItemList: []
      },
      rules: {
        baseInfo: {
          orderCode: [{ required: true, message: '请输入采购订单编号', trigger: 'blur' }],
          orderTime: [{ required: true, message: '请选择单据时间', trigger: 'blur' }],
          deliveryDate: [{ required: true, message: '请选择交货日期', trigger: 'blur' }],
          vendorId: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
          procurementUserId: [{ required: true, message: '请选择采购人员', trigger: 'blur' }],
          contractCode: [{ required: true, message: '请输入采购合同号', trigger: 'blur' }]
        },
        goodsInfo: {
          productId: [{ required: true, message: '请选择产品', trigger: 'blur' }],
          discountRate: [{ required: true, message: '请输入折扣率', trigger: 'blur' }],
          taxRate: [{ required: true, message: '请输入税率', trigger: 'blur' }],
          warehouseId: [{ required: true, message: '请选择仓库', trigger: 'blur' }]
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
        javaCodeNameList: ['UserBuilder', 'VendorBuilder', 'ProductBuilder', 'WarehouseBuilder', 'SaleOrderBuilder']
      },
      vendorContactList: [],
      saleOrderDisabled: false
    }
  },
  watch: {
    'form.discountRate': {
      handler(newVal, oldVal) {
        let temp = 0
        this.form.orderItemList.forEach((ele) => {
          temp = this.$math.add(ele.taxTotalAmount, temp)
        })
        if (newVal === '0') {
          this.form.discountAmount = 0
          this.form.afterDiscountPayAmount = this.$math.format(temp, { precision: 2, notation: 'fixed' })
        } else {
          this.form.discountAmount = this.$math.format(this.$math.multiply(newVal * 0.01, temp), {
            precision: 2,
            notation: 'fixed'
          })
          this.form.afterDiscountPayAmount = this.$math.format(this.$math.subtract(temp, this.form.discountAmount), {
            precision: 2,
            notation: 'fixed'
          })
        }
      },
      immediate: true,
      deep: true
    },
    'form.orderItemList.length': {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          // 数组为空
          this.form.afterDiscountPayAmount = 0
          this.form.discountAmount = 0
        } else {
          let temp = 0
          if (this.form.discountRate !== undefined) {
            this.form.orderItemList.forEach((ele) => {
              temp = this.$math.add(ele.taxTotalAmount, temp)
            })
            this.form.discountAmount = this.$math.format(this.$math.multiply(this.$math.multiply(this.form.discountRate, 0.01), temp), {
              precision: 2,
              notation: 'fixed'
            })
            this.form.afterDiscountPayAmount = this.$math.format(this.$math.subtract(temp, this.form.discountAmount), {
              precision: 2,
              notation: 'fixed'
            })
          }
        }
      },
      deep: true
    }
  },
  async created() {
    await getBuyOrderByCode(this.$route.params.code).then(res => {
      Object.assign(this.form, res.data)
      this.form.instanceId = this.$route.params.instanceId
      if (this.form.saleOrderId !== "") {
        this.form.saleOrderId = res.data.saleOrderId.split(',')
      }
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await this.initParams()
    await this.init()
  },
  methods: {
    handleWarehouseDialog() {
      const obj = this.javaCode['WarehouseBuilder'].find(item => {
        if (item.value == this.warehouseId) {
          return item
        }
      })
      const tempArr = []
      this.form.orderItemList.forEach((ele, index) => {
        ele.warehouseId = this.warehouseId
        ele.warehouseName = obj.label
        tempArr.push(ele)
      })
      this.form.orderItemList = tempArr
      this.warehouseDialogVisible = false
    },
    initParams() {
      if (this.$route.params.saleOrderId) {
        this.form.saleOrderId = this.$route.params.saleOrderId
        this.form.saleOrderCode = this.$route.params.saleOrderCode
        this.saleContractDisabled = true
      }
    },
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '销售订单',
            prop: 'saleOrderId',
            type: 'select',
            bundle: {
              label: 'saleOrderId',
              value: 'saleOrderCode'
            },
            options: this.javaCode['SaleOrderBuilder'],
            disabled: this.saleOrderDisabled,
            multiple: true
          },
          {
            label: '订单编码',
            prop: 'orderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '订单时间',
            prop: 'orderTime',
            type: 'date'
          },
          {
            label: '交货日期',
            prop: 'deliveryDate',
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
            options: this.javaCode['VendorBuilder']
          },
          {
            label: '采购人员',
            prop: 'procurementUserId',
            type: 'select',
            bundle: {
              label: 'procurementUsername',
              value: 'procurementUserId'
            },
            options: this.javaCode['UserBuilder']
          },
          {
            label: '合同号',
            prop: 'contractCode',
            type: 'input'
          },
          {
            label: '合同日期',
            prop: 'contractTime',
            type: 'date'
          },
          {
            label: '优惠率(%)',
            prop: 'discountRate',
            type: 'inputNumber'
          },
          {
            label: '优惠金额(元)',
            prop: 'discountAmount',
            type: 'inputNumber',
            disabled: true
          },
          {
            label: '优惠后应付款(元)',
            prop: 'afterDiscountPayAmount',
            type: 'inputNumber',
            disabled: true
          }
        ],
        goodsInfo: {
          prop: 'orderItemList',
          column: [
            {
              label: '产品名称',
              prop: 'productName',
              type: 'select',
              fixed: 'left',
              width: 200,
              optionList: this.javaCode['ProductBuilder'],
              click: (event, row) => {
                // eslint-disable-next-line no-empty
                if (event === undefined || event === '') {

                } else {
                  return getProductInfoById(event).then(res => {
                    const { data } = res
                    row.productName = data.productName
                    row.productId = data.productId
                    row.productCode = data.productCode
                    row.barCode = data.barCode
                    row.specification = data.specification
                    row.productDescription = data.productDescription
                    row.unit = data.unit
                  })
                }
              }
            },
            {
              label: '产品编码',
              prop: 'productCode',
              type: 'input',
              fixed: 'left'
            },
            {
              label: '产品条码',
              prop: 'barCode',
              type: 'input'
            },
            {
              label: '规格',
              prop: 'specification',
              type: 'input'
            },
            {
              label: '产品描述',
              prop: 'productDescription',
              type: 'input'
            },
            {
              label: '数量',
              prop: 'amount',
              type: 'number',
              input: (newNumber, currentRow) => {
                // 根据采购单价，计算采购总价
                // 根据含税单价，计算含税总价
                try {
                  currentRow.procurementAmount = this.$math.format(this.$math.multiply(newNumber, currentRow.procurementPrice), { precision: 2, notation: 'fixed' })
                  currentRow.taxTotalAmount = this.$math.format(this.$math.multiply(newNumber, currentRow.taxIncludedPrice), { precision: 2, notation: 'fixed' })
                } catch (err) {

                }
              }
            },
            {
              label: '单位',
              prop: 'unit',
              type: 'selectConstant',
              optionList: this.dictionary['Unit']
            },
            {
              label: '采购单价(元)',
              prop: 'procurementPrice',
              type: 'number',
              input: (newNumber, currentRow) => {
                currentRow.procurementAmount = this.$math.format(this.$math.multiply(newNumber, currentRow.amount), { precision: 2, notation: 'fixed' })
                currentRow.taxAmount = this.$math.format(this.$math.subtract(currentRow.taxTotalAmount, currentRow.procurementAmount), { precision: 2, notation: 'fixed' })
              }
            },
            {
              label: '含税价(元)',
              prop: 'taxIncludedPrice',
              type: 'number',
              input: (newNumber, currentRow) => {
                if (currentRow.amount) {
                  currentRow.taxTotalAmount = this.$math.format(this.$math.multiply(newNumber, currentRow.amount), { precision: 2, notation: 'fixed' })
                }
                if (currentRow.procurementAmount) {
                  currentRow.taxAmount = this.$math.format(this.$math.subtract(currentRow.taxTotalAmount, currentRow.procurementAmount), { precision: 2, notation: 'fixed' })
                }
                currentRow.procurementPrice = this.$math.format(this.$math.divide(newNumber, currentRow.taxRate * 0.01 + 1), { precision: 2, notation: 'fixed' })
                currentRow.procurementAmount = this.$math.format(this.$math.multiply(currentRow.procurementPrice, currentRow.amount), { precision: 2, notation: 'fixed' })
              }
            },
            {
              label: '采购金额(元)',
              prop: 'procurementAmount',
              type: 'number',
              input: (newNumber, current) => {
                current.procurementPrice = this.$math.format(this.$math.divide(newNumber, current.amount), { precision: 2, notation: 'fixed' })
                current.taxAmount = this.$math.format(this.$math.subtract(current.taxTotalAmount, newNumber), { precision: 2, notation: 'fixed' })
              }
            },
            {
              label: '税率(%)',
              prop: 'taxRate',
              type: 'number',
              defaultValue: this.$store.state.businessParam.taxRate,
              input: (newNumber, currentRow) => {
                // 税率 影响未税
                currentRow.procurementPrice = this.$math.format(this.$math.divide(currentRow.taxIncludedPrice, (newNumber * 0.01 + 1)), { precision: 2, notation: 'fixed' })
                currentRow.procurementAmount = this.$math.format(this.$math.multiply(currentRow.procurementPrice, currentRow.amount), { precision: 2, notation: 'fixed' })
                currentRow.taxAmount = this.$math.format(this.$math.subtract(currentRow.taxTotalAmount, currentRow.procurementAmount), { precision: 2, notation: 'fixed' })
              }
            },
            {
              label: '税额(元)',
              prop: 'taxAmount',
              type: 'number'
            },
            {
              label: '税价合计(元)',
              prop: 'taxTotalAmount',
              type: 'number',
              input: (newNumber, currentRow) => {
                if (currentRow.amount) {
                  currentRow.taxIncludedPrice = this.$math.format( this.$math.divide(newNumber, currentRow.amount), { precision: 2, notation: 'fixed' })
                  currentRow.procurementPrice = this.$math.format(this.$math.divide(currentRow.taxIncludedPrice, currentRow.taxRate * 0.01 + 1), { precision: 2, notation: 'fixed' })
                  currentRow.procurementAmount = this.$math.format(this.$math.multiply(currentRow.procurementPrice, currentRow.amount), { precision: 2, notation: 'fixed' })
                  currentRow.taxAmount = this.$math.format(this.$math.subtract(newNumber, currentRow.procurementAmount), { precision: 2, notation: 'fixed' })
                }
              }
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
              },
              showButton: true,
              buttonClick: () => {
                this.warehouseDialogVisible = true
              },
              buttonText: '批量设置'
            },
            {
              label: '销售订单',
              prop: 'saleOrderCode',
              type: 'select',
              optionList: this.javaCode['SaleOrderBuilder'],
              click: (event, row) => {
                const obj = this.javaCode['SaleOrderBuilder'].find((item) => {
                  return item.value === event
                })
                row.saleOrderId = obj.value
                row.saleOrderCode = obj.label
                return new Promise(resolve => {
                  resolve()
                })
              }
            }
          ],
          totalColumns: ['discountAmount', 'procurementAmount', 'taxAmount', 'taxTotalAmount'],
          showSummary: true,
          showButton: true
        }
      }
      this.showForm = true
    },
    saveFun() {
      if (this.form.orderItemList.length === 0) {
        this.$modal.msgWarning('请至少选择一项产品')
        return false
      }
      this.form.saleOrderId = this.form.saleOrderId.join(',')
      return true
    }
  }
}

</script>
