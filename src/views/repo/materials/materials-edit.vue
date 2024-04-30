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
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import {getDictionary, getJavaCode} from "@/api/common/dict";
import {getProductInfoById} from "@/api/business/product-info";
import {getMaterialsById} from "@/api/business/materials";

export default {
  name: 'MaterialsAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '物资清单登记',
      saveUrl: '/api/repo-materials/update',
      submitUrl: '',
      canSubmit: false,
      collapseConfig: [
        { active: true, title: '成品信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '零件信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        materialsOrderCode: undefined,
        productName: undefined,
        productCode: undefined,
        productSpec: undefined,
        unit: undefined,
        amount: undefined,
        remark: undefined,
        materialsPartsList: []
      },
      rules: {
        baseInfo: {

        },
        goodsInfo: {

        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: []
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['Unit']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['ProductBuilder']
      }
    }
  },
  async created() {
      await getMaterialsById(this.$route.params.id).then(res => {
      Object.assign(this.form, res.data)
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
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
            label: '物资清单编码',
            prop: 'materialsOrderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '产品名称',
            prop: 'productName',
            type: 'input'
          },
          {
            label: '产品编码',
            prop: 'productCode',
            type: 'input'
          },
          {
            label: '产品规格',
            prop: 'productSpec',
            type: 'input'
          },
          {
            label: '单位',
            prop: 'unit',
            type: 'select',
            options: this.dictionary['Unit'],
          },
          {
            label: '数量',
            prop: 'amount',
            type: 'inputNumber',
          },
          {
            label: '备注',
            prop: 'remark',
            type: 'textarea',
          }
        ],
        goodsInfo: {
          prop: 'materialsPartsList',
          column: [
            {
              label: '产品名称',
              prop: 'productName',
              type: 'select',
              optionList: this.javaCode['ProductBuilder'],
              click: (event, row) => {
                getProductInfoById(event).then(res => {
                  const { data } = res
                  row.productName = data.productName
                  row.productId = data.id
                  row.productCode = data.productCode
                  row.barCode = data.barCode
                  row.productSpec = data.specification
                  row.unit = data.unit
                  row.productDescription = data.productDescription
                })
              }
            },
            {
              label: '产品编码',
              prop: 'productCode',
              type: 'input',
              disabled: true,
              width: '200px'
            },
            {
              label: '规格',
              prop: 'productSpec',
              type: 'input',
              disabled: true,
            },
            {
              label: '单位',
              prop: 'unit',
              type: 'selectConstant',
              optionList: this.dictionary['Unit'],
              disabled: true
            },
            {
              label: '数量',
              prop: 'amount',
              type: 'number'
            },
            {
              label: '备注',
              prop: 'remark',
              type: 'input',
            }
          ],
          showButton: true,
          showSummary: false
        }
      }
      this.showForm = true
    },
    saveFun() {
      if (this.form.saleReturnItemList.length === 0) {
        this.$modal.msgWarning('请至少选择一项产品')
        return false
      }
      return true
    }
  }
}

</script>
