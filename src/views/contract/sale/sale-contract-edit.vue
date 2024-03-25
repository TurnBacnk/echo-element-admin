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
      v-if="showForm"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'

export default {
  name: 'DictAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '',
      saveUrl: '',
      submitUrl: '',
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' }
      ],
      form: {

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
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '',
            prop: '',
            type: 'input'
          },
          {
            label: '',
            prop: '',
            type: 'select',
            options: []
          }
        ]
      }
      this.showForm = true
    }
  }
}

</script>
