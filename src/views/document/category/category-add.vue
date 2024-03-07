<template>
  <div class="app-container">
    <form-table
      :save-url="saveUrl"
      :submit-url="submitUrl"
      :form="form"
      :collapse-item-config="collapseItemConfig"
      :collapse-config="collapseConfig"
      :content-text="contentText"
      :rules="rules"
      v-if="showForm"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getNextOrderNO } from '@/api/business/category'

export default {
  name: 'CategoryAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      saveUrl: '/api/category/save',
      submitUrl: '/api/category/submit',
      form: {
        parentId: undefined,
        categoryName: undefined,
        orderNo: undefined,
        remark: undefined
      },
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' }
      ],
      collapseItemConfig: {},
      contentText: '产品分类新增',
      rules: {
        baseInfo: {
          parentId: [{required: true, message: '请选择', trigger: 'change'}],
          categoryName: [{required: true, message: '请输入', trigger: 'blur'}] ,
          orderNo: [{required: true, message: '请输入', trigger: 'blur'}]
        }
      },
      categoryTree: []
    }
  },
  async created() {
    await this.getNextOrder()
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '分类名称',
            prop: 'categoryName',
            type: 'input'
          },
          {
            label: '排序',
            prop: 'orderNo',
            disabled: true,
            type: 'number'
          },
          {
            label: '备注',
            prop: 'remark',
            type: 'input'
          },
          {
            label: '上级分类',
            prop: 'parentId',
            type: 'treeSelect',
            options: this.categoryTree
          }
        ]
      }
      this.showForm = true
    },
    getNextOrder() {
      getNextOrderNO(this.form.parentId).then(res => {
        this.form.orderNo = res.data
      })
    }
  }
}

</script>
