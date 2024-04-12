
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
import { getProductInfoById } from '@/api/business/product-info'
import { getDictionary, getJavaCode } from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'

export default {
  name: 'InboundAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '入库单登记',
      saveUrl: '/api/inbound-order/save',
      submitUrl: '',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '物料信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        inboundCode: undefined,
        inboundTime: undefined,
        vendorId: undefined,
        vendorName: undefined,
        procurementUserId: undefined,
        procurementUserName: undefined,
        otherAmount: undefined,
        discountRate: undefined,
        discountAmount: undefined,
        afterDiscountPayAmount: undefined,
        vendorContactUserId: undefined,
        vendorContactUserName: undefined,
        vendorContactUserPhone: undefined,
        vendorContactUserLandLine: undefined,
        vendorContactUserAddress: undefined,
        vendorAddress: undefined,
        orderId: undefined,
        orderCode: undefined,
        inboundOrderItemList: []
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
        javaCodeNameList: ['VendorBuilder', 'UserBuilder', 'ProductBuilder', 'WarehouseBuilder', 'OrderBuilder', 'SaleContractBuilder']
      },
      saleContractDisabled: false
    }
  },
  async created() {
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await generateCode('INBOUND').then(res => {
      this.form.inboundCode = res.data
    })
    await this.initParams()
    await this.init()
  },
  methods: {
    initParams() {
      if (this.$route.params.saleContractId) {
        this.form.saleContractId = this.$route.params.saleContractId
        this.form.saleContractCode = this.$route.params.saleContractCode
        this.saleContractDisabled = true
      }
    },
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '销售合同',
            prop: 'saleContractId',
            type: 'selectTemplate',
            bundle: {
              label: 'saleContractCode',
              value: 'saleContractId'
            },
            options: this.javaCode['SaleContractBuilder'],
            disabled: this.saleContractDisabled
          },
          {
            label: '入库单编号',
            prop: 'inboundCode',
            type: 'input',
            disabled: true
          },
          {
            label: '入库时间',
            prop: 'inboundTime',
            type: 'date'
          },
          {
            label: '供应商',
            prop: 'vendorId',
            type: 'select',
            bundle: {
              label: 'vendorName',
              value: 'vendorId'
            },
            options: this.javaCode['VendorBuilder']
          },
          {
            label: '采购人员',
            prop: 'procurementUserId',
            type: 'select',
            bundle: {
              label: 'procurementUserName',
              value: 'procurementUserId'
            },
            options: this.javaCode['UserBuilder']
          },
          {
            label: '其他费用',
            prop: 'otherAmount',
            type: 'inputNumber'
          },
          {
            label: '折扣率',
            prop: 'discountRate',
            type: 'inputNumber'
          },
          {
            label: '折扣金额',
            prop: 'discountAmount',
            type: 'inputNumber'
          },
          {
            label: '折扣后应付金额',
            prop: 'afterDiscountPayAmount',
            type: 'inputNumber'
          },
          {
            label: '采购订单',
            prop: 'orderId',
            type: 'select',
            bundle: {
              label: 'orderCode',
              value: 'orderId'
            },
            options: this.javaCode['OrderBuilder']
          }
        ],
        goodsInfo: {
          prop: 'inboundOrderItemList',
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
                  row.productId = data.productId
                  row.productCode = data.productCode
                  row.barCode = data.barCode
                  row.productSpec = data.specification
                  row.productDescription = data.productDescription
                  row.unit = data.unit
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
              label: '产品条码',
              prop: 'barCode',
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
              label: '产品描述',
              prop: 'productDescription',
              type: 'input',
              disabled: true
            },
            {
              label: '数量',
              prop: 'number',
              type: 'number'
            },
            {
              label: '单位',
              prop: 'unit',
              type: 'select',
              optionList: this.dictionary['Unit'],
              disabled: true
            },
            {
              label: '采购单价(元)',
              prop: 'procurementPrice',
              type: 'number'
            },
            {
              label: '含税价(元)',
              prop: 'taxIncludedPrice',
              type: 'number'
            },
            {
              label: '折扣率(%)',
              prop: 'discountRate',
              type: 'number'
            },
            {
              label: '折扣额(元)',
              prop: 'discountAmount',
              type: 'number'
            },
            {
              label: '采购金额(元)',
              prop: 'procurementAmount',
              type: 'number'
            },
            {
              label: '税额(元)',
              prop: 'taxAmount',
              type: 'number'
            },
            {
              label: '税率(%)',
              prop: 'taxRate',
              type: 'number'
            },
            {
              label: '税价合计(元)',
              prop: 'taxTotalAmount',
              type: 'number'
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
            }
          ]
        }
      }
      this.showForm = true
    }
  }
}

</script>
