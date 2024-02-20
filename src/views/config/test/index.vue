<template>
  <div class="app-container">
    <form-table
      :content-text="contentText"
      :collapse-config="collapseConfig"
      :collapse-item-config="collapseItemConfig"
      :form="form"
    />
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'

export default {
  name: 'Test',
  components: { FormTable
  },
  data() {
    return {
      contentText: '测试组件-新增',
      collapseConfig: [
        { active: true, title: '单据信息', name: 'billInfo', type: 'form' },
        { active: true, title: '单据附属信息', name: 'billExtraInfo', type: 'form' },
        { active: true, title: '物料信息', name: 'goodsInfo', type: 'table' },
        { active: true, title: '人员信息', name: 'userInfo', type: 'table' }
      ],
      collapseItemConfig: [],
      form: {
        billNo: undefined,
        billName: undefined,
        billDeadline: undefined,
        billDesc: undefined,
        billSubNo: undefined,
        goodList: [],
        userList: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        billInfo: [
          {
            label: '单据编号',
            prop: 'billNo',
            type: 'input'
          },
          {
            label: '单据名称',
            prop: 'billName',
            type: 'input'
          },
          {
            label: '单据截止日期',
            prop: 'billDeadline',
            type: 'date',
            placeholder: '请选择单据最晚有效日期'
          },
          {
            label: '单据描述',
            prop: 'billDesc',
            type: 'textarea'
          }
        ],
        billExtraInfo: [
          {
            label: '子编号',
            prop: 'billSubNo',
            type: 'input'
          },
          {
            label: '子编号',
            prop: 'billSubNo',
            type: 'input'
          },
          {
            label: '子编号',
            prop: 'billSubNo',
            type: 'input'
          }
        ],
        goodsInfo: {
          prop: 'goodList',
          column: [
            {
              label: '物料编号',
              prop: 'goodsNo',
              type: 'input'
            },
            {
              label: '物料名称',
              prop: 'goodsName',
              type: 'input'
            },
            {
              label: '物料过期日期',
              prop: 'goodsDeadLine',
              type: 'date'
            }
          ]
        },
        userInfo: {
          prop: 'userList',
          column: [
            {
              label: '用户编号',
              prop: 'userNo',
              type: 'input'
            },
            {
              label: '用户名称',
              prop: 'userName',
              type: 'input'
            },
            {
              label: '用户过期日期',
              prop: 'userDeadLine',
              type: 'date'
            }
          ]
        }
      }
    }
  }
}

</script>

