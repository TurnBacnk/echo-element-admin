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
import { getCategoryTree, getNextOrderNO } from '@/api/business/category'

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
  watch: {
    'form.parentId': {
      handler(newVal, oldVal) {
        console.log(newVal)
        this.getNextOrder(newVal)
      },
      immediate: true,
      deep: true
    }
  },
  async created() {
    const parentId = this.$route.params.parentId
    const categoryName = this.$route.params.categoryName
    if (parentId) {
      this.form.parentId = parentId
    }
    if (categoryName) {
      this.form.categoryName = categoryName
    }
    await getCategoryTree().then(res => {
      this.categoryTree = res.data
    })
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
            label: '备注',
            prop: 'remark',
            type: 'input'
          },
          {
            label: '排序',
            prop: 'orderNo',
            disabled: true,
            type: 'number'
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
    getNextOrder(parentId) {
      getNextOrderNO(parentId).then(res => {
        this.form.orderNo = res.data
      })
    }
  }
}

</script>
