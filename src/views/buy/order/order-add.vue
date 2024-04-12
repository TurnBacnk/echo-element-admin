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
import { getDictionary, getJavaCode } from '@/api/common/dict'
import { getProductInfoById } from '@/api/business/product-info'
import { generateCode } from '@/api/config/generate-code'
import {getClientContactListById} from "@/api/business/client";
import {getVendorContactUserList} from "@/api/business/vendor";

export default {
  name: 'OrderEdit',
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
        { active: true, title: '物料信息', name: 'goodsInfo', type: 'table' }
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
        vendorContactPhone: undefined,
        vendorContactLandLine: undefined,
        vendorContactAddress: undefined,
        vendorAddress: undefined,
        saleContractId: undefined,
        saleContractCode: undefined,
        orderItemList: []
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
        javaCodeNameList: ['UserBuilder', 'VendorBuilder', 'ProductBuilder', 'WarehouseBuilder', 'SaleContractBuilder']
      },
      vendorContactList: [],
      saleContractDisabled: false
    }
  },
  async created() {
    await generateCode('ORDER').then(res => {
      this.form.orderCode = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await this.initParams()
    await this.init()
  },
  watch: {
    'form.vendorId': {
      handler(newVal, oldVal) {
        getVendorContactUserList(newVal).then(res => {
          // this.vendorContactList = [].concat(res.data)
          res.data.forEach(item => {
            this.vendorContactList.push(item);
          })
        })
      },
      immediate: true,
      deep: true
    }
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
      console.log(this.saleContractDisabled)
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
              label: 'procurementUsername',
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
            type: 'inputNumber'
          },
          {
            label: '优惠金额(元)',
            prop: 'discountAmount',
            type: 'inputNumber'
          },
          {
            label: '优惠后应付款(元)',
            prop: 'afterDiscountPayAmount',
            type: 'inputNumber'
          },
          {
            label: '供应商联系人',
            prop: 'vendorContactId',
            type: 'select',
            bundle: {
              id: 'vendorContactId',
              contactName: 'vendorContactName',
              phone: 'vendorContactPhone',
              landLine: 'vendorContactLandLine',
              address: 'vendorContactAddress'
            },
            optionLabel: 'contactName',
            optionValue: 'id',
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
          }
        ],
        goodsInfo: {
          prop: 'orderItemList',
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
              prop: 'amount',
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
