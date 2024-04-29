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
import {generateCode} from "@/api/config/generate-code";
import {getDictionary, getJavaCode} from "@/api/common/dict";
import {getProductInfoById} from "@/api/business/product-info";
import {getTransferOrderByCode, getTransferOrderById} from "@/api/business/repo-transfer";

export default {
  name: 'RepoTransferOrderView',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '调拨单修改',
      saveUrl: '/api/repo-transfer-order/update',
      submitUrl: 'api/repo-transfer-order/update-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        {active: true, title: '基本信息', name: 'baseInfo', type: 'form'},
        {active: true, title: '产品信息', name: 'goodsInfo', type: 'table'}
      ],
      form: {
        transferOrderCode: undefined,
        transferOrderDate: new Date(),
        transferOutWarehouseId: undefined,
        transferOutWarehouseName: undefined,
        transferInWarehouseId: undefined,
        transferInWarehouseName: undefined,
        totalAmount: undefined,
        transferOrderItemList: []
      },
      rules: {
        baseInfo: {},
        goodsInfo: {}
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
    await getTransferOrderByCode(this.$route.params.code).then(res => {
      Object.assign(this.form, res.data)
      this.form.instanceId = this.$route.params.instanceId;
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
            label: '调拨单编号',
            prop: 'transferOrderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '调拨时间',
            prop: 'transferOrderDate',
            type: 'date'
          },
          {
            label: '调出仓库',
            prop: 'transferOutWarehouseId',
            type: 'select',
            options: this.javaCode['WarehouseBuilder'],
            bundle: {
              label: 'transferOutWarehouseName',
              value: 'transferOutWarehouseId'
            }
          },
          {
            label: '调入仓库',
            prop: 'transferInWarehouseId',
            type: 'select',
            options: this.javaCode['WarehouseBuilder'],
            bundle: {
              label: 'transferInWarehouseName',
              value: 'transferInWarehouseId'
            }
          },
        ],
        goodsInfo: {
          prop: 'transferOrderItemList',
          column: [
            {
              label: '产品名称',
              prop: 'productName',
              type: 'select',
              optionList: this.javaCode['ProductBuilder'],
              click: (event, row) => {
                getProductInfoById(event).then(res => {
                  const {data} = res
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
                  currentRow.transferTotalAmount = this.$math.format(this.$math.multiply(newVal, currentRow.price), {
                    precision: 2,
                    notation: 'fixed'
                  })
                }
              }
            },
            {
              label: '调拨单位成本',
              prop: 'transferPrice',
              type: 'number',
              input: (newVal, currentRow) => {
                if (currentRow.amount !== undefined) {
                  currentRow.transferTotalAmount = this.$math.format(this.$math.multiply(newVal, currentRow.amount), {
                    precision: 2,
                    notation: 'fixed'
                  })
                }
              }
            },
            {
              label: '调拨成本',
              prop: 'transferTotalAmount',
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
          totalColumns: ['transferTotalAmount'],
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
