<template>
  <div class="app-container">
    <form-table
      v-if="showForm"
      ref="table"
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
import { getCapitalAccountById } from '@/api/business/capital-account'
import { transform } from '../../../../jest.config'
import { generateCode } from '@/api/config/generate-code'
import { getOrderInfoById } from '@/api/business/order-info'

export default {
  name: 'ReceiveOrderAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '收款单登记',
      saveUrl: '/api/financial-receive-order/save',
      submitUrl: '/api/financial-receive-order/save-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
      ],
      form: {
        receiveOrderCode: undefined,
        clientId: undefined,
        clientName: undefined,
        receiveType: 2,
        receiveUserId: this.$store.state.user.id,
        receiveUserName: this.$store.state.user.name,
        receiveOrderTime: new Date(),
        amount: undefined,
        remark: undefined,
        saleOutboundId: undefined,
        saleOutboundCode: undefined,
        saleOrderId: undefined,
        saleOrderCode: undefined,
        preReceiveOrderId: undefined,
        preReceiveOrderCode: undefined,
        orderReceiveInfoList: [],
        receivableInfoList: [],
        receiveAccountList: [],
        preReceiveReturnList: []
      },
      rules: {
        baseInfo: {},
        orderReceiveInfoList: {},
        receivableInfo: {},
        preReceiveInfo: {},
        capitalInfo: {
          amount: [
            { type: 'number', message: '请输入纯数字', trigger: 'change', transform: (value) => Number(value) }
          ]
        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['ReceiveType', 'OrderType']
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['SettlementType']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CapitalAccountBuilder', 'CustomerBuilder', 'UserBuilder']
      },
      saleOutboundOrderList: [],
      saleOrderList: [],
      preReceiveInfoList: [],
      clientDisabled: true
    }
  },
  async created() {
    await generateCode('YS').then(res => {
      this.form.receiveOrderCode = res.data
    })
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await this.init()
    await this.buildTable()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '收款单编码',
            prop: 'receiveOrderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '收款类型',
            prop: 'receiveType',
            type: 'select',
            options: this.constant['ReceiveType'],
            disabled: true
          },
          {
            label: '收款人',
            prop: 'receiveUserId',
            type: 'select',
            options: this.javaCode['UserBuilder'],
            bundle: {
              label: 'receiveUserName',
              value: 'receiveUserId'
            }
          },
          {
            label: '收款日期',
            prop: 'receiveOrderTime',
            type: 'date'
          }
        ],
        capitalInfo: {
          prop: 'receiveAccountList',
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
              prop: 'receiveAmount',
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
          totalColumns: ['receiveAmount'],
          showButton: true
        },
        receivableInfo: {
          prop: 'receivableInfoList',
          column: [
            {
              prop: 'orderCode',
              type: 'input',
              label: '单据编号',
              width: '300px',
              disabled: true
            },
            {
              prop: 'orderType',
              label: '单据类型',
              type: 'selectConstant',
              disabled: true,
              optionList: this.constant['OrderType']
            },
            {
              prop: 'alreadyAmount',
              label: '已收金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'unAmount',
              label: '未收金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'amount',
              label: '本次收款金额',
              type: 'input'
            }
          ],
          showSummary: true,
          totalColumns: ['amount'],
          showButton: false
        },
        orderReceiveInfoList: {
          prop: 'orderReceiveInfoList',
          column: [
            {
              prop: 'orderCode',
              type: 'input',
              label: '单据编号',
              width: '300px',
              disabled: true
            },
            {
              prop: 'orderType',
              label: '单据类型',
              type: 'selectConstant',
              disabled: true,
              optionList: this.constant['OrderType']
            },
            {
              prop: 'alreadyAmount',
              label: '已收金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'unAmount',
              label: '未收金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'amount',
              label: '本次收款金额',
              type: 'input'
            }
          ],
          showSummary: true,
          totalColumns: ['amount'],
          showButton: true
        },
        preReceiveInfo: {
          prop: 'preReceiveReturnList',
          column: [
            {
              prop: 'orderCode',
              label: '预收单据编号',
              type: 'select',
              optionsList: this.preReceiveInfoList,
              click: (event, row) => {

              }
            },
            {
              prop: 'orderType',
              label: '收款类别',
              type: 'selectConstant',
              optionsList: this.constant['OrderType'],
              disabled: true
            },
            {
              prop: 'orderTime',
              type: 'date',
              label: '预收日期',
              disabled: true
            },
            {
              prop: 'expectedAmount',
              label: '预收金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'alreadyAmount',
              label: '预收余额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'alreadyVerificationAmount',
              label: '已核销金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'unVerificationAmount',
              label: '未核销金额',
              type: 'input',
              disabled: true
            },
            {
              prop: 'amount',
              label: '本次退回金额',
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
    saveFun() {
      if (this.form.receiveAccountList.length === 0) {
        this.$modal.msgWarning('请至少选择一个资金账户')
        return false
      }

      let accountAmount = 0
      this.form.receiveAccountList.forEach(item => {
        accountAmount = this.$math.add(item.receiveAmount, accountAmount)
      })

      if (this.form.receiveType === 0) {
        // 应收收款
        if (this.form.receivableInfoList.length === 0) {
          this.$modal.msgWarning('请至少选择一个应收单据')
          return false
        }
        let temp = 0
        this.form.receivableInfoList.forEach(item => {
          temp = this.$math.add(item.amount, temp)
        })
        if (accountAmount !== temp) {
          this.$modal.msgWarning('单据收款金额与账户收款金额不一致')
          return false
        }
      }
      if (this.form.receiveType === 1) {
        if (this.form.orderReceiveInfoList.length === 0) {
          this.$modal.msgWarning('请至少选择一个销售单据')
          return false
        }
        let temp = 0
        this.form.orderReceiveInfoList.forEach(item => {
          temp = this.$math.add(item.amount, temp)
        })
        if (accountAmount !== temp) {
          this.$modal.msgWarning('单据收款金额与账户收款金额不一致')
          return false
        }
      }
      if (this.form.receiveType === 3) {
        if (this.form.preReceiveReturnList.length === 0) {
          this.$modal.msgWarning('请至少选择一个预收单据')
          return false
        }
        let temp = 0
        this.form.preReceiveReturnList.forEach(item => {
          temp = this.$math.add(item.amount, temp)
        })
        if (accountAmount !== temp) {
          this.$modal.msgWarning('单据收款金额与账户收款金额不一致')
          return false
        }
      }
      this.form.amount = accountAmount
      return true
    },
    buildReceiveInfo() {
      // 处理表单
      this.$refs.table.activeNames = []
      this.collapseConfig = [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '应收单据', name: 'receivableInfo', type: 'table' },
        { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
      ]
      this.collapseConfig.forEach((value) => {
        if (value.active) {
          this.$refs.table.activeNames.push(value.name)
        }
      })
      // 处理规则
      this.rules.receivableInfo = {
        amount: [
          { required: true, message: '请输入本次收款金额', trigger: 'blur' },
          { type: 'number', message: '请输入纯数字', trigger: 'change', transform: (value) => Number(value) }
        ]
      }
      this.rules.orderReceiveInfoList = {}
      this.rules.preReceiveInfo = {}
    },
    buildOrderReceive() {
      this.collapseConfig = [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '销售订单', name: 'orderReceiveInfoList', type: 'table' },
        { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
      ]
      this.collapseConfig.forEach((value) => {
        if (value.active) {
          this.$refs.table.activeNames.push(value.name)
        }
      })
      this.rules.orderReceiveInfoList = {
        amount: [
          { required: true, message: '请输入本次收款金额', trigger: 'blur' },
          { type: 'number', message: '请输入纯数字', trigger: 'change', transform: (value) => Number(value) }
        ]
      }
      this.rules.receivableInfo = {}
      this.rules.preReceiveInfo = {}
    },
    buildPreReceiveReturn() {
      this.collapseConfig = [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '预收单据', name: 'preReceiveInfo', type: 'table' },
        { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
      ]
      this.collapseConfig.forEach((value) => {
        if (value.active) {
          this.$refs.table.activeNames.push(value.name)
        }
      })
      this.rules.preReceiveInfo = {
        amount: [
          { required: true, message: '请输入本次退款金额', trigger: 'blur' },
          { type: 'number', message: '请输入纯数字', trigger: 'change' }
        ]
      }
      this.rules.orderReceiveInfoList = {}
      this.rules.receivableInfo = {}
    },
    buildPreReceive() {
      this.collapseConfig = [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
      ]
      this.clientDisabled = false
      this.rules.orderReceiveInfoList = {}
      this.rules.receivableInfo = {}
      this.rules.preReceiveInfo = {}
    },
    async buildTable() {
      let obj
      await getOrderInfoById(this.$route.params.id, this.$route.params.orderType).then(res => {
        obj = res.data
      })
      const receiveType = this.$route.params.receiveType
      Object.assign(this.form, this.$route.params)
      this.form.receiveType = this.$route.params.receiveType
      // 0.应收收款 value === 0
      if (receiveType === 0) {
        this.buildReceiveInfo()
        // 处理单据列表
        this.form.receivableInfoList.push(obj)
        return
      }
      // 1.订单收款 value === 1
      if (receiveType === 1) {
        this.buildOrderReceive()
        this.form.orderReceiveInfoList.push(obj)
        return
      }
      // 2.预收 value === 2
      if (receiveType === 2) {
        this.buildPreReceive()
        this.init()
        return
      }
      // 3.预售退回 === 3
      if (receiveType === 3) {
        this.buildPreReceiveReturn()
        this.form.preReceiveReturnList.push(obj)
      }
    }
  }
}

</script>
