<template>
  <div>
    <el-table
      ref="table"
      v-loading="loading"
      :border="border"
      :data="tableData"
      :height="height"
      :max-height="maxHeight"
      :row-class-name="rowClassNameMethod"
      :show-summary="showSummary"
      :span-method="spanMethod"
      :stripe="stripe"
      :summary-method="summaryMethod"
      default-expand-all
      row-key="id"
      :tree-props="treeConfig"
      style="width: 100%"
    >
      <template v-for="column in tableColumnConfig">
        <!--    操作列    -->
        <el-table-column
          v-if="column.columnType === 'Operation'"
          :label="column.label"
          :min-width="250"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-for="button in column.button"
              :disabled="button.isDisabled(scope.row)"
              :type="button.css"
              plain
              size="mini"
              @click="button.click(scope.$index, scope.row)"
            >
              {{ button.text }}
            </el-button>
          </template>
        </el-table-column>
        <!--    索引    -->
        <el-table-column
          v-else-if="column.columnType === 'Index'"
          :type="column.type ? column.type : 'selection'"
          align="center"
        >
        </el-table-column>
        <!--    字典替换    -->
        <el-table-column
          v-else-if="column.columnType === 'Dictionary'"
          :fixed="column.fixed ? column.fixed : false"
          :label="column.label ? column.label : ''"
          :min-width="180"
          :prop="column.prop ? column.prop : undefined"
          :show-overflow-tooltip="true"
          :sortable="column.sortable ? column.sortable : false"
          :type="column.type ? column.type : undefined"
        >
          <template slot-scope="dictionaryScope">
            {{ dictionaryConvert(column.dict.dictList, dictionaryScope.row[dictionaryScope.column.property]) }}
          </template>
        </el-table-column>
        <!--    常量替换替换    -->
        <el-table-column
          v-else-if="column.columnType === 'Constant'"
          :fixed="column.fixed ? column.fixed : false"
          :label="column.label ? column.label : ''"
          :min-width="180"
          :prop="column.prop ? column.prop : undefined"
          :show-overflow-tooltip="true"
          :sortable="column.sortable ? column.sortable : false"
          :type="column.type ? column.type : undefined"
        >
          <template slot-scope="constantScope">
            <el-tag
              :disable-transitions="column.constant.disableTransitions ? column.constant.disableTransitions : false"
              :hit="column.constant.hit ? column.constant.hit : false"
              :color="column.constant.color ? column.constant.color : ''"
              :size="column.constant.size ? column.constant.size : 'medium'"
              :effect="column.constant.effect ? column.constant.effect : 'plain'"
              :type="column.constant.type(constantScope.row)"
            >
              {{ constantConvert(column.constant.constantList, constantScope.row[constantScope.column.property]) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="column.columnType === 'Icon'"
          :fixed="column.fixed ? column.fixed : false"
          :label="column.label ? column.label : ''"
          :min-width="180"
          :prop="column.prop ? column.prop : undefined"
          :show-overflow-tooltip="true"
          :sortable="column.sortable ? column.sortable : false"
          :type="column.type ? column.type : undefined"
        >
          <template slot-scope="iconScope">
            <svg-icon :icon-class="iconScope.row[iconScope.column.property]" />
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="column.columnType === 'Money'"
          :fixed="column.fixed ? column.fixed : false"
          :label="column.label ? column.label + getCurrencyUnitLabel() : ''"
          :min-width="180"
          :prop="column.prop ? column.prop : undefined"
          :show-overflow-tooltip="true"
          :sortable="column.sortable ? column.sortable : false"
          :type="column.type ? column.type : undefined"
        >
          <template slot-scope="moneyScope">
            {{ convertMoney(column.money, moneyScope.row[moneyScope.column.property]) }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="column.columnType === 'Link'"
          :fixed="column.fixed ? column.fixed : false"
          :label="column.label ? column.label : ''"
          :min-width="180"
          :prop="column.prop ? column.prop : undefined"
          :show-overflow-tooltip="true"
          :sortable="column.sortable ? column.sortable : false"
          :type="column.type ? column.type : undefined"
        >
          <template slot-scope="linkScope">
            <el-link type="primary" @click.native="column.link.click(linkScope.$index, linkScope.row)"> {{ linkScope.row[linkScope.column.property] }} </el-link>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="column.columnType === 'Tag'"
          :fixed="column.fixed ? column.fixed : false"
          :label="column.label ? column.label : ''"
          :min-width="180"
          :prop="column.prop ? column.prop : undefined"
          :show-overflow-tooltip="true"
          :sortable="column.sortable ? column.sortable : false"
          :type="column.type ? column.type : undefined"
        >
          <template slot-scope="tagScope">
            <template v-if="column.tag.tagType === 'Array'">
              <template v-for="tag in tagScope.row[tagScope.column.property]">
                <el-tag
                  :type="column.tag.type(tag)"
                  :disable-transitions="column.tag.disableTransitions ? column.tag.disableTransitions : false"
                  :hit="column.tag.hit ? column.tag.hit : false"
                  :color="column.tag.color ? column.tag.color : ''"
                  :size="column.tag.size ? column.tag.size : 'medium'"
                  :effect="column.tag.effect ? column.tag.effect : 'plain'"
                  @click.native="column.tag.click ? column.tag.click(tagScope.$index, tagScope.row) : undefined"
                  style="margin-left: 5px;margin-right: 0"
                >
                  <template v-if="column.tag.isConvert">
                    {{ dictionaryConvert(column.tag.dictList, tag) }}
                  </template>
                  <template v-else>
                    {{ tag }}
                  </template>
                </el-tag>
              </template>
            </template>
            <template v-else>
              <el-tag
                :type="column.tag.type(tagScope.row[tagScope.column.property])"
                :disable-transitions="column.tag.disableTransitions ? column.tag.disableTransitions : false"
                :hit="column.tag.hit ? column.tag.hit : false"
                :color="column.tag.color ? column.tag.color : ''"
                :size="column.tag.size ? column.tag.size : 'medium'"
                :effect="column.tag.effect ? column.tag.effect : 'plain'"
                @click.native="column.tag.click ? column.tag.click(tagScope.$index, tagScope.row) : undefined"
                style="margin-left: 5px;margin-right: 0"
              >
                <template v-if="column.tag.isConvert">
                  {{ dictionaryConvert(column.tag.dictList, tagScope.row[tagScope.column.property]) }}
                </template>
                <template v-else>
                  {{ tagScope.row[tagScope.column.property] }}
                </template>
              </el-tag>
            </template>
          </template>
        </el-table-column>
        <!--    普通展示项    -->
        <el-table-column
          v-else
          :fixed="column.fixed ? column.fixed : false"
          :label="column.label ? column.label : ''"
          :prop="column.prop ? column.prop : undefined"
          :show-overflow-tooltip="true"
          :sortable="column.sortable ? column.sortable : false"
          :type="column.type ? column.type : undefined"
          min-width="180"
        >
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="pageable"
      :current-page="current"
      :page-size="size"
      :page-sizes="[10, 20, 30, 50, 100]"
      :total.sync="total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>

import request from '@/utils/request'
import { queryUserInfoById } from '@/api/config/user'

export default {
  name: 'PageTable',
  props: {
    /**
     * fixed: {
     *   type: String,Boolean
     * }
     * Temp: right, left, true, false
     *
     * sortable: {
     *   type: Boolean
     * }
     *
     * tag: {
     *   css: 'primary'、'success'...
     *   disableTransitions: Boolean
     * }
     */
    tableColumnConfig: {
      type: Array,
      required: true
    },
    /**
     * 斑马纹
     */
    stripe: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * 行具有状态,指定了默认样式,自定义方法返回以下值:
     * warning-row success-row
     */
    rowClassName: {
      type: Function,
      required: false,
      default: () => {

      }
    },
    maxHeight: {
      type: String,
      required: false,
      default: '100%'
    },
    showSummary: {
      type: Boolean,
      required: false,
      default: false
    },
    summaryMethod: {
      type: Function,
      required: false,
      default: () => {

      }
    },
    spanMethod: {
      type: Function,
      required: false,
      default: () => {

      }
    },
    border: {
      type: Boolean,
      required: false,
      default: false
    },
    dataSource: {
      type: String,
      required: true
    },
    queryForm: {
      type: Object,
      required: true
    },
    tagType: {
      type: String,
      required: false
    },
    treeConfig: {
      type: Object,
      required: false
    },
    pageable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      tableData: [],
      total: 0,
      size: 10,
      current: 1,
      height: 800,
      screenHeight: window.innerHeight,
      loading: true
    }
  },
  created() {
    this.list()
  },
  watch: {
    screenHeight(val) {
      this.screenHeight = val
      this.height = this.screenHeight - 500
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        window.screenHeight = window.innerHeight
        this.screenHeight = window.screenHeight
      })
    }
  },
  methods: {
    list() {
      this.loading = true
      this.$set(this.queryForm, 'size', this.size)
      this.$set(this.queryForm, 'current', this.current)
      request({
        url: this.dataSource,
        method: 'post',
        data: this.queryForm
      }).then(res => {
        const { data, total, currentPage, pageSize } = res
        this.tableData = data
        this.total = total
        this.size = pageSize
        this.current = currentPage
        this.loading = false
      })
    },
    checkedRows() {
      return this.$refs.table.selection
    },
    checkedRowIds() {
      const selection = this.$refs.table.selection
      const idArr = []
      selection.forEach(function(ele) {
        idArr.push(ele.id)
      })
      return idArr
    },
    handleSizeChange(val) {
      this.size = val
      this.list()
    },
    handleCurrentChange(val) {
      this.current = val
      this.list()
    },
    rowClassNameMethod({ row, rowIndex }) {
      this.rowClassName(rowIndex, row)
    },
    dictionaryConvert(dictList, originValue) {
      for (let i = 0; i < dictList.length; i++) {
        // 兼容，String Integer
        if (dictList[i].value == originValue) {
          return dictList[i].label
        }
      }
    },
    constantConvert(constantList, originValue) {
      for (let i = 0; i < constantList.length; i++) {
        // 兼容，String Integer
        if (constantList[i].value == originValue) {
          return constantList[i].label
        }
      }
    },
    /**
     * 金钱转换
     * @param moneyConfig 配置
     * @param originMoney 原始金额(币种为系统预设币种)
     */
    convertMoney(moneyConfig, originMoney) {
      if (!originMoney) {
        const zero = 0;
        return zero.toFixed(6)
      }
      return originMoney.toFixed(6)
    },
    getCurrencyUnitLabel() {
      return '(' + this.$store.getters.currency + '/' + this.$store.getters.currencySymbol + ')'
    }

  }
}
</script>

<style>

</style>
