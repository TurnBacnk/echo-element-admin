<template>
  <div>
    <el-button v-if="showButton" type="primary" style="margin-bottom: 10px" size="mini" @click="addRow">添加行</el-button>
    <el-button v-if="showButton" type="primary" size="mini" @click="handleImport">批量导入</el-button>
    <el-button v-if="showProduct" type="primary" size="mini" @click="showProductDialog = true">批量选择</el-button>
    <el-button v-if="showProcurementProduct" type="primary" size="mini" @click="procurementDialog = true">源单产品</el-button>
    <el-button v-if="showReturn" type="primary" size="mini" @click="returnDialog = true">源单产品</el-button>
    <product-info-select :selected.sync="formData.tableData" :show-dialog.sync="showProductDialog" @update:selected="updateTableData" :is-sale="true"/>
    <product-info-select :selected.sync="formData.tableData" :show-dialog.sync="procurementDialog" :query-form="procurementQueryForm" :form-data="data" :data-source="procurementDataSource" @update:selected="updateTableData" :is-sale="false"/>
    <product-info-select :selected.sync="formData.tableData" :show-dialog.sync="returnDialog" :query-form="returnQueryForm" :form-data="data" :data-source="returnDataSource" @update:selected="updateTableData" :is-sale="false"/>
    <el-form ref="editTableForm" :model="formData" :rules="rules" size="small" :disabled="isView">
      <el-table :data="formData.tableData" style="width: 100%" row-key="id" :show-summary="showSummary" :summary-method="handleSummary" border :row-style="{ height: '10px'}" :cell-style="{ padding: '0px' }">
        <el-table-column :type="tableConfig.indexType" fixed="left" width="50" />
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :fixed="column.fixed ? column.fixed : undefined"
          show-overflow-tooltip
        >
          <template v-slot:header="scope">
            <span>{{ column.label }}</span>
            <el-button v-if="column.showButton" type="text" size="mini" @click="column.buttonClick">{{ column.buttonText }}</el-button>
          </template>
          <template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.' + column.prop" :rules="rules[column.prop]">
              <div @dblclick="editCell(scope.row, column.prop, scope.$index)">
                <div v-if="scope.row._editingColumn === column.prop">
                  <el-input v-if="column.type === 'input'" :ref="'input-' + scope.$index + '-' + column.prop" v-model="scope.row[column.prop]" size="small" :disabled="column.disabled" @input="handleInputChange($event, scope.row, column)" @blur="saveCell(scope.row, column.prop)" />
                  <el-input v-if="column.type === 'number'" :ref="'input-' + scope.$index + '-' + column.prop" v-model="scope.row[column.prop]" size="small" :disabled="column.disabled" @input="handleInputChange($event, scope.row, column)" @blur="saveCell(scope.row, column.prop)" />
                  <el-input v-if="column.type === 'phone'" :ref="'input-' + scope.$index + '-' + column.prop" v-model="scope.row[column.prop]" size="small" :disabled="column.disabled" @input="handleInputChange($event, scope.row, column)" @blur="saveCell(scope.row, column.prop)" />
                  <el-date-picker v-if="column.type === 'date'" :ref="'input-' + scope.$index + '-' + column.prop" v-model="scope.row[column.prop]" type="date" :disabled="column.disabled" value-format="yyyy-MM-dd" size="small" style="width: 100%" @change="saveCell(scope.row, column.prop)" />
                  <el-autocomplete
                    v-if="column.type === 'autoComplete'"
                    :ref="'input-' + scope.$index + '-' + column.prop"
                    v-model="scope.row[column.prop]"
                    class="inline-input"
                    :fetch-suggestions="column.completeFun"
                    :placeholder="column.placeholder ? column.placeholder : '请输入内容'"
                    style="width: 100%"
                    @blur="saveCell(scope.row, column.prop)"
                  />
                  <el-switch v-if="column.type === 'switch'" :ref="'input-' + scope.$index + '-' + column.prop" v-model="scope.row[column.prop]" size="small" :active-value="1" :inactive-value="0" @blur="saveCell(scope.row, column.prop)" />
                  <el-select v-if="column.type === 'select'" :ref="'input-' + scope.$index + '-' + column.prop" v-model="scope.row[column.prop]" filterable :disabled="column.disabled" clearable style="width: 100%" @change="handleSelectChange($event, scope.row, column, column.prop)">
                    <el-option
                      v-for="item in column.optionList"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value"
                      @blur="saveCell(scope.row, column.prop)"
                    />
                  </el-select>
                  <el-select v-if="column.type === 'selectTemplate'" :ref="'input-' + scope.$index + '-' + column.prop" v-model="scope.row[column.prop]" filterable :disabled="column.disabled" clearable style="width: 100%" @change="handleSelectChange($event, scope.row, column, column.prop)">
                    <el-option
                      v-for="item in column.optionList"
                      :key="item.key"
                      :label="item.rightLabel"
                      :value="item.value"
                      @blur="saveCell(scope.row, column.prop)"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.rightLabel }}</span>
                    </el-option>
                  </el-select>
                  <el-select v-if="column.type === 'selectConstant'" :ref="'input-' + scope.$index + '-' + column.prop" v-model="scope.row[column.prop]" filterable clearable :disabled="column.disabled" style="width: 100%" @change="saveCell(scope.row, column.prop)">
                    <el-option
                      v-for="item in column.optionList"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div v-else>
                  <el-switch v-if="column.type === 'switch'" v-model="scope.row[column.prop]" size="small" :active-value="1" :inactive-value="0" :disabled="true" />
                  <template v-else-if="column.type === 'selectConstant'">
                    {{ convertConstant(scope.row[column.prop], column.optionList) }}
                  </template>
                  <template v-if="column.type !== 'switch' && column.type !== 'selectConstant'">
                    {{ displayItem(scope.row, column.prop) }}
                  </template>
                </div>
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column v-if="showOperation" label="操作" width="70" fixed="right">
          <template v-slot="scope">
