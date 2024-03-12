<template>
  <div class="app-container">
    <form-table
      :save-url="saveUrl"
      submit-url=""
      :form="form"
      :collapse-item-config="collapseItemConfig"
      :collapse-config="collapseConfig"
      :content-text="contentText"
      :rules="rules"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getConstant } from '@/api/common/dict'

export default {
  name: 'GenerateCodeAdd',
  components: { FormTable },
  data() {
    return {
      saveUrl: '/api/generate-code/save',
      form: {
        businessKey: undefined,
        tableName: undefined,
        tableCode: undefined,
        status: undefined,
        withDate: undefined,
        length: undefined
      },
      collapseItemConfig: {},
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' }
      ],
      contentText: '生成规则配置',
      constant: [],
      constantConfig: {
        constantNameList: ['Enable', 'YesOrNo']
      },
      rules: {
        baseInfo: {
          businessKey: [{required: true, message: '不能为空', trigger: 'blur'}],
          tableName: [{required: true, message: '不能为空', trigger: 'blur'}],
          tableCode: [{required: true, message: '不能为空', trigger: 'blur'}],
          status: [{required: true, message: '不能为空', trigger: 'change'}],
          withDate: [{required: true, message: '不能为空', trigger: 'change'}],
          length: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {type: 'number', message: '必须为数字值', trigger: 'blur'}
          ]
        }
      }
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '业务标识',
            prop: 'businessKey',
            type: 'input'
          },
          {
            label: '数据表名',
            prop: 'tableName',
            type: 'input'
          },
          {
            label: '数据表字段',
            prop: 'tableCode',
            type: 'input'
          },
          {
            label: '状态',
            prop: 'status',
            type: 'select',
            options: this.constant['Enable']
          },
          {
            label: '是否包含日期',
            prop: 'withDate',
            type: 'select',
            options: this.constant['YesOrNo']
          },
          {
            label: '编码长度',
            prop: 'length',
            type: 'number'
          }
        ]
      }
    }
  },
}

</script>
