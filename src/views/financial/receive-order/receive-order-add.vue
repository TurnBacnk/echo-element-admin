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

export default {
  name: 'ReceiveOrderAdd',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '收款单登记',
      saveUrl: '/api/financial-receive-order/save',
      submitUrl: '/api/financial-receive-order/save-and-submit-single',
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '资金账户', name: 'capitalInfo', type: 'table' }
      ],
      form: {
        receiveOrderCode: undefined,
        clientId: undefined,
        clientName: undefined,
        receiveType: undefined,
        receiveUserId: undefined,
        receiveUserName: undefined,
        receiveOrderTime: undefined,
        amount: undefined,
        remark: undefined,
        orderReceiveInfoList: [],
        receivableInfoList: [],
        receiveAccountList: [],
        preReceiveReturnList: []
      },
      rules: {
        baseInfo: {

        },
        orderReceiveInfoList: {},
        receivableInfoList: {},
        receiveAccountList: {}
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
        javaCodeNameList: []
      }
    }
  },
  watch: {
    'form.receiveType': {
      handler(newVal, oldVal) {
        // 收款类型改变，表单变化
        // 0.应收收款 value === 0
        if (newVal === 0) {
          this.collapseConfig = [
            { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
            { active: true, title: '应收单据', name: 'receivableInfo', type: 'form' },
            { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
          ]
        }
        // 1.订单收款 value === 1
        if (newVal === 1) {
          this.collapseConfig = [
            { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
            { active: true, title: '销售订单', name: 'orderReceiveInfoList', type: 'form' },
            { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
          ]
        }
        // 2.预收 value === 2
        if (newVal === 2) {
          this.collapseConfig = [
            { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
            { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
          ]
        }
        if (newVal === 3) {
          this.collapseConfig = [
            { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
            { active: true, title: '预收单据', name: 'preReceiveInfo', type: 'table' },
            { active: true, title: '本次收款', name: 'capitalInfo', type: 'table' }
          ]
        }
      }
    }
  },
  async created() {
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '',
            prop: '',
            type: 'input'
          },
          {
            label: '',
            prop: '',
            type: 'select',
            options: []
          }
        ]
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
