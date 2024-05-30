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
import {getDictionary, getJavaCode} from '@/api/common/dict'
import {getProductInfoById} from '@/api/business/product-info'
import {getVendorContactUserList} from '@/api/business/vendor'
import {getOrderById} from '@/api/business/order'

export default {
  name: 'OrderEdit',
  components: { FormTable },
  data() {
    return {
      showForm: false,
      warehouseId: undefined,
      contentText: '采购订单修改',
      saveUrl: '/api/order/update',
      submitUrl: '/api/order/update-and-submit-single',
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
        discountRate: 0,
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
          orderCode: [{ required: true, message: '请输入采购订单编号', trigger: 'blur' }],
          orderTime: [{ required: true, message: '请选择单据时间', trigger: 'blur' }],
          deliveryDate: [{ required: true, message: '请选择交货日期', trigger: 'blur' }],
          vendorId: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
          procurementUserId: [{ required: true, message: '请选择采购人员', trigger: 'blur' }],
          contractCode: [{ required: true, message: '请输入采购合同号', trigger: 'blur' }]
        },
        goodsInfo: {
          productId: [{ required: true, message: '请选择产品', trigger: 'blur' }],
          discountRate: [{ required: true, message: '请输入折扣率', trigger: 'blur' }],
          taxRate: [{ required: true, message: '请输入税率', trigger: 'blur' }],
          warehouseId: [{ required: true, message: '请选择仓库', trigger: 'blur' }]
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
        javaCodeNameList: ['UserBuilder', 'VendorBuilder', 'ProductBuilder', 'WarehouseBuilder', 'SaleOrderBuilder']
      },
      vendorContactList: [],
      saleOrderDisabled: false,
      warehouseDialogVisible: false
    }
  },
  watch: {
    'form.discountRate': {
      handler(newVal, oldVal) {
        let temp = 0
        this.form.orderItemList.forEach((ele) => {
          temp = this.$math.add(ele.taxTotalAmount, temp)
        })
        if (newVal === '0') {
          this.form.discountAmount = 0
          this.form.afterDiscountPayAmount = this.$math.format(temp, { precision: 2, notation: 'fixed' })
        } else {
          this.form.discountAmount = this.$math.format(this.$math.multiply(newVal * 0.01, temp), {
            precision: 2,
            notation: 'fixed'
          })
          this.form.afterDiscountPayAmount = this.$math.format(this.$math.subtract(temp, this.form.discountAmount), {
            precision: 2,
            notation: 'fixed'
          })
        }
      },
      immediate: true,
      deep: true
    },
    'form.orderItemList.length': {
      handler(newVal, oldVal) {
        if (newVal === 0 || newVal === undefined) {
          // 数组为空
          this.form.afterDiscountPayAmount = 0
          this.form.discountAmount = 0
        } else {
          let temp = 0
          if (this.form.discountRate !== undefined) {
            this.form.orderItemList.forEach((ele) => {
              temp = this.$math.add(ele.taxTotalAmount, temp)
            })
            this.form.discountAmount = this.$math.format(this.$math.multiply(this.$math.multiply(this.form.discountRate, 0.01), temp), {
              precision: 2,
              notation: 'fixed'
            })
            this.form.afterDiscountPayAmount = this.$math.format(this.$math.subtract(temp, this.form.discountAmount), {
              precision: 2,
              notation: 'fixed'
            })
          }
        }
      },
      deep: true
    }
  },
  async created() {
    await getOrderById(this.$route.params.id).then(res => {
      Object.assign(this.form, res.data)
      this.form.saleOrderId = res.data.saleOrderId.split(',')
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
  methods: {
    handleWarehouseDialog() {
      const obj = this.javaCode['WarehouseBuilder'].find(item => {
        if (item.value == this.warehouseId) {
          return item
        }
      })
      const tempArr = []
      this.form.orderItemList.forEach((ele, index) => {
        ele.warehouseId = this.warehouseId
        ele.warehouseName = obj.label
        tempArr.push(ele)
      })
      this.form.orderItemList = tempArr
      this.warehouseDialogVisible = false
    },
    initParams() {
      if (this.$route.params.saleOrderId) {
        this.form.saleOrderId = this.$route.params.saleOrderId
        this.form.saleOrderCode = this.$route.params.saleOrderCode
        this.saleContractDisabled = true
      }
    },
    init() {
      this.collapseItemConfig = {
        baseInfo: [
          {
            label: '销售订单',
            prop: 'saleOrderId',
            type: 'select',
            bundle: {
              label: 'saleOrderId',
              value: 'saleOrderCode'
            },
            options: this.javaCode['SaleOrderBuilder'],
            disabled: this.saleOrderDisabled,
            multiple: true
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
            type: 'inputNumber',
            disabled: true
          },
          {
            label: '优惠后应付款(元)',
            prop: 'afterDiscountPayAmount',
            type: 'inputNumber',
            disabled: true
          }
        ],
        goodsInfo: {
          prop: 'orderItemList',
          column: [
            {
              label: '产品名称',
              prop: 'productName',
              type: 'select',
              fixed: 'left',
              optionList: this.javaCode['ProductBuilder'],
              click: (event, row) => {
                if (event === undefined || event === '') {

                } else {
                  getProductInfoById(event).then(res => {
                    const { data } = res
                    row.productName = data.productName
                    row.productId = data.productId
                    row.productCode = data.productCode
                    row.barCode = data.barCode
                    row.specification = data.specification
                    row.productDescription = data.productDescription
                    row.unit = data.unit
                  })
                }
              }
            },
            {
              label: '产品编码',
              prop: 'productCode',
              type: 'input',
              fixed: 'left'
            },
            {
              label: '产品条码',
              prop: 'barCode',
              type: 'input'
            },
            {
              label: '规格',
              prop: 'specification',
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
              type: 'number',
              input: (newNumber, currentRow) => {
                currentRow.taxIncludedPrice = this.computeTaxIncludePrice(newNumber, currentRow.taxRate)
                // 有数量
                if (currentRow.amount) {
                  // 设置折扣额
                  currentRow.discountAmount = this.computeDiscountAmount(newNumber, currentRow.discountRate, currentRow.amount)
                  // 折扣额设置完成后，设置采购金额
                  currentRow.procurementAmount = this.computeProcurementAmount(newNumber, currentRow.amount, currentRow.discountAmount)
                  // 设置税额
                  currentRow.taxAmount = this.computeTaxAmount(currentRow.procurementAmount, currentRow.taxRate)
                  // 设置税价合计
                  currentRow.taxTotalAmount = this.computeTaxTotalAmount(currentRow.procurementAmount, currentRow.taxAmount)
                }
              }
            },
            {
              label: '含税价(元)',
              prop: 'taxIncludedPrice',
              type: 'number'
            },
            {
              label: '折扣率(%)',
              prop: 'discountRate',
              type: 'number',
              defaultValue: 0,
              input: (newNumber, currentRow) => {
                if (currentRow.amount) {
                  if (currentRow.procurementPrice) {
                    // 有数量 有折扣率
                    // 设置折扣额
                    currentRow.discountAmount = this.computeDiscountAmount(currentRow.procurementPrice, newNumber, currentRow.amount)
                    // 折扣额设置完成后，设置采购金额
                    currentRow.procurementAmount = this.computeProcurementAmount(currentRow.procurementPrice, currentRow.amount, currentRow.discountAmount)
                    // 设置税额
                    currentRow.taxAmount = this.computeTaxAmount(currentRow.procurementAmount, currentRow.taxRate)
                    // 设置税价合计
                    currentRow.taxTotalAmount = this.computeTaxTotalAmount(currentRow.procurementAmount, currentRow.taxAmount)
                  }
                }
              }
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
              label: '税率(%)',
              prop: 'taxRate',
              type: 'number',
              defaultValue: this.$store.state.businessParam.taxRate,
              input: (newNumber, currentRow) => {
                if (currentRow.amount) {
                  if (currentRow.procurementPrice) {
                    // 设置含税价
                    currentRow.taxIncludedPrice = this.computeTaxIncludePrice(currentRow.procurementPrice, newNumber)
                    // 设置折扣额
                    currentRow.discountAmount = this.computeDiscountAmount(currentRow.procurementPrice, currentRow.discountRate, currentRow.amount)
                    // 折扣额设置完成后，设置采购金额
                    currentRow.procurementAmount = this.computeProcurementAmount(currentRow.procurementPrice, currentRow.amount, currentRow.discountAmount)
                    // 设置税额
                    currentRow.taxAmount = this.computeTaxAmount(currentRow.procurementAmount, newNumber)
                    // 设置税价合计
                    currentRow.taxTotalAmount = this.computeTaxTotalAmount(currentRow.procurementAmount, currentRow.taxAmount)
                  }
                }
              }
            },
            {
              label: '税额(元)',
              prop: 'taxAmount',
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
          totalColumns: ['discountAmount', 'procurementAmount', 'taxAmount', 'taxTotalAmount'],
          showSummary: true,
          showButton: true
        }
      }
      this.showForm = true
    },
    computeDiscountAmount(procurementPrice, discountRate, number) {
      return this.$math.format(this.$math.multiply(this.$math.multiply(procurementPrice, discountRate * 0.01), number), {
        precision: 2,
        notation: 'fixed'
      })
    },
    computeProcurementAmount(procurementPrice, number, discountAmount) {
      return this.$math.format(this.$math.subtract(this.$math.multiply(procurementPrice, number), discountAmount), {
        precision: 2,
        notation: 'fixed'
      })
    },
    computeTaxAmount(procurementAmount, taxRate) {
      return this.$math.format(this.$math.multiply(procurementAmount, taxRate * 0.01), {
        precision: 2,
        notation: 'fixed'
      })
    },
    computeTaxTotalAmount(procurementAmount, taxAmount) {
      return this.$math.format(this.$math.add(procurementAmount, taxAmount), { precision: 2, notation: 'fixed' })
    },
    computeTaxIncludePrice(procurementPrice, taxRate) {
      return this.$math.format(this.$math.multiply(procurementPrice, this.$math.add(1, taxRate * 0.01)), {
        precision: 2,
        notation: 'fixed'
      })
    },
    saveFun() {
      if (this.form.orderItemList.length === 0) {
        this.$modal.msgWarning('请至少选择一项产品')
        return false
      }
      this.form.saleOrderId = this.form.saleOrderId.join(',')
      return true
    }
  }
}

</script>
