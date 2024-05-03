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
import { generateCode } from '@/api/config/generate-code'
import { getMaterialsById } from '@/api/business/materials'
import { getDictionary, getJavaCode } from '@/api/common/dict'

export default {
  name: 'RepoAssemblyAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '组装单登记',
      saveUrl: '/api/repo-assembly/save',
      submitUrl: '/api/repo-assembly/save-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '成品', name: 'baseInfo', type: 'form' },
        { active: true, title: '零件', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        assemblyOrderCode: undefined,
        assemblyOrderDate: new Date(),
        assemblyOrderAmount: 0.00,
        productCode: undefined,
        productName: undefined,
        productId: undefined,
        warehouseId: undefined,
        warehouseName: undefined,
        unit: undefined,
        amount: 0,
        inboundPrice: undefined,
        inboundTotalAmount: undefined,
        assemblyPartsList: []
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
        javaCodeNameList: ['WarehouseBuilder']
      }
    }
  },
  watch: {
    'form.amount': {
      handler(newVal, oldVal) {
        const _this = this
        // 设置数量，检索出库合计金额以及组装费用 出库单价 = (出库合计金额 + 组装费用 ) / 数量
        if (newVal !== undefined) {
          let temp = 0
          this.form.assemblyPartsList.forEach(item => {
            temp = _this.$math.add(temp, item.outboundTotalAmount)
          })
          temp = this.$math.add(temp, this.form.assemblyOrderAmount)
          this.form.inboundPrice = this.$math.format(this.$math.divide(temp, newVal), { precision: 2, notation: 'fixed' })
          this.form.inboundTotalAmount = this.$math.format(temp, { precision: 2, notation: 'fixed' })
        }
      },
      'form.assemblyOrderAmount': {
        handler(newVal, oldVal) {
          const _this = this
          if (newVal !== undefined) {
            let temp = 0
            this.form.assemblyPartsList.forEach(item => {
              temp = _this.$math.add(temp, item.outboundTotalAmount)
            })
            temp = this.$math.add(temp, newVal)
            this.form.inboundPrice = this.$math.format(this.$math.divide(temp, this.form.amount), { precision: 2, notation: 'fixed' })
            this.form.inboundTotalAmount = this.$math.format(temp, { precision: 2, notation: 'fixed' })
          }
        }
      }
    }
  },
  async created() {
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await generateCode('REPO_ASSEMBLY').then(res => {
      this.form.assemblyOrderCode = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getMaterialsById(this.$route.params.id).then(res => {
      Object.assign(this.form, res.data)
      res.data.materialsPartsList.forEach(item => {
        this.form.assemblyPartsList.push(item)
      })
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '组装单编号',
            prop: 'assemblyOrderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '组装单时间',
            prop: 'assemblyOrderDate',
            type: 'date'
          },
          {
            label: '组装费用',
            prop: 'assemblyOrderAmount',
            type: 'inputNumber'
          },
          {
            label: '产品编码',
            prop: 'productCode',
            type: 'input',
            disabled: true
          },
          {
            label: '产品名称',
            prop: 'productName',
            type: 'input',
            disabled: true
          },
          {
            label: '产品规格',
            prop: 'productSpec',
            type: 'input',
            disabled: true
          },
          {
            label: '单位',
            prop: 'unit',
            type: 'select',
            options: this.dictionary['Unit'],
            disabled: true
          },
          {
            label: '数量',
            prop: 'amount',
            type: 'inputNumber'
          },
          {
            label: '入库单价',
            prop: 'inboundPrice',
            type: 'inputNumber'
          },
          {
            label: '入库总金额',
            prop: 'inboundTotalAmount',
            type: 'inputNumber',
            disabled: true
          }
        ],
        goodsInfo: {
          prop: 'assemblyPartsList',
          column: [
            {
              label: '产品名称',
              prop: 'productName',
              type: 'input',
              disabled: true
            },
            {
              label: '产品编码',
              prop: 'productCode',
              type: 'input',
              disabled: true
            },
            {
              label: '产品规格',
              prop: 'productSpec',
              type: 'input',
              disabled: true
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
              type: 'number',
              disabled: true
            },
            {
              label: '仓库',
              prop: 'warehouseName',
              type: 'select',
              optionList: this.javaCode['WarehouseBuilder'],
              click: (event, row) => {
                const obj = this.javaCode['WarehouseBuilder'].find((item) => {
                  return item.value === event
                })
                row.warehouseId = obj.value
                row.warehouseName = obj.label
              }
            },
            {
              label: '出库单价',
              prop: 'outboundPrice',
              type: 'number',
              input: (newVal, currentRow) => {
                if (newVal !== undefined) {
                  currentRow.outboundTotalAmount = this.$math.format(this.$math.multiply(newVal, currentRow.amount), { precision: 2, notation: 'fixed' })
                }
              }
            },
            {
              label: '出库总金额',
              prop: 'outboundTotalAmount',
              type: 'number',
              disabled: true
            }
          ],
          showSummary: false,
          showButton: false
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
