
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
      :save-fun="saveFun"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getConstant, getJavaCode } from '@/api/common/dict'
import {getConfigById} from "@/api/config/approval";
import {im} from "mathjs";

export default {
  name: 'ApprovalEdit',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '审核定义修改',
      saveUrl: '/api/approval-config/update',
      submitUrl: '',
      canSubmit: false,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '审核节点设置', name: 'approvalInfo', type: 'table' }
      ],
      form: {
        id: undefined,
        approvalName: undefined,
        moduleKey: undefined,
        isCopy: undefined,
        isRemind: undefined,
        copyUserIds: [],
        remindUserIds: [],
        status: undefined,
        remindType: undefined,
        viewPage: undefined,
        approvalConfigDetailList: []
      },
      rules: {
        baseInfo: {
          approvalName: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
          moduleKey: [{ required: true, message: '请选择业务模块', trigger: 'blur' }],
          isCopy: [{ required: true, message: '请选择是否抄送', trigger: 'blur' }],
          isRemind: [{ required: true, message: '请选择是否提醒', trigger: 'blur' }],
          status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
          copyUserIds: [{ required: true, message: '请选择抄送用户', trigger: 'blur' }],
          remindUserIds: [{ required: true, message: '请选择提醒用户', trigger: 'blur' }],
          remindType: [{ required: true, message: '请选择提醒方式', trigger: 'blur' }],
          viewPage: [{ required: true, message: '请输入审核页面', trigger: 'blur' }]
        },
        approvalInfo: {
          userName: [{ required: true, message: '请选择审核人', trigger: 'blur' }]
        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['YesOrNo', 'RemindType', 'StartPause', 'BusinessModel', 'Enable']
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: []
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['UserBuilder', 'ModuleBuilder']
      }
    }
  },
  watch: {
    'form.isCopy': {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          this.rules.baseInfo.copyUserIds = []
        }
        if (newVal === 1) {
          this.rules.baseInfo.copyUserIds = [{ required: true, message: '请选择抄送用户', trigger: 'blur' }]
        }
      },
      immediate: true,
      deep: true
    },
    'form.isRemind': {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          this.rules.baseInfo.remindUserIds = []
          this.rules.baseInfo.remindType = []
        }
        if (newVal === 1) {
          this.rules.baseInfo.remindUserIds = [{ required: true, message: '请选择提醒用户', trigger: 'blur' }]
          this.rules.baseInfo.remindType = [{ required: true, message: '请选择提醒方式', trigger: 'blur' }]
        }
      },
      immediate: true,
      deep: true
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getConfigById(this.$route.params.id).then(res => {
      Object.assign(this.form, res.data)
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '流程名称',
            prop: 'approvalName',
            type: 'input'
          },
          {
            label: '业务模块',
            prop: 'moduleKey',
            type: 'select',
            options: this.constant['BusinessModel'],
            bundle: {
              label: 'moduleName',
              value: 'moduleKey'
            }
          },
          {
            label: '审核页面',
            prop: 'viewPage',
            type: 'input'
          },
          {
            label: '是否抄送',
            prop: 'isCopy',
            type: 'select',
            options: this.constant['YesOrNo']
          },
          {
            label: '抄送人',
            prop: 'copyUserIds',
            type: 'select',
            options: this.javaCode['UserBuilder'],
            multiple: true
          },
          {
            label: '是否提醒',
            prop: 'isRemind',
            type: 'select',
            options: this.constant['YesOrNo']
          },
          {
            label: '提醒人',
            prop: 'remindUserIds',
            type: 'select',
            options: this.javaCode['UserBuilder'],
            multiple: true
          },
          {
            label: '提醒方式',
            prop: 'remindType',
            type: 'select',
            options: this.constant['RemindType']
          },
          {
            label: '是否启用',
            prop: 'status',
            type: 'select',
            options: this.constant['Enable']
          }
        ],
        approvalInfo: {
          prop: 'approvalConfigDetailList',
          column: [
            {
              prop: 'userName',
              label: '审核人',
              type: 'select',
              optionList: this.javaCode['UserBuilder'],
              click: (event, row) => {
                const obj = this.javaCode['UserBuilder'].find(item => {
                  return item.value === event
                })
                console.log(row)
                row.userId = obj.value
                row.userName = obj.label
                return new Promise(resolve => {
                  resolve()
                })
              }
            }
          ],
          showButton: true
        }
      }
      this.showForm = true
    }
  }
}

</script>
