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
      :is-view="true"
      :is-approval="true"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getProductInfoById } from '@/api/business/product-info'
import {getDictionary, getJavaCode} from '@/api/common/dict'
import {getOtherInboundByCode} from '@/api/business/other-inbound'

export default {
  name: 'OtherInboundApproval',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '其它入库登记',
      saveUrl: '/api/repo-other-inbound/update',
      submitUrl: 'api/repo-other-inbound/update-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '产品信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        otherInboundCode: undefined,
        otherInboundDate: new Date(),
        totalAmount: undefined,
        warehouseId: undefined,
        otherInboundItemList: []
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
        javaCodeNameList: ['ProductBuilder', 'WarehouseBuilder']
      }
    }
  },
  async created() {
    await getOtherInboundByCode(this.$route.params.code).then(response => {
      Object.assign(this.form, response.data)
      this.form.instanceId = this.$route.params.instanceId
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
            label: '入库单编码',
            prop: 'otherInboundCode',
            type: 'input',
            disabled: true
          },
          {
            label: '入库时间',
            prop: 'otherInboundDate',
            type: 'date'
          },
          {
            label: '仓库',
            prop: 'warehouseId',
            type: 'select',
            options: this.javaCode['WarehouseBuilder'],
            bundle: {
              label: 'warehouseName',
              value: 'warehouseId'
            }
          }
        ],
        goodsInfo: {
          prop: 'otherInboundItemList',
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
              label: '产品条码',
              prop: 'barCode',
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
              input: (newVal, currentRow) => {
                if (currentRow.price !== undefined) {
                  currentRow.totalAmount = this.$math.format(this.$math.multiply(newVal, currentRow.price), { precision: 2, notation: 'fixed' })
                }
              }
            },
            {
              label: '单价',
              prop: 'price',
              type: 'number',
              input: (newVal, currentRow) => {
                if (currentRow.amount !== undefined) {
                  currentRow.totalAmount = this.$math.format(this.$math.multiply(newVal, currentRow.amount), { precision: 2, notation: 'fixed' })
                }
              }
            },
            {
              label: '金额',
              prop: 'totalAmount',
              type: 'number',
              disabled: true
            },
            {
              label: '备注',
              prop: 'remark',
              type: 'input'
            }
          ],
          showButton: false,
          showSummary: true,
          totalColumns: ['totalAmount']
        }
      }
      this.showForm = true
    },
    saveFun() {
      if (this.form.otherInboundItemList.length === 0) {
        this.$modal.msgWarning('请至少选择一项产品')
        return false
      }
      return true
    }
  }
}

</script>
