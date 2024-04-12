
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
import { getJavaCode } from '@/api/common/dict'
import { generateCode } from '@/api/config/generate-code'

export default {
  name: 'DictAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '退货单登记',
      saveUrl: '/api/return-order/save',
      submitUrl: '',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '产品信息', name: 'productInfo', type: 'table' }
      ],
      form: {
        returnOrderCode: undefined,
        returnOrderTime: undefined,
        vendorId: undefined,
        vendorName: undefined,
        inboundOrderCode: undefined,
        procurementUserId: undefined,
        procurementUserName: undefined,
        discountRate: undefined,
        discountAmount: undefined,
        afterDiscountPayAmount: undefined,
        returnOrderItemList: []
      },
      rules: {
        baseInfo: {
          returnOrderCode: [
            { required: true, message: '退货单编号不能为空', trigger: 'blur' }
          ],
          returnOrderTime: [
            { required: true, message: '退货时间不能不为空', trigger: 'blur' }
          ],
          vendorId: [
            { required: true, message: '供应商不能为空', trigger: 'blur' }
          ]
        },
        productInfo: {

        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: []
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: []
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['VendorBuilder', 'InboundOrderBuilder', 'UserBuilder', 'ProductBuilder', 'WarehouseBuilder']
      }
    }
  },
  async created() {
    await generateCode('RETURN').then(res => {
      this.form.returnOrderCode = res.data
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
            label: '退货单编号',
            prop: 'returnOrderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '退货时间',
            prop: 'returnOrderTime',
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
            label: '入库单编号',
            prop: 'inboundOrderCode',
            type: 'select',
            options: this.javaCode['InboundOrderBuilder']
          },
          {
            label: '采购人员',
            prop: 'procurementUserId',
            type: 'select',
            options: this.javaCode['UserBuilder'],
            bundle: {
              label: 'procurementUserName',
              value: 'procurementUserId'
            }
          },
          {
            label: '优惠率',
            prop: 'discountRate',
            type: 'inputNumber'
          },
          {
            label: '优惠金额',
            prop: 'discountAmount',
            type: 'inputNumber'
          },
          {
            label: '优惠后应付款',
            prop: 'afterDiscountPayAmount',
            type: 'inputNumber'
          }
        ],
        productInfo: {
          prop: 'productInfo',
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
