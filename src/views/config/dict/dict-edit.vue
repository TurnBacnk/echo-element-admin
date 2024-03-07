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
import { getConstant } from '@/api/common/dict'
import { getSingleDict } from '@/api/config/dict'

export default {
  name: 'DictAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '字典修改',
      saveUrl: '/api/dict/update',
      submitUrl: '',
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '字典条目', name: 'optionsList', type: 'table' }
      ],
      form: {
        dictionaryName: undefined,
        dictionaryType: undefined,
        dictionaryKey: undefined,
        optionsList: []
      },
      rules: {
        baseInfo: {
          dictionaryName: [
            { required: true, message: '请输入字典名称', trigger: 'blur' }
          ],
          dictionaryType: [
            { required: true, message: '请输入字典类型', trigger: 'blur' }
          ],
          dictionaryKey: [
            { required: true, message: '请输入字典键', trigger: 'blur' }
          ]
        },
        optionsList: {
          dictKey: [
            { required: true, message: '请输入字典键', trigger: 'blur' }
          ],
          dictValue: [
            { required: true, message: '请输入字典值', trigger: 'blur' }
          ],
          dictLabel: [
            { required: true, message: '请输入字典标签', trigger: 'blur' }
          ]
        }
      },
      collapseItemConfig: {},
      constant: [],
      constantConfig: {
        constantNameList: ['DictionaryType']
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
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await this.initData()
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '字典名称',
            prop: 'dictionaryName',
            type: 'input'
          },
          {
            label: '字典类型',
            prop: 'dictionaryType',
            type: 'select',
            options: this.constant['DictionaryType']
          },
          {
            label: '字典标识',
            prop: 'dictionaryKey',
            type: 'input'
          }
        ],
        optionsList: {
          prop: 'optionsList',
          column: [
            {
              label: '选项标识',
              prop: 'dictKey',
              type: 'input'
            },
            {
              label: '选项值',
              prop: 'dictValue',
              type: 'input'
            },
            {
              label: '选项展示',
              prop: 'dictLabel',
              type: 'input'
            },
            {
              label: '备注',
              prop: 'remark',
              type: 'input'
            }
          ]
        }
      }
      this.showForm = true
    },
    async initData() {
      await getSingleDict(this.$route.params.id).then(res => {
        Object.assign(this.form, res.data)
      })
    }
  }
}

</script>
