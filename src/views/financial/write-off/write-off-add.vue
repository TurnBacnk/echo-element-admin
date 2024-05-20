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
import {getPreOrderByOrderId} from "@/api/business/write-off";

export default {
  name: 'WriteOffAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '核销单登记',
      saveUrl: '/financial-write-off/add',
      submitUrl: '/financial-write-off/save-and-update-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '预收单据', name: 'preReceiveInfo', type: 'table' }
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
        saleOutboundId: undefined,
        saleOutboundCode: undefined,
        preReceiveOrderList: []
      },
      rules: {
        baseInfo: {

        },
        preReceiveInfo: {

        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['WriteOffType']
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
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
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
            prop: 'writeOffUserId',
            type: 'select',
            options: this.constant['UserBuilder']
          },
          {
            label: '本次核销金额',
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
                  row.orderType = this.$route.params.writeOffType === 0 ? 3 : 5
                  row.preReceiveAmount = data.expectedAmount
                  row.alreadyVerificationAmount = data.alreadyVerificationAmount
                  row.unVerificationAmount = data.unVerificationAmount
                  row.orderId = data.orderId
                })
              }
            },
            {
              prop: 'orderType',
              label: '单据类型',
              type: 'selectConstant',
              optionList: this.constant['OrderType'],
              disabled: true
            },
            {
              prop: 'orderTime',
              label: '单据日期',
              type: 'input',
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
          ]
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
