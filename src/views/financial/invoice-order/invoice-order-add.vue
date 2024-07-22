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
import { getConstant, getDictionary, getJavaCode } from '@/api/common/dict'
import { getOutOrderInvoiceInfoWithOrderId } from '@/api/business/sales-out'

export default {
  name: 'FinancialInvoiceAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '销售开票登记',
      saveUrl: '/api/financial-invoice-order/save',
      submitUrl: '/api/financial-invoice-order/save-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '产品信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        invoiceNo: undefined,
        invoiceTitle: undefined,
        invoiceDate: new Date(),
        invoiceUserId: this.$store.state.user.id,
        invoiceUserName: this.$store.state.user.name,
        orderCode: undefined,
        orderId: undefined,
        orderType: 0,
        orderTime: undefined,
        clientName: undefined,
        clientId: undefined,
        invoiceAmount: 0.00,
        alreadyInvoiceAmount: 0.00,
        unInvoiceAmount: 0.00,
        amount: 0.00,
        productList: [],
        type: 0,
        capitalAccountName: undefined,
        capitalAccountId: undefined
      },
      rules: {
        baseInfo: {
          invoiceNo: [
            { required: true, message: '请输入发票号', trigger: 'blur' }
          ]
        },
        goodsInfo: {
          currentInvoiceProductAmount: [
            { required: true, message: '请输入开票数量', trigger: 'blur' }
          ]
        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['OrderType']
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['Unit']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['UserBuilder', 'CustomerBuilder', 'ProductBuilder', 'CapitalAccountBuilder']
      }
    }
  },
  watch: {
    'form.type': {
      handler(newVal, oldVal) {
        if (newVal !== 0) {
          this.rules.baseInfo = {}
        } else {
          this.rules.baseInfo = {
            invoiceNo: [
              { required: true, message: '请输入发票号', trigger: 'blur' }
            ]
          }
        }
      }
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await this.initBaseInfo()
    await this.init()
    await getOutOrderInvoiceInfoWithOrderId(this.$route.params.orderId).then(res => {
      Object.assign(this.form, res.data)
    })
  },
  methods: {
    async initBaseInfo() {
      this.form.clientId = this.$route.params.clientId
      this.form.clientName = this.$route.params.clientName
      this.form.invoiceTitle = this.$route.params.clientName
      this.form.alreadyInvoiceAmount = this.$route.params.alreadyInvoiceAmount
      this.form.unInvoiceAmount = this.$route.params.unInvoiceAmount
      this.form.orderCode = this.$route.params.orderCode
      this.form.orderId = this.$route.params.orderId
      this.form.orderTime = this.$route.params.orderTime
    },
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '发票号',
            prop: 'invoiceNo',
            type: 'input'
          },
          {
            label: '票据类型',
            prop: 'type',
            type: 'select',
            options: [
              {
                label: '普通票据',
                value: 0
              },
              {
                label: '外币账户汇款',
                value: 1
              },
              {
                label: '账外现金',
                value: 2
              },
              {
                label: '账内现金',
                value: 3
              }
            ]
          },
          {
            label: '资金账户',
            prop: 'capitalAccountName',
            type: 'select',
            options: this.javaCode['CapitalAccountBuilder'],
            bundle: {
              label: 'capitalAccountName',
              value: 'capitalAccountId'
            }
          },
          {
            label: '发票抬头',
            prop: 'invoiceTitle',
            type: 'input',
            disabled: true
          },
          {
            label: '开票日期',
            prop: 'invoiceDate',
            type: 'date'
          },
          {
            label: '开票人',
            prop: 'invoiceUserId',
            type: 'select',
            bundle: {
              value: 'invoiceUserId',
              label: 'invoiceUserName'
            },
            options: this.javaCode['UserBuilder']
          },
          {
            label: '单据编号',
            prop: 'orderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '单据类型',
            prop: 'orderType',
            type: 'select',
            options: this.constant['OrderType'],
            disabled: true
          },
          {
            label: '单据日期',
            prop: 'orderTime',
            type: 'date',
            disabled: true
          },
          {
            label: '客户',
            prop: 'clientId',
            type: 'select',
            options: this.javaCode['CustomerBuilder'],
            bundle: {
              value: 'clientId',
              label: 'clientName'
            },
            disabled: true
          },
          {
            label: '已开票金额',
            prop: 'alreadyInvoiceAmount',
            type: 'inputNumber',
            disabled: true
          },
          {
            label: '未开票金额',
            prop: 'unInvoiceAmount',
            type: 'inputNumber',
            disabled: true
          }
        ],
        goodsInfo: {
          prop: 'productList',
          column: [
            {
              label: '产品名称',
              prop: 'productName',
              type: 'input'
            },
            {
              label: '产品编码',
              prop: 'productCode',
              type: 'input',
              disabled: true,
              width: '200px'
            },
            {
              label: '应开票数量',
              prop: 'quantity',
              type: 'input',
              disabled: true
            },
            {
              label: '可开票数量',
              prop: 'canInvoiceProductAmount',
              type: 'input',
              disabled: true
            },
            {
              label: '本次开票数量',
              prop: 'currentInvoiceProductAmount',
              type: 'input',
              input: (newNumber, currentRow) => {
                // 修改开票数量 同步变更 本次开票金额 ，本次开票总金额
                if (newNumber === undefined || newNumber === '' || newNumber === 0) {
                  // 不填写
                  this.form.amount = 0
                  currentRow.amount = 0
                } else {
                  currentRow.amount = this.$math.multiply(currentRow.taxIncludedPrice, newNumber)
                }
              }
            },
            {
              label: '单价',
              prop: 'taxIncludedPrice',
              type: 'input'
            },
            {
              label: '应开票金额',
              prop: 'invoiceAmount',
              type: 'input',
              disabled: true
            },
            {
              label: '已开票金额',
              prop: 'alreadyInvoiceAmount',
              type: 'input',
              disabled: true
            },
            {
              label: '本次开票金额',
              prop: 'amount',
              type: 'input',
              disabled: true
            }
          ],
          showSummary: true,
          totalColumns: ['amount'],
          showButton: false
        }
      }
      this.showForm = true
    },
    saveFun() {
      if (this.form.productList.length === 0) {
        this.$modal.msgWarning('请至少为一件产品开票')
        return false
      }
      let temp = 0
      this.form.productList.forEach(item => {
        temp = this.$math.add(item.amount, temp)
      })
      this.form.amount = temp
      return true
    },
    buildTotalAmount() {
      if (this.form.productList.length === 0) {
        return false
      }
      let temp
      this.form.productList.forEach(item => {
        temp = this.$math.add(item.amount, temp)
      })
      this.form.amount = temp
    }
  }
}

</script>
