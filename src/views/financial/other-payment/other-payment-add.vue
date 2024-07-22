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
import { generateCode } from '@/api/config/generate-code'

export default {
  name: 'OtherPaymentAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '其他支出登记',
      saveUrl: '/api/financial-other-payment/save',
      submitUrl: '/api/financial-other-payment/save-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '收款信息', name: 'amountInfo', type: 'table' }
      ],
      form: {
        otherPaymentCode: undefined,
        objType: undefined,
        objId: undefined,
        objName: undefined,
        paymentTime: undefined,
        paymentUserId: undefined,
        paymentUserName: undefined,
        capitalAccountId: undefined,
        capitalAccountName: undefined,
        amount: undefined,
        otherPaymentItemList: []
      },
      rules: {
        baseInfo: {

        },
        amountInfo: {

        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['ObjType']
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['PaymentType']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['UserBuilder', 'CapitalAccountBuilder', 'VendorBuilder', 'CustomerBuilder']
      },
      objList: []
    }
  },
  watch: {
    'form.objType': {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          this.objList = this.javaCode['VendorBuilder']
        } else if (newVal === 1) {
          this.objList = this.javaCode['CustomerBuilder']
        } else {
          this.objList = []
        }
        this.init()
      },
      deep: true
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
    await generateCode('QTZC').then(res => {
      this.form.otherPaymentCode = res.data
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            prop: 'otherPaymentCode',
            label: '单据编号',
            type: 'input',
            disabled: true
          },
          {
            prop: 'objType',
            label: '往来单位',
            type: 'select',
            options: this.constant['ObjType']
          },
          {
            prop: 'objId',
            label: '名称',
            type: 'select',
            options: this.objList,
            bundle: {
              label: 'objName',
              value: 'objId'
            }
          },
          {
            prop: 'paymentTime',
            label: '收款日期',
            type: 'date'
          },
          {
            prop: 'paymentUserId',
            label: '收款人',
            type: 'select',
            options: this.javaCode['UserBuilder'],
            bundle: {
              label: 'paymentUserName',
              value: 'paymentUserId'
            }
          },
          {
            prop: 'capitalAccountId',
            label: '资金账户',
            type: 'select',
            options: this.javaCode['CapitalAccountBuilder'],
            bundle: {
              label: 'capitalAccountName',
              value: 'capitalAccountId'
            }
          }
        ],
        amountInfo: {
          prop: 'otherPaymentItemList',
          column: [
            {
              prop: 'paymentType',
              label: '收款类型',
              type: 'selectConstant',
              optionList: this.dictionary['PaymentType']
            },
            {
              prop: 'amount',
              label: '金额',
              type: 'input'
            },
            {
              prop: 'remark',
              label: '备注',
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
      if (this.form.otherPaymentItemList.length === 0) {
        this.$modal.msgWarning('请至少添加一条付款记录')
        return false
      }
      let temp = 0
      this.form.otherPaymentItemList.forEach(item => {
        temp = this.$math.add(temp, item.amount)
      })
      this.form.amount = temp
      return true
    }
  }
}

</script>
