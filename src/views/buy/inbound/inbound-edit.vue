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
    <el-dialog
      title="请选择仓库"
      :visible.sync="warehouseDialogVisible"
      width="30%"
    >
      <el-form>
        <el-form-item prop="warehouseId" label="仓库">
          <el-select v-model="warehouseId" placeholder="请选择仓库">
            <el-option
              v-for="warehouse in javaCode['WarehouseBuilder']"
              :key="warehouse.value"
              :label="warehouse.label"
              :value="warehouse.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warehouseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleWarehouseDialog">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import FormTable from '@/components/FormTable/index.vue'
import { getProductInfoById } from '@/api/business/product-info'
import { getDictionary, getJavaCode } from '@/api/common/dict'
import { getInboundOrderById } from '@/api/business/inbound'
import { getVendorContactUserList } from '@/api/business/vendor'

export default {
  name: 'InboundEdit',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      contentText: '采购入库单修改',
      saveUrl: '/api/inbound-order/update',
      submitUrl: '/api/inbound-order/update-and-submit-single',
      warehouseDialogVisible: false,
      warehouseId: undefined,
      canSubmit: true,
      collapseConfig: [
        { active: true, title: '基本信息', name: 'baseInfo', type: 'form' },
        { active: true, title: '物料信息', name: 'goodsInfo', type: 'table' }
      ],
      form: {
        inboundCode: undefined,
        inboundTime: new Date(),
        vendorId: undefined,
        vendorName: undefined,
        procurementUserId: undefined,
        procurementUsername: undefined,
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
        javaCodeNameList: ['VendorBuilder', 'UserBuilder', 'ProductBuilder', 'WarehouseBuilder', 'OrderBuilder']
      },
      vendorContactList: []
    }
  },
  watch: {
    'form.inboundOrderItemList.length': {
      handler(newVal, oldVal) {
        if (newVal === 0) {
          // 数组为空
          this.form.afterDiscountPayAmount = 0
          this.form.discountAmount = 0
        } else {
          let temp = 0
          if (this.form.discountRate !== undefined) {
            this.form.inboundOrderItemList.forEach((ele) => {
              temp = this.$math.add(ele.taxTotalAmount, temp)
            })
            this.form.discountAmount = this.$math.format(this.$math.multiply(this.$math.multiply(this.form.discountRate, 0.01), temp), { precision: 2, notation: 'fixed' })
            this.form.afterDiscountPayAmount = this.$math.format(this.$math.subtract(temp, this.form.discountAmount), { precision: 2, notation: 'fixed' })
          }
        }
      },
      deep: true
    },
    'form.vendorId': {
      handler(newVal, oldVal) {
        getVendorContactUserList(newVal).then(res => {
          this.vendorContactList.length = 0
          res.data.forEach(item => {
            this.vendorContactList.push(item)
          })
        })
      }
    }
  },
  async created() {
    await getDictionary(this.dictionaryConfig).then(res => {
      this.dictionary = res.data
    })
    await getJavaCode(this.javaCodeConfig).then(res => {
      this.javaCode = res.data
    })
    await getInboundOrderById(this.$route.params.id).then(res => {
      Object.assign(this.form, res.data)
    })
    await this.init()
  },
  methods: {
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '采购订单',
            prop: 'orderCode',
            type: 'input',
            disabled: true
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
            options: this.javaCode['VendorBuilder'],
            disabled: true
          },
          {
            label: '采购人员',
            prop: 'procurementUsername',
            type: 'input',
            disabled: true
          },
          {
            label: '折扣率',
            prop: 'discountRate',
            type: 'inputNumber',
            disabled: true
          },
          {
            label: '折扣金额',
            prop: 'discountAmount',
            type: 'inputNumber',
            disabled: true
          },
          {
            label: '折扣后应付金额',
            prop: 'afterDiscountPayAmount',
            type: 'inputNumber',
            disabled: true
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
              },
              fixed: 'left'
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
              type: 'number',
              input: (newNumber, currentRow) => {
                if (currentRow.procurementPrice) {
                  // 设置折扣额
                  currentRow.discountAmount = this.computeDiscountAmount(currentRow.procurementPrice, currentRow.discountRate, newNumber)
                  // 折扣额设置完成后，设置采购金额
                  currentRow.procurementAmount = this.computeProcurementAmount(currentRow.procurementPrice, newNumber, currentRow.discountAmount)
                  // 设置税额
                  currentRow.taxAmount = this.computeTaxAmount(currentRow.procurementAmount, currentRow.taxRate)
                  // 设置税价合计
                  currentRow.taxTotalAmount = this.computeTaxTotalAmount(currentRow.procurementAmount, currentRow.taxAmount)
                }
              }
            },
            {
              label: '单位',
              prop: 'unit',
              type: 'selectConstant',
              optionList: this.dictionary['Unit']
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
              },
              showButton: true,
              buttonClick: () => {
                this.warehouseDialogVisible = true
              },
              buttonText: '批量设置'
            }
          ],
          showSummary: true,
          totalColumns: ['discountAmount', 'procurementAmount', 'taxAmount', 'taxTotalAmount'],
          showProcurementProduct: true,
          procurementQueryForm: {
            orderId: this.form.orderId
          }
        }
      }
      this.showForm = true
    },
    computeDiscountAmount(procurementPrice, discountRate, number) {
      return this.$math.format(this.$math.multiply(this.$math.multiply(procurementPrice, discountRate * 0.01), number), { precision: 2, notation: 'fixed' })
    },
    computeProcurementAmount(procurementPrice, number, discountAmount) {
      return this.$math.format(this.$math.subtract(this.$math.multiply(procurementPrice, number), discountAmount), { precision: 2, notation: 'fixed' })
    },
    computeTaxAmount(procurementAmount, taxRate) {
      return this.$math.format(this.$math.multiply(procurementAmount, taxRate * 0.01), { precision: 2, notation: 'fixed' })
    },
    computeTaxTotalAmount(procurementAmount, taxAmount) {
      return this.$math.format(this.$math.add(procurementAmount, taxAmount), { precision: 2, notation: 'fixed' })
    },
    computeTaxIncludePrice(procurementPrice, taxRate) {
      return this.$math.format(this.$math.multiply(procurementPrice, this.$math.add(1, taxRate * 0.01)), { precision: 2, notation: 'fixed' })
    },
    handleWarehouseDialog() {
      const obj = this.javaCode['WarehouseBuilder'].find(item => {
        if (item.value == this.warehouseId) {
          return item
        }
      })
      const tempArr = []
      this.form.inboundOrderItemList.forEach((ele, index) => {
        ele.warehouseId = this.warehouseId
        ele.warehouseName = obj.label
        tempArr.push(ele)
      })
      this.form.inboundOrderItemList = tempArr
      this.warehouseDialogVisible = false
      this.warehouseId = undefined
    },
    saveFun() {
      if (this.form.inboundOrderItemList.length === 0) {
        this.$modal.msgWarning('请至少选择一项产品')
        return false
      }
      return true
    }
  }
}

</script>
