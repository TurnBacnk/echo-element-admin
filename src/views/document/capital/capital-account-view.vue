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
import { getDictionary } from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'
import { getCapitalAccountById } from '@/api/business/capital-account'

export default {
  name: 'DictAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '资金账户查看',
      saveUrl: '/api/capital-account/update',
      submitUrl: '',
      canSubmit: false,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' }
      ],
      form: {
        capitalAccountCode: undefined,
        capitalAccountName: undefined,
        capitalAccountSettlementType: undefined,
        accountBalance: 0
      },
      rules: {
        baseInfo: {
          capitalAccountCode: [{ required: true, message: '请输入账户编码', trigger: 'blur' }],
          capitalAccountName: [{ required: true, message: '请输入账户名称', trigger: 'blur' }],
          capitalAccountSettlementType: [{ required: true, message: '请选择结算类型', trigger: 'blur' }],
          accountBalance: [{ required: true, message: '请输入账户余额', trigger: 'blur' }]
        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: []
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['SettlementType']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: []
      }
    }
  },
  async created() {
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await getCapitalAccountById(this.$route.params.id).then(res => {
      Object.assign(this.form, res.data)
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '账户编号',
            prop: 'capitalAccountCode',
            type: 'input',
            disabled: true
          },
          {
            label: '账户名称',
            prop: 'capitalAccountName',
            type: 'input'
          },
          {
            label: '结算类型',
            prop: 'capitalAccountSettlementType',
            type: 'select',
            options: this.dictionary['SettlementType']
          },
          {
            label: '账户余额',
            prop: 'accountBalance',
            type: 'inputNumber'
          }
        ]
      }
      this.showForm = true
    }
  }
}

</script>
