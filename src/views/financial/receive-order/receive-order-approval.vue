<template>
  <div class="app-container">
    <form-table
      ref="table"
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
import { getConstant, getDictionary, getJavaCode } from '@/api/common/dict'
import { getCapitalAccountById } from '@/api/business/capital-account'
import { getSaleOutboundInfoWithReceive } from '@/api/business/sale-outbound'
import { getSaleOrderInfoWithReceiveById } from '@/api/business/sale-order'
import { transform } from '../../../../jest.config'
import { generateCode } from '@/api/config/generate-code'
import fa from 'element-ui/src/locale/lang/fa'
import {
  getReceiveOrderByCode,
  getReceiveOrderById,
  getReceiveOrderReceiveTypeByCode
} from '@/api/business/receive-order'

export default {
  name: 'ReceiveOrderAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '收款单',
      saveUrl: '/api/financial-receive-order/update',
      submitUrl: '/api/financial-receive-order/update-and-submit-single',
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
        receiveUserId: undefined,
        receiveUserName: undefined,
        receiveOrderTime: undefined,
        amount: undefined,
        remark: undefined,
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
        capitalInfo: {}
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
    this.form.receiveType = this.$route.params.receiveType
    this.form.clientId = this.$route.params.clientId
    this.form.clientName = this.$route.params.clientName
    await this.buildTable(this.form.receiveType, this.form.clientId)
    await getReceiveOrderReceiveTypeByCode(this.$route.params.code).then(res => {
      this.receiveType = res.data
    })
    await getReceiveOrderByCode(this.$route.params.code, this.receiveType).then(res => {
      Object.assign(this.form, res.data)
      this.form.instanceId = this.$route.params.instanceId
    })
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
            label: '客户',
            prop: 'clientId',
            type: 'select',
            bundle: {
              label: 'clientName',
              value: 'clientId'
            },
            options: this.javaCode['CustomerBuilder'],
            disabled: this.clientDisabled
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
                  const {data} = res
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
              type: 'textarea'
            }
          ],
          showSummary: true,
          totalColumns: ['receiveAmount'],
          showButton: false
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
    async buildTable(receiveType, clientId) {
      // 0.应收收款 value === 0
      if (receiveType === 0) {
        // 处理表单
        this.$refs.table.activeNames = []
        this.collapseConfig = [
          {active: true, title: '基本信息', name: 'baseInfo', type: 'form'},
          {active: true, title: '应收单据', name: 'receivableInfo', type: 'table'},
          {active: true, title: '本次收款', name: 'capitalInfo', type: 'table'}
        ]
        this.collapseConfig.forEach((value) => {
          if (value.active) {
            this.$refs.table.activeNames.push(value.name)
          }
        })
        // 处理规则
        this.rules.receivableInfo = {
          amount: [
            {required: true, message: '请输入本次收款金额', trigger: 'blur'},
            {type: 'number', message: '请输入纯数字', trigger: 'change', transform: (value) => Number(value)}
          ]
        }
        this.rules.orderReceiveInfoList = {}
        this.rules.preReceiveInfo = {}
        await this.init()
      }
      // 1.订单收款 value === 1
      if (receiveType === 1) {
        this.collapseConfig = [
          {active: true, title: '基本信息', name: 'baseInfo', type: 'form'},
          {active: true, title: '销售订单', name: 'orderReceiveInfoList', type: 'table'},
          {active: true, title: '本次收款', name: 'capitalInfo', type: 'table'}
        ]
        this.collapseConfig.forEach((value) => {
          if (value.active) {
            this.$refs.table.activeNames.push(value.name)
          }
        })
        this.rules.orderReceiveInfoList = {
          amount: [
            {required: true, message: '请输入本次收款金额', trigger: 'blur'},
            {type: 'number', message: '请输入纯数字', trigger: 'change', transform: (value) => Number(value)}
          ]
        }
        this.rules.receivableInfo = {}
        this.rules.preReceiveInfo = {}
        await this.init()
      }
      // 2.预收 value === 2
      if (receiveType === 2) {
        this.collapseConfig = [
          {active: true, title: '基本信息', name: 'baseInfo', type: 'form'},
          {active: true, title: '本次收款', name: 'capitalInfo', type: 'table'}
        ]
        this.clientDisabled = false
        this.rules.orderReceiveInfoList = {}
        this.rules.receivableInfo = {}
        this.rules.preReceiveInfo = {}
        this.init()
      }
      // 3.预售退回 === 3
      if (receiveType === 3) {
        this.collapseConfig = [
          {active: true, title: '基本信息', name: 'baseInfo', type: 'form'},
          {active: true, title: '预收单据', name: 'preReceiveInfo', type: 'table'},
          {active: true, title: '本次收款', name: 'capitalInfo', type: 'table'}
        ]
        this.collapseConfig.forEach((value) => {
          if (value.active) {
            this.$refs.table.activeNames.push(value.name)
          }
        })
        this.rules.preReceiveInfo = {
          amount: [
            {required: true, message: '请输入本次退款金额', trigger: 'blur'},
            {type: 'number', message: '请输入纯数字', trigger: 'change'}
          ]
        }
        this.rules.orderReceiveInfoList = {}
        this.rules.receivableInfo = {}
      }
    }
  }
}

</script>
