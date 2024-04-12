<template>
  <div class="app-container">
    <form-table
      :content-text="contentText"
      :collapse-config="collapseConfig"
      :collapse-item-config="collapseItemConfig"
      :save-url="saveUrl"
      :submit-url="submitUrl"
      :form="form"
      :rules="rules"
      :can-submit="canSubmit"
      v-if="showForm"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getJavaCode } from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'

export default {
  name: 'SaleContractEdit',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '销售合同修改',
      saveUrl: '/api/sale-contract/update',
      submitUrl: '/api/sale-contract/submit',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' }
      ],
      form: {
        contractNo: undefined,
        contractCode: undefined,
        contractName: undefined,
        contractSignUserName: undefined,
        contractSignUserId: undefined,
        customerName: undefined,
        customerId: undefined,
        signDateTime: undefined,
        contractAmount: undefined
      },
      rules: {
        baseInfo: {
          contractNo: [
            { required: true, message: '请输入合同编号', trigger: 'blur' }
          ],
          contractName: [
            { required: true, message: '请输入合同名称', trigger: 'blur' }
          ],
          contractSignUserId: [
            { required: true, message: '请选择签署人', trigger: 'change' }
          ],
          signDate: [
            { required: true, message: '请选择签署日期', trigger: 'change' }
          ]
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
        javaCodeNameList: ['UserBuilder', 'CustomerBuilder']
      }
    }
  },
  async created() {
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await generateCode('SALE-CONTRACT').then(res => {
      this.form.contractNo = res.data
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '合同编号',
            prop: 'contractNo',
            type: 'input',
            disabled: true
          },
          {
            label: '合同号',
            prop: 'contractCode',
            type: 'input'
          },
          {
            label: '合同名称',
            prop: 'contractName',
            type: 'input'
          },
          {
            label: '合同签署人',
            prop: 'contractSignUserId',
            type: 'select',
            options: this.javaCode['UserBuilder'],
            bundle: {
              label: 'contractSignUserName',
              value: 'contractSignUserId'
            }
          },
          {
            label: '客户',
            prop: 'customerId',
            type: 'select',
            options: this.javaCode['CustomerBuilder'],
            bundle: {
              label: 'customerName',
              value: 'customerId'
            }
          },
          {
            label: '合同签署日期',
            prop: 'signDateTime',
            type: 'date'
          },
          {
            label: '合同额',
            prop: 'contractAmount',
            type: 'input'
          }
        ]
      }
      this.showForm = true
    }
  }
}

</script>
