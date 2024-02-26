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

import { getPostById } from '@/api/post'
import FormTable from '@/components/FormTable/index.vue'

export default {
  name: 'PostEdit',
  components: { FormTable },
  data() {
    return {
      id: undefined,
      saveUrl: '/api/post/save',
      submitUrl: '/api/post/submit',
      collapseConfig: [
        {
          active: true,
          title: '基本信息',
          name: 'baseInfo',
          type: 'form'
        }
      ],
      contentText: '岗位新增',
      form: {
        postNo: undefined,
        postCode: undefined,
        postName: undefined,
        status: undefined
      },
      constant: [],
      constantConfig: {
        constantNameList: ['Enable']
      },
      collapseItemConfig: {}
    }
  },
  async created() {
    this.id = this.$route.params.id
    await getPostById(this.id).then(res => {
      Object.assign(this.form, res.data)
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '岗位名称',
            prop: 'postName',
            type: 'input',
            placeholder: '请输入岗位名称'
          },
          {
            label: '岗位编码',
            prop: 'postNo',
            type: 'number'
          },
          {
            label: '岗位代码',
            prop: 'postCode',
            type: 'input',
            placeholder: '请输入岗位代码'
          },
          {
            label: '是否启用',
            prop: 'status',
            type: 'switch',
            sw: {
              activeText: '启用',
              inactiveText: '停用'
            }
          }
        ]
      }
    }
  }
}
</script>
