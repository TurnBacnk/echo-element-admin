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
      :save-fun="save"
      v-if="showForm"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getDictionary, getJavaCode } from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'

export default {
  name: 'DictAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '客户信息登记',
      saveUrl: '/api/client/save',
      submitUrl: '/api/client/submit',
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '客户联系人', name: 'contactInfo', type: 'table'}
      ],
      form: {
        clientCode: undefined,
        clientName: undefined,
        clientType: undefined,
        address: undefined,
        clientResponsiblePersonId: undefined,
        clientResponsiblePersonName: undefined,
        clientDetailList: []
      },
      rules: {
        baseInfo: {
          clientCode: [
            { required: true, message: '请输入客户编号', trigger: 'blur' }
          ],
          clientName: [
            { required: true, message: '请输入客户名称', trigger: 'blur' }
          ],
          clientType: [
            { required: true, message: '请选择客户类型', trigger: 'change' }
          ]
        },
        contactInfo: {
          contactName: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' }
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
        dictionaryNameList: ['ClientType']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['UserBuilder']
      }
    }
  },
  async created() {
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await generateCode('CLIENT').then(res => {
      this.form.clientCode = res.data
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '客户编码',
            prop: 'clientCode',
            type: 'input',
            disabled: true
          },
          {
            label: '客户名称',
            prop: 'clientName',
            type: 'input'
          },
          {
            label: '客户类型',
            prop: 'clientType',
            type: 'select',
            options: this.dictionary['ClientType']
          },
          {
            label: '地址',
            prop: 'address',
            type: 'input'
          },
          {
            label: '负责人',
            prop: 'clientResponsiblePersonId',
            type: 'select',
            options: this.javaCode['UserBuilder'],
            bundle: {
              label: 'clientResponsiblePersonName',
              value: 'clientResponsiblePersonId'
            }
          }
        ],
        contactInfo: {
          prop: 'clientDetailList',
          column: [
            {
              label: '联系人姓名',
              prop: 'contactName',
              type: 'input'
            },
            {
              label: '联系人手机号',
              prop: 'phone',
              type: 'phone'
            },
            {
              label: '联系人座机号',
              prop: 'landLine',
              type: 'phone'
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
            },
            {
              label: '地址',
              prop: 'address',
              type: 'input'
            },
            {
              label: '是否是主联系人',
              prop: 'isMainContact',
              type: 'switch'
            }
          ]
        }
      }
      this.showForm = true
    },
    save() {
      let mainContactNum = 0
      this.form.clientDetailList.forEach(function(ele) {
        if (ele.isMainContact) {
          mainContactNum++
        }
      })
      if (mainContactNum > 1) {
        this.$modal.msgWarning("主联系人只能有一个")
        return false
      }
      return true
    }
  }
}

</script>
