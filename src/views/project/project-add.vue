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
import { generateCode } from '@/api/config/generate-code'

export default {
  name: 'ProjectAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '',
      saveUrl: '/api/sale/project/save',
      submitUrl: '',
      canSubmit: false,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' }
      ],
      form: {
        projectCode: undefined
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
        javaCodeNameList: []
      }
    }
  },
  async created() {
    await generateCode('PROJECT').then(res => {
      this.form.projectCode = res.data
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '项目编号',
            prop: 'projectCode',
            type: 'input',
            disabled: true
          },
          {
            label: '项目名称',
            prop: 'projectName',
            type: 'input'
          },
          {
            label: '项目日期',
            prop: 'projectDate',
            type: 'date'
          }
        ]
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
