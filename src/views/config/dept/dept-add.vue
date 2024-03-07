<template>
  <div class="app-container">
    <form-table
      :save-url="saveUrl"
      :submit-url="submitUrl"
      :collapse-item-config="collapseItemConfig"
      :collapse-config="collapseConfig"
      :content-text="contentText"
      :form="form"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getJavaCode } from '@/api/common/dict'
import { getDeptTree } from '@/api/config/dept'

export default {
  name: 'DeptAdd',
  components: { FormTable },
  data() {
    return {
      collapseItemConfig: {},
    collapseConfig: [
        {
          active: true,
          title: '基本信息',
          name: 'baseInfo',
          type: 'form'
        }
      ],
      contentText: '部门新增',
      saveUrl: '/api/dept/save',
      submitUrl: '/api/dept/submit',
      form: {
        deptName: undefined,
        leaderId: undefined,
        leaderName: undefined,
        orderNum: undefined,
        phone: undefined,
        parentId: undefined,
        parentName: undefined,
        email: undefined
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['UserBuilder']
      },
      deptTree: []
    }
  },
  async created() {
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getDeptTree().then(res => {
      this.deptTree = res.data
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '部门名称',
            prop: 'deptName',
            type: 'input',
            placeholder: '请输入部门名称',
          },
          {
            label: '部门负责人',
            prop: 'leaderId',
            type: 'select',
            options: this.javaCode['UserBuilder']
          },
          {
            label: '排序顺序',
            prop: 'orderNum',
            type: 'number',
          },
          {
            label: '联系电话',
            prop: 'phone',
            type: 'inputNumber',
            placeholder: '请输入联系电话'
          },
          {
            label: '上级部门',
            prop: 'parentId',
            type: 'treeSelect',
            options: this.deptTree,
            placeholder: '请选择上级部门'
          },
          {
            label: '邮箱',
            prop: 'email',
            type: 'autoComplete',
            placeholder: '请输入邮箱',
            completeFun: (str, callback) => {
              const emailList = [
                { value: '@qq.com' },
                { value: '@126.com' },
                { value: '@163.com' },
                { value: '@sina.com' },
                { value: '@21cn.com' },
                { value: '@sohu.com' },
                { value: '@yahoo.com.cn' },
                { value: '@tom.com' },
                { value: '@etang.com' },
                { value: '@eyou.com' },
                { value: '@56.com' },
                { value: '@x.cn' },
                { value: '@chinaren.comsogou.com' },
                { value: '@citiz.com' },
              ]
              let results
              let queryList = []
              emailList.map(item => {
                queryList.push({ value: str.split('@')[0] + item.value })
              })
              results = str ? queryList.filter(item => item.value.toLowerCase().indexOf(str.toLowerCase()) === 0) : queryList;
              callback(results);
            }
          }
        ]
      }
    }
  }
}
</script>
