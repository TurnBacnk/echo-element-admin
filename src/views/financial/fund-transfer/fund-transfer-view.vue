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
      :is-view="true"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getJavaCode } from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'
import { getFundTransferById } from '@/api/business/fund-transfer'

export default {
  name: 'FinancialFundTransferAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '资金转账',
      saveUrl: '/api/financial-fund-transfer/update',
      submitUrl: '/financial-fund-transfer/update-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' }
      ],
      form: {
        transferCode: undefined,
        transferFormId: undefined,
        transferFromName: undefined,
        transferToId: undefined,
        transferToName: undefined,
        transferDate: undefined,
        transferUserId: undefined,
        transferUserName: undefined,
        amount: undefined,
        remark: undefined
      },
      rules: {
        baseInfo: {

        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: []
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: []
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['CapitalAccountBuilder', 'UserBuilder']
      }
    }
  },
  async created() {
    await getFundTransferById(this.$route.params.id).then(res => {
      Object.assign(this.form, res.data)
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
            prop: 'transferCode',
            label: '单据编号',
            type: 'input',
            disabled: true
          },
          {
            prop: 'transferDate',
            label: '转账日期',
            type: 'date'
          },
          {
            prop: 'transferFromName',
            label: '转出账户',
            type: 'select',
            options: this.javaCode['CapitalAccountBuilder'],
            bundle: {
              label: 'transferFromName',
              value: 'transferFormId'
            }
          },
          {
            prop: 'transferToName',
            label: '转入账户',
            type: 'select',
            options: this.javaCode['CapitalAccountBuilder'],
            bundle: {
              label: 'transferToName',
              value: 'transferToId'
            }
          },
          {
            prop: 'transferUserName',
            label: '转账人',
            type: 'select',
            options: this.javaCode['UserBuilder'],
            bundle: {
              label: 'transferUserName',
              value: 'transferUserId'
            }
          },
          {
            prop: 'amount',
            label: '金额',
            type: 'inputNumber'
          },
          {
            prop: 'remark',
            label: '备注',
            type: 'textarea'
          }
        ]
      }
      this.showForm = true
    },
    saveFun() {
    }
  }
}

</script>
