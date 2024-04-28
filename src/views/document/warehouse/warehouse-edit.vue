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
import { getConstant, getJavaCode } from '@/api/common/dict'
import { getWarehouseById } from '@/api/business/warehouse'

export default {
  name: 'DictAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '仓库信息登记',
      saveUrl: '/api/warehouse/update',
      submitUrl: '',
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' }
      ],
      form: {
        warehouseName: undefined,
        warehouseCode: undefined,
        address: undefined,
        phone: undefined,
        enable: undefined,
        isSelfBuiltWarehouse: undefined,
        warehouseResponsiblePersonId: undefined,
        warehouseResponsiblePersonName: undefined
      },
      rules: {
        baseInfo: {
          warehouseName: [
            { required: true, message: '请输入仓库名称', trigger: 'blur' }
          ],
          warehouseCode: [
            { required: true, message: '请输入仓库编码', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '请选择是否启用', trigger: 'change' }
          ],
          warehouseResponsiblePersonId: [
            { required: true, message: '请选择负责人', trigger: 'change' }
          ]

        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['Enable', 'YesOrNo']
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: []
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['UserBuilder']
      }
    }
  },
  async created() {
    await getWarehouseById(this.$route.params.id).then(res => {
      Object.assign(this.form, res.data)
    })
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '仓库编码',
            prop: 'warehouseCode',
            type: 'input',
            disabled: true
          },
          {
            label: '仓库名称',
            prop: 'warehouseName',
            type: 'input'
          },
          {
            label: '仓库地址',
            prop: 'address',
            type: 'input'
          },
          {
            label: '联系方式',
            prop: 'phone',
            type: 'input'
          },
          {
            label: '是否自建',
            prop: 'isSelfBuiltWarehouse',
            type: 'select',
            options: this.constant['YesOrNo']
          },
          {
            label: '状态',
            prop: 'enable',
            type: 'select',
            options: this.constant['Enable']
          },
          {
            label: '负责人',
            prop: 'warehouseResponsiblePersonId',
            type: 'select',
            bundle: {
              label: 'warehouseResponsiblePersonName',
              value: 'warehouseResponsiblePersonId'
            },
            options: this.javaCode['UserBuilder']
          }
        ]
      }
      this.showForm = true
    }
  }
}

</script>
