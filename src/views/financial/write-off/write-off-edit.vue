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
import {getConstant, getJavaCode} from "@/api/common/dict";
import { getPreOrderByOrderId, getPreOrderListByClientIdAndOrderType, getWriteOffById } from '@/api/business/write-off'
import { generateCode } from '@/api/config/generate-code'
import { getOrderInfoByOrderId } from '@/api/business/order-info'

export default {
  name: 'WriteOffAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '核销单登记',
      saveUrl: '/api/financial-write-off/update ',
      submitUrl: '/api/financial-write-off/update-and-update-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: this.writeOffType === 0 ? '预收单据' : '预付单据', name: 'preReceiveInfo', type: 'table' }
      ],
      form: {
        writeOffCode: undefined,
        writeOffType: undefined,
        clientId: undefined,
        vendorId: undefined,
        clientName: undefined,
        vendorName: undefined,
        writeOffTime: undefined,
        writeUserId: undefined,
        writeUserName: undefined,
        amount: undefined,
        orderId: undefined,
        orderCode: undefined,
        expectedAmount: undefined,
        alreadyAmount: undefined,
        unAmount: undefined,
        preReceiveOrderList: []
      },
      rules: {
        baseInfo: {

        },
        preReceiveInfo: {
          amount: [
            { required: true, message: '请输入金额', trigger: 'blur' }
          ]
        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['WriteOffType', 'OrderType']
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: []
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CustomerBuilder', 'UserBuilder']
      },
      writeOffType: this.$route.params.writeOffType,
      orderList: []
    }
  },
  async created() {
    await getWriteOffById(this.$route.params.id).then(res => {
      const { data } = res
      Object.assign(this.form, data)
      this.writeOffType = this.form.writeOffType
    })
    await getOrderInfoByOrderId(this.form.orderId).then(res => {
      const { data } = res
      this.form.orderId = data.orderId
      this.form.orderCode = data.orderCode
      this.form.expectedAmount = data.expectedAmount
      this.form.alreadyAmount = data.alreadyAmount
      this.form.unAmount = data.unAmount
    })
    await getPreOrderListByClientIdAndOrderType(this.writeOffType === 0 ? this.form.clientId : this.form.vendorId, this.writeOffType === 0 ? 2 : 5).then(res => {
      this.orderList = res.data
    })
    await generateCode('VERIFICATION').then(res => {
      this.form.writeOffCode = res.data
    })
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await this.init()
    this.collapseConfig =  [
      { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
      { active: true, title: this.writeOffType === 0 ? '预收单据' : '预付单据', name: 'preReceiveInfo', type: 'table' }
    ]
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '核销单编号',
            prop: 'writeOffCode',
            type: 'input',
            disabled: true
          },
          {
            label: '核销类型',
            prop: 'writeOffType',
            type: 'select',
            options: this.constant['WriteOffType']
          },
          {
            label: '核销时间',
            prop: 'writeOffTime',
            type: 'date'
          },
          {
            label: this.writeOffType === 0 ? '客户' : '供应商',
            prop: this.writeOffType === 0 ? 'clientId' : 'vendorId',
            type: 'select',
            options: this.writeOffType === 0 ? this.javaCode['CustomerBuilder'] : this.javaCode['VendorBuilder']
          },
          {
            label: '核销人',
            prop: 'writeUserId',
            type: 'select',
            options: this.javaCode['UserBuilder']
          },
          {
            label: '销售出库单',
            prop: 'orderCode',
            type: 'input',
            disabled: true
          },
          {
            label: this.writeOffType === 0 ? '应收金额' : '应付金额',
            prop: 'expectedAmount',
            type: 'input',
            disabled: true
          },
          {
            label: this.writeOffType === 0 ? '已收金额' : '已付金额',
            prop: 'alreadyAmount',
            type: 'input',
            disabled: true
          },
          {
            label: this.writeOffType === 0 ? '未收金额' : '未付金额',
            prop: 'unAmount',
            type: 'input',
            disabled: true
          },
          {
            label: '应付金额',
            prop: 'amount',
            type: 'inputNumber'
          }
        ],
        preReceiveInfo: {
          prop: 'preReceiveOrderList',
          column: [
            {
              prop: 'orderCode',
              label: '单据编号',
              type: 'select',
              optionList: this.orderList,
              click: (event, row) => {
                getPreOrderByOrderId(event).then(res => {
                  const { data } = res
                  row.orderCode = data.orderCode
                  row.orderType = this.$route.params.writeOffType === 0 ? 2 : 5
                  row.orderTime =
                    row.preReceiveAmount = data.expectedAmount
                  row.alreadyVerificationAmount = data.alreadyVerificationAmount
                  row.unVerificationAmount = data.unVerificationAmount
                  row.orderId = data.orderId
                })
              },
              width: '250px'
            },
            {
              prop: 'orderType',
              label: '单据类型',
              type: 'selectConstant',
              optionList: this.constant['OrderType'],
              disabled: true
            },
            {
              prop: this.writeOffType === 0 ? 'preReceiveAmount' : 'prePayableAmount',
              label: this.writeOffType === 0 ? '预收金额' : '预付金额',
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
              label: '本次核销金额',
              type: 'input'
            }
          ],
          showButton: true,
          showSummary: true,
          totalColumns: ['amount']
        }
      }
      this.showForm = true
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
