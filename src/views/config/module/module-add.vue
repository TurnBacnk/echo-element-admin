<template>
  <div class="app-container">
    <form-table
      :save-url="saveUrl"
      :submit-url="submitUrl"
      :collapse-config="collapseConfig"
      :collapse-item-config="collapseItemConfig"
      :content-text="contentText"
      :form="form"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getConstant } from '@/api/common/dict'

export default {
  name: 'ModuleAdd',
  components: { FormTable },
  data() {
    return {
      saveUrl: '/api/module/save',
      submitUrl: '/api/module/submit',
      collapseConfig: [
        {
          active: true,
          title: '基本信息',
          name: 'baseInfo',
          type: 'form'
        }
      ],
      collapseItemConfig: {},
      contentText: '模块注册',
      form: {
        businessModuleName: '',
        businessModuleKey: '',
        orderNo: undefined,
        status: undefined
      },
      constant: [],
      constantConfig: {
        constantNameList: ['Enable']
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
            label: '业务模块名称',
            prop: 'businessModuleName',
            type: 'input',
            placeholder: '请输入业务模块名称'
          },
          {
            label: '业务模块编码',
            prop: 'businessModuleKey',
            type: 'input',
            placeholder: '请输入业务模块编码',
          },
          {
            label: '排序',
            prop: 'orderNo',
            type: 'number'
          },
          {
            label: '启用状态',
            prop: 'status',
            type: 'select',
            options: this.constant['Enable']
          }
        ]
      }
    }
  }
}

</script>
