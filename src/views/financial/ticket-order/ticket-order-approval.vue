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
      :save-fun="saveFun"
      :is-view="true"
      :is-approval="true"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import {getConstant, getDictionary, getJavaCode} from "@/api/common/dict";
import {getSaleOutboundInfoWithInvoice} from "@/api/business/sale-outbound";
import {getBuyInboundInfoWithInvoice} from "@/api/business/inbound";
import {getTicketOrderByCode, getTicketOrderById} from "@/api/business/ticket-order";

export default {
  name: 'FinancialTicketOrderApproval',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '采购开票审核',
      saveUrl: '/api/financial-ticket-order/save',
      submitUrl: '/api/financial-ticket-order/save-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '产品信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        invoiceNo: undefined,
        invoiceTitle: undefined,
        invoiceDate: new Date(),
        invoiceUserId: this.$store.state.user.id,
        invoiceUserName: this.$store.state.user.name,
        orderCode: undefined,
        orderId: undefined,
        orderType: 3,
        orderTime: undefined,
        vendorId: undefined,
        vendorName: undefined,
        invoiceAmount: 0.00,
        alreadyInvoiceAmount: 0.00,
        unInvoiceAmount: 0.00,
        amount: 0.00,
        invoiceOrderItemList: []
      },
      rules: {
        baseInfo: {
          invoiceNo: [
            { required: true, message: '请输入发票号', trigger: 'blur' }
          ]
        },
        goodsInfo: {
          currentInvoiceProductAmount: [
            { required: true, message: '请输入收票数量', trigger: 'blur' }
          ]
        }
      },
      collapseItemConfig: [],
      constant: [],
      constantConfig: {
        constantNameList: ['OrderType']
      },
      dictionary: [],
      dictionaryConfig: {
        dictionaryNameList: ['Unit']
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['UserBuilder', 'VendorBuilder', 'ProductBuilder']
      }
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      this.constant = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await this.init()
    await getTicketOrderByCode(this.$route.params.code).then(res => {
      Object.assign(this.form, res.data)
      this.form.instanceId = this.$route.params.instanceId
    })
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '发票号',
            prop: 'invoiceNo',
            type: 'input'
          },
          {
            label: '发票抬头',
            prop: 'invoiceTitle',
            type: 'input',
            disabled: true
          },
          {
            label: '收票日期',
            prop: 'invoiceDate',
            type: 'date'
          },
          {
            label: '收票人',
            prop: 'invoiceUserId',
            type: 'select',
            bundle: {
              value: 'invoiceUserId',
              label: 'invoiceUserName'
            },
            options: this.javaCode['UserBuilder']
          },
          {
            label: '单据编号',
            prop: 'orderCode',
            type: 'input',
            disabled: true
          },
          {
            label: '单据类型',
            prop: 'orderType',
            type: 'select',
            options: this.constant['OrderType'],
            disabled: true
          },
          {
            label: '单据日期',
            prop: 'orderTime',
            type: 'date',
            disabled: true
          },
          {
            label: '供应商',
            prop: 'vendorId',
            type: 'select',
            options: this.javaCode['VendorBuilder'],
            bundle: {
              value: 'clientId',
              label: 'clientName'
            },
            disabled: true
          },
          {
            label: '已开票金额',
            prop: 'alreadyInvoiceAmount',
            type: 'inputNumber',
            disabled: true
          },
          {
            label: '未开票金额',
            prop: 'unInvoiceAmount',
            type: 'inputNumber',
            disabled: true
          }
        ],
        goodsInfo: {
          prop: 'invoiceOrderItemList',
          column: [
            {
              label: '产品名称',
              prop: 'productName',
              type: 'input'
            },
            {
              label: '产品编码',
              prop: 'productCode',
              type: 'input',
              disabled: true,
              width: '200px'
            },
            {
              label: '产品规格',
              prop: 'specification',
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
              label: '应收票数量',
              prop: 'productAmount',
              type: 'input',
              disabled: true
            },
            {
              label: '可收票数量',
              prop: 'canInvoiceProductAmount',
              type: 'input',
              disabled: true
            },
            {
              label: '本次收票数量',
              prop: 'currentInvoiceProductAmount',
              type: 'input',
              input: (newNumber, currentRow) => {
                // 修改开票数量 同步变更 本次开票金额 ，本次开票总金额
                if (newNumber === undefined || newNumber === '' || newNumber === 0) {
                  // 不填写
                  this.form.amount = 0
                  currentRow.amount = 0
                } else {
                  currentRow.amount = this.$math.multiply(currentRow.price, newNumber)
                }
              }
            },
            {
              label: '单价',
              prop: 'price',
              type: 'input',
              disabled: true
            },
            {
              label: '应收票金额',
              prop: 'invoiceAmount',
              type: 'input',
              disabled: true
            },
            {
              label: '已收票金额',
              prop: 'alreadyInvoiceAmount',
              type: 'input',
              disabled: true
            },
            {
              label: '本次收票金额',
              prop: 'amount',
              type: 'input',
              disabled: true
            }
          ],
          showSummary: true,
          totalColumns: ['amount'],
          showButton: false
        }
      }
      this.showForm = true
    },
    saveFun() {
      if (this.form.invoiceOrderItemList.length === 0) {
        this.$modal.msgWarning('请至少为一件产品收票')
        return false
      }
      let temp = 0
      this.form.invoiceOrderItemList.forEach(item => {
        temp = this.$math.add(item.amount, temp)
      })
      this.form.amount = temp
      return true
    },
    buildTotalAmount() {
      if (this.form.invoiceOrderItemList.length === 0) {
        return false
      }
      let temp
      this.form.invoiceOrderItemList.forEach(item => {
        temp = this.$math.add(item.amount, temp)
      })
      this.form.amount = temp
    }
  }
}

</script>
