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
import {generateCode} from "@/api/config/generate-code";

export default {
  name: 'StocktakingAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '库存盘点',
      saveUrl: '/api/repo-stocktaking/save',
      submitUrl: '',
      canSubmit: false,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '盘点信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        stocktakingCode: undefined,
        stocktakingDate: new Date(),
        warehouseId: undefined,
        warehouseName: undefined,
        warehouseCode: undefined,
        stocktakingProductAmount: 0,
        alreadyStocktakingAmount: 0,
        stocktakingUserId: undefined,
        stocktakingUserName: undefined,
        stocktakingItemList: []
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
        javaCodeNameList: ['WarehouseBuilder', 'CategoryBuilder', 'UserBuilder', 'ProductBuilder']
      }
    }
  },
  watch: {
    'form.stocktakingItemList.length': {
      handler(newVal, oldVal) {
        if (newVal === undefined) {
          this.form.stocktakingProductAmount = 0
        } else {
          this.form.stocktakingProductAmount = newVal
          let temp = 0
          this.form.stocktakingItemList.forEach((ele) => {
            if (ele.stockAmount !== undefined) {
              temp++
            }
          })
          this.form.alreadyStocktakingAmount = temp
        }
      }
    }
  },
  async created() {
    await generateCode('REPO_STOCKTAKING').then(res => {
      this.form.stocktakingCode = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '盘点单编号',
            prop: 'stocktakingCode',
            type: 'input',
            disabled: true
          },
          {
            label: '盘点时间',
            prop: 'stocktakingDate',
            type: 'date'
          },
          {
            label: '盘点仓库',
            prop: 'warehouseId',
            type: 'select',
            bundle: {
              label: 'warehouseName',
              value: 'warehouseId'
            },
            options: this.javaCode['WarehouseBuilder'],
          },
          {
            label: '盘点人员',
            prop: 'stocktakingUserId',
            type: 'select',
            bundle: {
              label: 'stocktakingUserName',
              value: 'stocktakingUserId'
            },
            options: this.javaCode['UserBuilder']
          },
          {
            label: '盘点产品数量',
            prop: 'stocktakingProductAmount',
            type: 'input',
            disabled: true
          },
          {
            label: '已盘点产品数量',
            prop: 'alreadyStocktakingAmount',
            type: 'input',
            disabled: true
          }
        ],
        goodsInfo: {
          prop: 'stocktakingItemList',
          column: [
            {
              label: '产品名称',
              prop: 'productName',
              type: 'select',
              optionList: this.javaCode['ProductBuilder'],
              click: (event, row)=> {
                getProductInfoById(event).then(res => {
                  const { data } = res
                  row.productName = data.productName
                  row.productId = data.id
                  row.productCode = data.productCode
                  row.barCode = data.barCode
                  row.productSpec = data.specification
                  row.unit = data.unit
                  row.category = data.category
                  row.systemAmount = data.num
                  row.productDescription = data.productDescription
                })
              }
            },
            {
              label: '产品编码',
              prop: 'productCode',
              type: 'input',
              disabled: true
            },
            {
              label: '规格',
              prop: 'productSpec',
              type: 'input',
              disabled: true
            },
            {
              label: '分类',
              prop: 'category',
              type: 'selectConstant',
              optionList: this.javaCode['CategoryBuilder'],
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
              label: '系统数量',
              prop: 'systemAmount',
              type: 'number',
              disabled: true
            },
            {
              label: '盘点数量',
              prop: 'stockAmount',
              type: 'number',
              input: (newNumber, currentRow) => {
                if (newNumber === 0) {
                  currentRow.stocktakingProfit = undefined
                }
                currentRow.stocktakingProfit = this.$math.format(this.$math.subtract(currentRow.systemAmount, newNumber), { precision: 2, notation: 'fixed' })
              }
            },
            {
              prop: 'stocktakingProfit',
              label: '盘点盈亏',
              type: 'input',
              disabled: true
            },
          ],
          showButton: true,
          showSummary: false
        }
      }
      this.showForm = true
    },
    saveFun() {
      if (this.form.stocktakingItemList.length === 0) {
        this.$modal.msgWarning('请至少选择一项产品')
        return false
      }
      return true
    }
  }
}

</script>