<!--            <el-button size="mini" @click="toggleEdit(scope.row, scope.$index)">-->
<!--              {{ scope.row._isEditing ? '保存' : '编辑' }}-->
<!--            </el-button>-->
            <el-button size="mini" type="danger" @click="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import ProductInfoSelect from '@/components/FormTable/components/product-info-select.vue'

export default {
  name: 'EditTable',
  components: { ProductInfoSelect },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    tableConfig: {
      type: Object,
      default: function() {
        return {
          indexType: 'index'
        }
      }
    },
    rules: {
      type: Object,
      default: () => {}
    },
    // eslint-disable-next-line vue/require-default-prop
    totalColumns: {
      type: Array,
      required: false
    },
    sumText: {
      type: String,
      required: false,
      default: () => '合计'
    },
    // eslint-disable-next-line vue/require-default-prop
    buttons: {
      type: Array,
      required: false
    },
    showSummary: Boolean,
    isView: Boolean,
    showButton: Boolean,
    showProduct: {
      type: Boolean,
      default: false
    },
    showProcurementProduct: {
      type: Boolean,
      default: false
    },
    procurementQueryForm: {
      type: Object,
      default: () => {}
    },
    showReturn: {
      type: Boolean,
      default: false
    },
    returnQueryForm: {
      type: Object,
      default: () => {}
    },
    showOperation: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const initData = this.data.map(item => ({
      ...item,
      _isEditing: false
    }))
    return {
      editingIndex: null,
      formData: {
        tableData: initData
      },
      showProductDialog: false,
      procurementDialog: false,
      returnDialog: false,
      procurementDataSource: '/api/product-info/procurement-product/list',
      returnDataSource: '/api/product-info/return-product/list'
    }
  },
  watch: {
    'data': {
      handler(newVal, oldVal) {
        this.formData.tableData = newVal.map(item => ({
          ...item,
          _isEditing: false
        }))
      }
    }
  },
  created() {
  },
  methods: {
    editCell(row, prop, index) {
      this.$set(row, '_editingColumn', prop)
      row._isEditing = true
      this.$nextTick(() => {
        const input = this.$refs['input-' + index + '-' + prop]
        if (input && input[0]) {
          input[0].focus()
        } else if (input) {
          input.focus()
        }
      })
    },
    saveCell(row, prop) {
      this.$set(row, '_editingColumn', null)
      row._isEditing = false
      this.$emit('update:data', this.formData.tableData)
    },
    handleImport() {
    },
    addRow() {
      const newRow = this.columns.reduce((acc, column) => {
        // 添加默认值
        acc[column.prop] = column.defaultValue !== undefined ? column.defaultValue : undefined
        return acc
      }, { _editingColumn: null ,_isEditing: true })
      this.formData.tableData.push(newRow)
      this.editingIndex = this.formData.tableData.length - 1
    },
    toggleEdit(row, index) {
      if (row._isEditing) {
        // 编辑状态，需要保存
        // 变为非编辑状态
        this.$refs.editTableForm.validate((valid) => {
          if (valid) {
            this.$emit('update:data', this.formData.tableData)
          } else {
            this.$modal.msgWarning('请检查输入是否正确')
          }
        })
      } else {
        // 非编辑状态，变为编辑状态
        // 判断是否有未保存的项
        if (this.editingIndex !== null) {
          this.$modal.msgWarning('请先保存当前编辑项')
          return
        }
        // 判断通过则表示不存在编辑项
        // 将编辑索引记录为当前索引
        this.editingIndex = index
        // 切换当前行的编辑状态
        row._isEditing = !row._isEditing
      }
    },
    deleteRow(index) {
      this.formData.tableData.splice(index, 1)
      this.editingIndex = null
      this.$emit('update:data', this.formData.tableData)
    },
    updateTableData(selectedItems) {
      this.formData.tableData = this.data.concat(selectedItems)
      this.$emit('update:data', this.formData.tableData)
    },
    handleInputChange(event, row, column) {
      if (column.input) {
        column.input(event, row)
      }
      return event
    },
    handleNumberInputChange(event, row, column) {
      if (column.input) {
        column.input(event, row)
      }
      return event.replace(/[^0-9.]/g, '')
    },
    handleSummary(param) {
      if (this.showSummary) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = this.sumText
            return
          }
          if (this.totalColumns.includes(column.property)) {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return this.$math.format(this.$math.add(prev, curr), { precision: 2, notation: 'fixed' })
                } else {
                  return prev
                }
              }, 0)
              sums[index] += ' 元'
            } else {
              sums[index] = 'N/A'
            }
          }
        })
        return sums
      }
    },
    convertConstant(value, optionList) {
      const obj = optionList.find(item => {
        if (item.value == value) {
          return item
        }
      })
      return obj === undefined ? 'N/A' : obj.label
    },
    displayItem(row, prop) {
      console.log('123')
      if (row[prop] === 0) {
        return row[prop]
      }
      if (row[prop]) {
        return row[prop]
      } else {
        return 'N/A'
      }
    },
    handleSelectChange(event, row, column, prop) {
      column.click(event, row).then(res => {
        this.saveCell(row, prop)
      })
    },
    selectTemplateFilterMethod(query, item) {
      return item.rightLabel.toLowerCase().includes(query.toLowerCase())
    },
    validateTableData(canSave) {
      this.$refs.editTableForm.validate((valid) => {
        if (valid) {

        } else {
          this.$modal.msgWarning('请检查输入是否正确')
          canSave = false
        }
      })
    }
  }
}
</script>
