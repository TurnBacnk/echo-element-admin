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
      :can-submit="canSubmit"
      v-if="showForm"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getDictionary, getJavaCode } from '@/api/common/dict'
import { getProductInfoById } from '@/api/business/product-info'

export default {
  name: 'DictAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '采购订单登记',
      saveUrl: '/api/order/save',
      submitUrl: '/api/order/submit',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '物料信息', name: 'goodsInfo', type: 'table'}
      ],
      form: {
        orderCode: undefined,
        orderTime: undefined,
        deliveryDate: undefined,
        vendorId: undefined,
        vendorName: undefined,
        procurementUserId: undefined,
        procurementUserName: undefined,
        contractCode: undefined,
        contractTime: undefined,
        discountRate: undefined,
        discountAmount: undefined,
        afterDiscountPayAmount: undefined,
        vendorContactId: undefined,
        vendorContactName: undefined,
        vendorContactLandLine: undefined,
        vendorContactAddress: undefined,
        vendorAddress: undefined,
        orderItemList: []
      },
      rules: {
        baseInfo: {

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
        javaCodeNameList: ['UserBuilder', 'VendorBuilder', 'ProductBuilder', 'WarehouseBuilder']
      },
      vendorContactList: []
    }
  },
  async created() {
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
            label: '订单编码',
            prop: 'orderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '订单时间',
            prop: 'orderTime',
            type: 'date'
          },
          {
            label: '交货日期',
            prop: 'deliveryDate',
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
            label: '合同号',
            prop: 'contractCode',
            type: 'input'
          },
          {
            label: '合同日期',
            prop: 'contractTime',
            type: 'date'
          },
          {
            label: '优惠率(%)',
            prop: 'discountRate',
            type: 'input'
          },
          {
            label: '优惠金额(元)',
            prop: 'discountAmount',
            type: 'input'
          },
          {
            label: '优惠后应付款(元)',
            prop: 'afterDiscountPayAmount',
            type: 'input'
          },
          {
            label: '供应商联系人',
            prop: 'vendorContactId',
            type: 'select',
            bundle: {
              label: 'vendorContactName',
              value: 'vendorContactId'
            },
            options: this.vendorContactList
          },
          {
            label: '联系人手机',
            prop: 'vendorContactPhone',
            type: 'input'
          },
          {
            label: '联系人座机',
            prop: 'vendorContactLandLine',
            type: 'input'
          },
          {
            label: '联系人地址',
            prop: 'vendorContactAddress',
            type: 'input'
          },
          {
            label: '供应商地址',
            prop: 'vendorAddress',
            type: 'input'
          },
          {
            label: '',
            prop: '',
            type: 'select',
            options: []
          }
        ],
        goodsInfo: {
          prop: 'orderItemList',
          column: [
            {
              label: '产品名称',
              prop: 'productId',
              type: 'select',
              optionList: this.javaCode['ProductBuilder'],
              click: (event, row) => {
                getProductInfoById(event).then(res => {
                  const { data } = res
                  row.productName = data.productName
                  row.productCode = data.productCode
                  row.barCode = data.barCode
                  row.productSpec = data.specification
                  row.productDescription = data.productDescription
                })
              }
            },
            {
              label: '产品编码',
              prop: 'productCode',
              type: 'input'
            },
            {
              label: '产品条码',
              prop: 'barCode',
              type: 'input'
            },
            {
              label: '规格',
              prop: 'productSpec',
              type: 'input'
            },
            {
              label: '产品描述',
              prop: 'productDescription',
              type: 'input'
            },
            {
              label: '数量',
              prop: 'amount',
              type: 'input'
            },
            {
              label: '单位',
              prop: 'unit',
              type: 'select',
              optionList: this.dictionary['Unit']
            },
            {
              label: '采购单价(元)',
              prop: 'procurementPrice',
              type: 'input'
            },
            {
              label: '含税价(元)',
              prop: 'taxIncludedPrice',
              type: 'input'
            },
            {
              label: '折扣率(%)',
              prop: 'discountRate',
              type: 'input'
            },
            {
              label: '折扣额(元)',
              prop: 'discountAmount',
              type: 'input'
            },
            {
              label: '采购金额(元)',
              prop: 'procurementAmount',
              type: 'input'
            },
            {
              label: '税额(元)',
              prop: 'taxAmount',
              type: 'input'
            },
            {
              label: '税率(%)',
              prop: 'taxRate',
              type: 'input'
            },
            {
              label: '税价合计(元)',
              prop: 'taxPriceTotal',
              type: 'input'
            },
            {
              label: '仓库',
              prop: 'warehouseId',
              type: 'select',
              optionList: this.javaCode['WarehouseBuilder'],
              click: (event, row) => {
                let obj = this.javaCode['WarehouseBuilder'].find((item) => {
                  return item.value === event
                })
                this.warehouseId = obj.value
                this.warehouseName = obj.label
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
