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
      :save-fun="save"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getDictionary, getJavaCode } from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'

export default {
  name: 'VendorAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '供应商登记',
      saveUrl: '/api/vendor/save',
      submitUrl: '/api/vendor/submit',
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '联系人信息', name: 'contactInfo', type: 'table' }
      ],
      form: {
        vendorCode: undefined,
        vendorName: undefined,
        vendorType: undefined,
        address: undefined,
        vendorResponsiblePersonId: undefined,
        vendorResponsiblePersonName: undefined,
        vendorContactList: []
      },
      rules: {
        baseInfo: {
          vendorCode: [
            { required: true, message: '请输入供应商编码', trigger: 'blur' }
          ],
          vendorName: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' }
          ],
          vendorType: [
            { required: true, message: '请选择供应商类型', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入地址', trigger: 'blur' }
          ],
          vendorResponsiblePersonName: [
            { required: true, message: '请选择负责人姓名', trigger: 'change'}
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
        dictionaryNameList: ['VendorType']
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
    await generateCode('VENDOR').then(res => {
      this.form.vendorCode = res.data
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '供应商编码',
            prop: 'vendorCode',
            type: 'input',
            disabled: true
          },
          {
            label: '供应商名称',
            prop: 'vendorName',
            type: 'input'
          },
          {
            label: '供应商类型',
            prop: 'vendorType',
            type: 'select',
            options: this.dictionary['VendorType']
          },
          {
            label: '地址',
            prop: 'address',
            type: 'input'
          },
          {
            label: '负责人',
            prop: 'vendorResponsiblePersonId',
            type: 'select',
            options: this.javaCode['UserBuilder'],
            bundle: {
              label: 'vendorResponsiblePersonName',
              value: 'vendorResponsiblePersonId'
            }
          }
        ],
        contactInfo: {
          prop: 'vendorContactList',
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
          ],
          showForm: true
        }
      }
      this.showForm = true
    },
    save() {
      let mainContactNum = 0
      this.form.vendorContactList.forEach(function(ele) {
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
