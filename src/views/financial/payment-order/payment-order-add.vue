<template>
  <div class="app-container">
    <form-table
      v-if="showForm"
      ref="tableList"
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
import { getCapitalAccountById } from '@/api/business/capital-account'
import { getConstant, getDictionary, getJavaCode } from '@/api/common/dict'
import { getInboundOrderByIdForPayment } from '@/api/business/inbound'
import { getBuyOrderByIdForPayment } from '@/api/business/order'
import { getPrePaymentOrderById } from '@/api/business/payment-order'
import { generateCode } from '@/api/config/generate-code'
import {getOrderInfoById} from "@/api/business/order-info";

export default {
  name: 'PaymentOrderAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '付款单登记',
      saveUrl: '/api/financial-payment-order/save',
      submitUrl: '/api/financial-payment-order/save-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
      ],
      form: {
        paymentOrderCode: undefined,
        vendorId: undefined,
        vendorName: undefined,
        paymentType: undefined,
        payUserId: this.$store.state.user.id,
        payUserName: this.$store.state.user.name,
        payTime: new Date(),
        amount: undefined,
        inboundOrderId: undefined,
        buyOrderId: undefined,
        prePaymentOrderId: undefined,
        orderPaymentInfoList: [],
        payableInfoList: [],
        paymentAccountList: [],
        prePaymentReturnInfoList: []
      },
      rules: {
        baseInfo: {
          paymentOrderCode: [{ required: true, message: '请输入付款单编号', trigger: 'blur' }]
        },
        capitalInfo: {
        },
        orderPaymentInfoList: {},
        payableInfoList: {},
        prePaymentReturnInfoList: {}
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['PaymentType', 'OrderType']
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['SettlementType']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CapitalAccountBuilder', 'VendorBuilder']
      },
      vendorDisabled: true
    }
  },
  async created() {
    await generateCode('PAYMENT').then(res => {
      this.form.paymentOrderCode = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await this.init()
    this.form.vendorId = this.$route.params.vendorId
    this.form.vendorName = this.$route.params.vendorName
    this.form.paymentType = this.$route.params.paymentType
    this.form.inboundOrderId = this.$route.params.orderId
    await this.buildTable(this.$route.params.paymentType)
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '付款单编号',
            prop: 'paymentOrderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '付款类型',
            prop: 'paymentType',
            type: 'select',
            options: this.constant['PaymentType'],
            disabled: true
          },
          {
            label: '付款人',
            prop: 'payUserName',
            type: 'input'
          },
          {
            label: '付款时间',
            prop: 'payTime',
            type: 'date'
          }
        ],
        capitalInfo: {
          prop: 'paymentAccountList',
          column: [
            {
              prop: 'capitalAccountName',
              type: 'select',
              label: '资金账户',
              optionList: this.javaCode['CapitalAccountBuilder'],
              click: (event, row) => {
                getCapitalAccountById(event).then(res => {
                  const { data } = res
                  row.capialAccountId = data.id
                  row.capitalAccountName = data.capitalAccountName
                  row.capitalAccountCode = data.capitalAccountCode
                  row.capitalAccountSettlementType = data.capitalAccountSettlementType
                })
              }
            },
            {
              prop: 'capitalAccountSettlementType',
              label: '结算类型',
              type: 'selectConstant',
              optionList: this.dictionary['SettlementType'],
              disabled: true
            },
            {
              prop: 'paymentAmount',
              label: '本次收款金额',
              type: 'input'
            },
            {
              prop: 'remark',
              label: '备注',
              type: 'input'
            }
          ],
          showSummary: true,
          totalColumns: ['paymentAmount'],
          showButton: true
        },
        payableInfoList: {
          prop: 'payableInfoList',
          column: [
            {
              prop: 'orderCode',
              label: '采购入库单号',
              type: 'input',
              disabled: true
            },
            {
              prop: 'orderType',
              label: '单据类型',
              type: 'selectConstant',
              optionList: this.constant['OrderType'],
              disabled: true
            },
            {
              prop: 'expectedAmount',
              label: '应付金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'alreadyAmount',
              label: '已付金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'unAmount',
              label: '未付金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'amount',
              label: '本次付款',
              type: 'input'
            }
          ],
          showSummary: true,
          totalColumns: ['amount'],
          showButton: true
        },
        orderPaymentInfoList: {
          prop: 'orderPaymentInfoList',
          column: [
            {
              prop: 'orderCode',
              label: '采购入库单号',
              type: 'input',
              disabled: true
            },
            {
              prop: 'orderType',
              label: '单据类型',
              type: 'selectConstant',
              optionList: this.constant['OrderType'],
              disabled: true
            },
            {
              prop: 'expectedAmount',
              label: '应付金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'alreadyAmount',
              label: '已付金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'unAmount',
              label: '未付金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'amount',
              label: '本次付款',
              type: 'input'
            }
          ],
          showSummary: true,
          totalColumns: ['amount'],
          showButton: true
        }
      }
      this.showForm = true
    },
    buildInbound() {
      this.$refs.tableList.activeNames = []
      this.collapseConfig = [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '应付单据', name: 'payableInfoList', type: 'table' },
        { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
      ]
      this.collapseConfig.forEach((value) => {
        if (value.active) {
          this.$refs.tableList.activeNames.push(value.name)
        }
      })
      this.rules.payableInfoList = {
        paymentAmount: [
          { required: true, message: '请输入本次收款金额', trigger: 'blur' },
          { type: 'number', message: '请输入纯数字', trigger: 'change', transform: (value) => Number(value) }
        ]
      }
      this.rules.orderPaymentInfoList = {}
      this.rules.prePaymentReturnInfoList = {}
    },
    buildOrder() {
      // 订单付款
      this.form.buyOrderId = this.$route.params.orderId
      this.$refs.tableList.activeNames = []
      this.collapseConfig = [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '订单单据', name: 'orderPaymentInfoList', type: 'table' },
        { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
      ]
      this.collapseConfig.forEach((value) => {
        if (value.active) {
          this.$refs.tableList.activeNames.push(value.name)
        }
      })
      this.rules.orderPaymentInfoList = {
        paymentAmount: [
          { required: true, message: '请输入本次收款金额', trigger: 'blur' },
          { type: 'number', message: '请输入纯数字', trigger: 'change', transform: (value) => Number(value) }
        ]
      }
      this.rules.payableInfoList = {}
      this.rules.prePaymentReturnInfoList = {}
    },
    buildPrePaymentReturn() {
      this.form.prePaymentOrderId = this.$route.params.orderId
      this.$refs.tableList.activeNames = []
      this.collapseConfig = [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '预付单据', name: 'prePaymentReturnInfoList', type: 'form' },
        { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
      ]
      this.collapseConfig.forEach((value) => {
        if (value.active) {
          this.$refs.tableList.activeNames.push(value.name)
        }
      })
      this.rules.prePaymentReturnInfoList = {
        paymentAmount: [
          { required: true, message: '请输入本次收款金额', trigger: 'blur' },
          { type: 'number', message: '请输入纯数字', trigger: 'change', transform: (value) => Number(value) }
        ]
      }
      this.rules.orderPaymentInfoList = {}
      this.rules.payableInfoList = {}
    },
    buildPrePayment() {
      this.$refs.tableList.activeNames = []
      this.collapseConfig = [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
      ]
      this.collapseConfig.forEach((value) => {
        if (value.active) {
          this.$refs.tableList.activeNames.push(value.name)
        }
      })
      this.vendorDisabled = false
      this.rules.payableInfoList = {}
      this.rules.prePaymentReturnInfoList = {}
      this.rules.orderPaymentInfoList = {}
    },
    async buildTable() {
      let obj
      await getOrderInfoById(this.$route.params.id, this.$route.params.orderType).then(res => {
        obj = res.data
      })
      const paymentType = this.$route.params.paymentType
      Object.assign(this.form, this.$route.params)
      if (paymentType === 0) {
        // 应付
        this.form.payableInfoList.push(obj)
        this.buildInbound()
      }
      if (paymentType === 1) {
        this.form.orderPaymentInfoList.push(obj)
        this.buildOrder()
      }
      if (paymentType === 2) {
        this.buildPrePayment()
      }
      if (paymentType === 3) {
        this.form.prePaymentReturnInfoList.push(obj)
        this.buildPrePaymentReturn()
      }
    },
    saveFun() {
      if (this.form.paymentAccountList.length === 0) {
        this.$modal.msgWarning('请至少选择一个收款账户')
        return false
      }
      let accountAmount = 0
      this.form.paymentAccountList.forEach(item => {
        accountAmount = this.$math.add(item.paymentAmount, accountAmount)
      })
      if (this.form.paymentType === 0) {
        // 应付
        if (this.form.payableInfoList.length === 0) {
          this.$modal.msgWarning('请至少选择一个应付单据')
          return false
        }
        let temp = 0
        this.form.payableInfoList.forEach(item => {
          temp = this.$math.add(item.amount, temp)
        })
        if (accountAmount !== temp) {
          this.$modal.msgWarning('单据付款金额与账户付款金额不一致')
          return false
        }
      }
      if (this.form.paymentType === 1) {
        // 订单付款
        if (this.form.orderPaymentInfoList.length === 0) {
          this.$modal.msgWarning('请至少选择一个采购单据')
          return false
        }
        let temp = 0
        this.form.orderPaymentInfoList.forEach(item => {
          temp = this.$math.add(item.amount, temp)
        })
        if (accountAmount !== temp) {
          this.$modal.msgWarning('单据付款金额与账户付款金额不一致')
          return false
        }
      }
      if (this.form.paymentType === 3) {
        if (this.form.prePaymentReturnInfoList.length === 0) {
          this.$modal.msgWarning('请至少选择一个预付单据')
          return false
        }
        let temp = 0
        this.form.prePaymentReturnInfoList.forEach(item => {
          temp = this.$math.add(item.amount, temp)
        })
        if (accountAmount !== temp) {
          this.$modal.msgWarning('单据付款金额与账户付款金额不一致')
          return false
        }
      }
      this.form.amount = accountAmount
      return true
    }
  }
}

</script>
