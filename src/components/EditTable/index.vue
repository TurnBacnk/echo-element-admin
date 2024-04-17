<template>
  <div>
    <el-button v-if="showButton" type="primary" style="margin-bottom: 10px" size="mini" @click="addRow">添加行</el-button>
    <el-button v-if="showButton" type="primary" size="mini" @click="handleImport">批量导入</el-button>
    <el-form ref="editTableForm" :model="formData" :rules="rules" size="small" :disabled="isView">
      <el-table :data="formData.tableData" style="width: 100%" max-height="500" row-key="id" :show-summary="true" :summary-method="handleSummary">
        <el-table-column :type="tableConfig.indexType" />
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
        >
          <template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.' + column.prop" :rules="rules[column.prop]">
              <div v-if="scope.row._isEditing">
                <el-input v-if="column.type === 'input'" v-model="scope.row[column.prop]" size="small" :disabled="column.disabled" @input="handleInputChange($event, scope.row, column)" />
                <el-input v-if="column.type === 'number'" v-model="scope.row[column.prop]" size="small" :disabled="column.disabled" @input="handleInputChange($event, scope.row, column)" />
                <el-input v-if="column.type === 'phone'" v-model="scope.row[column.prop]" size="small" :disabled="column.disabled" @input="handleInputChange($event, scope.row, column)" />
                <el-date-picker v-if="column.type === 'date'" v-model="scope.row[column.prop]" type="date" value-format="yyyy-MM-dd" size="small" style="width: 100%" />
                <el-autocomplete
                  v-if="column.type === 'autoComplete'"
                  v-model="scope.row[column.prop]"
                  class="inline-input"
                  :fetch-suggestions="column.completeFun"
                  :placeholder="column.placeholder ? column.placeholder : '请输入内容'"
                  style="width: 100%"
                />
                <el-switch v-if="column.type === 'switch'" v-model="scope.row[column.prop]" size="small" :active-value="1" :inactive-value="0" />
                <el-select v-if="column.type === 'select'" v-model="scope.row[column.prop]" filterable :disabled="column.disabled" style="width: 100%" @change="column.click($event, scope.row)">
                  <el-option
                    v-for="item in column.optionList"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select v-if="column.type === 'selectConstant'" v-model="scope.row[column.prop]" filterable :disabled="column.disabled" style="width: 100%" @change="column.click($event, scope.row)">
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
                  {{ scope.row[column.prop] }}
                </template>
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template v-slot="scope">
            <el-button size="mini" @click="toggleEdit(scope.row, scope.$index)">
              {{ scope.row._isEditing ? '保存' : '编辑' }}
            </el-button>
            <el-button size="mini" type="danger" @click="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'EditTable',
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
    totalColumns: {
      type: Array,
      required: false
    },
    sumText: {
      type: String,
      required: false,
      default: () => '合计'
    },
    showSummary: Boolean,
    isView: Boolean,
    showButton: Boolean
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
      }
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
    handleImport() {
    },
    addRow() {
      if (this.editingIndex !== null) {
        this.$modal.msgWarning('请先保存当前编辑项')
        return
      }
      const newRow = this.columns.reduce((acc, column) => {
        // 添加默认值
        acc[column.prop] = column.defaultValue !== undefined ? column.defaultValue : undefined
        return acc
      }, { _isEditing: true })
      this.formData.tableData.push(newRow)
      this.editingIndex = this.formData.tableData.length - 1
    },
    toggleEdit(row, index) {
      if (row._isEditing) {
        // 编辑状态，需要保存
        // 变为非编辑状态
        this.$refs.editTableForm.validate((valid) => {
          if (valid) {
            // 通过
            row._isEditing = !row._isEditing
            // 删除editingIndex
            this.editingIndex = null
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
      this.$emit('update:data', this.formData.tableData)
    },
    handleSelectChange(event) {

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
    },
    convertConstant(value, optionList) {
      const obj = optionList.find(item => {
        if (item.value === value) {
          return item
        }
      })
      return obj.label
    }
  }
}
</script>
