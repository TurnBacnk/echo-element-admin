<template>
  <div style="margin-bottom: 100px">
    <el-page-header :content="contentText" @back="goBack" />
    <el-collapse v-model="activeNames">
      <el-card v-for="config in collapseConfig" :key="config.name" style="margin: 10px;">
        <div slot="header" class="clearfix">
          <span>{{ config.title }}<i class="header-icon el-icon-info" /></span>
        </div>
        <el-collapse-item
          :name="config.name"
        >
          <div>
            <!--         form         -->
            <template v-if="config.type === 'form'">
              <el-form ref="form" :model="form" label-width="120px" :disabled="isView">
                <el-row>
                  <el-col v-for="itemConfig in collapseItemConfig[config.name]" :key="itemConfig.prop" :span="8">
                    <el-form-item
                      :label="itemConfig.label"
                      :prop="itemConfig.prop"
                      :rules="rules[config.name] ? rules[config.name][itemConfig.prop] : null"
                    >
                      <!--         input         -->
                      <el-input
                        v-if="itemConfig.type === 'input'"
                        v-model="form[itemConfig.prop]"
                        style="width: 90%"
                        :placeholder="itemConfig.placeholder ? itemConfig.placeholder : '请输入' + itemConfig.label"
                        :disabled="itemConfig.disabled"
                        clearable
                      />
                      <!--         inputNumber         -->
                      <el-input
                        v-if="itemConfig.type === 'inputNumber'"
                        v-model="form[itemConfig.prop]"
                        style="width: 90%"
                        oninput="value=value.replace(/[^0-9.]/g,'')"
                        :placeholder="itemConfig.placeholder ? itemConfig.placeholder : '请输入' + itemConfig.label"
                        maxlength="11"
                        :disabled="itemConfig.disabled"
                        clearable
                      />
                      <!--         date         -->
                      <el-date-picker
                        v-if="itemConfig.type === 'date'"
                        v-model="form[itemConfig.prop]"
                        type="date"
                        :placeholder="itemConfig.placeholder ? itemConfig.placeholder : '请选择' + itemConfig.label"
                        style="width: 90%"
                        value-format="yyyy-MM-dd"
                        clearable
                      />
                      <!--         number         -->
                      <el-input-number
                        v-if="itemConfig.type === 'number'"
                        v-model="form[itemConfig.prop]"
                        :min="1"
                        :disabled="itemConfig.disabled"
                      />
                      <!--         select         -->
                      <el-select
                        v-if="itemConfig.type === 'select'"
                        v-model="form[itemConfig.prop]"
                        :multiple="itemConfig.multiple === undefined ? false : itemConfig.multiple"
                        style="width: 90%"
                        filterable
                        :remote="itemConfig.remote ? itemConfig.remote : false"
                        :remote-method="itemConfig.remoteMethod ? itemConfig.remoteMethod : () => {}"
                        :disabled="itemConfig.disabled"
                        clearable
                        @change="handleSelectChange($event, itemConfig.bundle, itemConfig.options, itemConfig.clickConfig, itemConfig.optionValue)"
                      >
                        <el-option
                          v-for="option in itemConfig.options"
                          :key="itemConfig.optionValue ? option[itemConfig.optionValue] : option.value"
                          :label="itemConfig.optionLabel ? option[itemConfig.optionLabel] : option.label"
                          :value="itemConfig.optionValue ? option[itemConfig.optionValue] : option.value"
                        />
                      </el-select>
                      <!--         selectTemplate         -->
                      <el-select
                        v-if="itemConfig.type === 'selectTemplate'"
                        v-model="form[itemConfig.prop]"
                        :multiple="itemConfig.multiple === undefined ? false : itemConfig.multiple"
                        style="width: 90%"
                        filterable
                        :disabled="itemConfig.disabled"
                        clearable
                        @change="handleSelectChange($event, itemConfig.bundle, itemConfig.options, itemConfig.clickConfig, itemConfig.optionValue)"
                      >
                        <el-option
                          v-for="option in itemConfig.options"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        >
                          <span style="float: left">{{ option.label }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ option.rightLabel }}</span>
                        </el-option>
                      </el-select>
                      <el-select
                        v-if="itemConfig.type === 'selectRemote'"
                        v-model="form[itemConfig.prop]"
                        :multiple="itemConfig.multiple === undefined ? false : itemConfig.multiple"
                        style="width: 90%"
                        filterable
                        :disabled="itemConfig.disabled"
                        remote
                        reserve-keyword
                        :remote-method="remoteSelectMethod(itemConfig.remoteUrl, itemConfig.remoteParam, itemConfig.options)"
                        @change="handleSelectChange($event, itemConfig.bundle, itemConfig.options, itemConfig.clickConfig, itemConfig.optionValue)"
                      />
                      <!--         treeSelect         -->
                      <tree-select
                        v-if="itemConfig.type === 'treeSelect'"
                        v-model="form[itemConfig.prop]"
                        :options="itemConfig.options"
                        :normalizer="normalizer"
                        :show-count="true"
                        :placeholder="itemConfig.placeholder"
                        style="width: 90%;display: table"
                        :append-to-body="true"
                        size="mini"
                      />
                      <!--         textarea         -->
                      <el-input
                        v-if="itemConfig.type === 'textarea'"
                        v-model="form[itemConfig.prop]"
                        type="textarea"
                        style="width: 90%"
                      />
                      <!--        complete         -->
                      <el-autocomplete
                        v-if="itemConfig.type === 'autoComplete'"
                        v-model="form[itemConfig.prop]"
                        class="inline-input"
                        :fetch-suggestions="itemConfig.completeFun"
                        :placeholder="itemConfig.placeholder"
                      />
                      <el-switch
                        v-if="itemConfig.type === 'switch'"
                        v-model="form[itemConfig.prop]"
                        :active-text="itemConfig.sw.activeText"
                        :inactive-text="itemConfig.sw.inactiveText"
                        :active-color="itemConfig.sw.activeColor ? itemConfig.sw.activeColor : '#13ce66'"
                        :inactive-color="itemConfig.sw.inactiveColor ? itemConfig.sw.inactiveColor : '#ff4949'"
                        :active-value="itemConfig.sw.activeValue ? itemConfig.sw.activeValue : 1"
                        :inactive-value="itemConfig.sw.inactiveValue ? itemConfig.sw.inactiveValue : 0"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
            <template v-if="config.type === 'table'">
              <edit-table
                ref="editTable"
                :data="form[collapseItemConfig[config.name].prop]"
                :columns="collapseItemConfig[config.name].column"
                :rules="rules[config.name]"
                :total-columns="collapseItemConfig[config.name].totalColumns !== undefined ? collapseItemConfig[config.name].totalColumns : []"
                :sum-text="config.sumText"
                :show-summary="collapseItemConfig[config.name].showSummary !== undefined ? collapseItemConfig[config.name].showSummary : false"
                :is-view="isView"
                :show-button="collapseItemConfig[config.name].showButton ? collapseItemConfig[config.name].showButton : false"
                :show-product="collapseItemConfig[config.name].showProduct"
                :show-procurement-product="collapseItemConfig[config.name].showProcurementProduct"
                :procurement-query-form="collapseItemConfig[config.name].procurementQueryForm"
                @update:data="handleDataUpdate($event, collapseItemConfig[config.name].prop)"
              />
            </template>
          </div>
        </el-collapse-item>
      </el-card>
      <el-card v-if="false" style="margin: 10px;">
        <div slot="header" class="clearfix">
          <span>备注信息<i class="header-icon el-icon-info" /></span>
        </div>
        <el-collapse-item
          name="备注信息"
        >
          <div>
            <el-form label-width="80px">
              <el-form-item label="备注">
                <el-input type="textarea" :autosize="{ minRows: 3 }" />
              </el-form-item>
              <el-form-item label="附件">
                <el-button @click="uploadFile">上传附件</el-button>
                <upload-file ref="uploadFile" action-url="/api/upload-file/save" />
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
      </el-card>
    </el-collapse>
    <el-footer v-if="!isView" class="footer-css">
      <div class="button-group">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button v-if="canSubmit" type="warning" @click="submit">提交</el-button>
        <el-button type="info" @click="backToLastView">取消</el-button>
      </div>
    </el-footer>
    <el-footer v-if="isApproval" class="footer-css">
      <div class="button-group">
        <el-button type="success" @click="approvalPass">通过</el-button>
        <el-button type="danger" @click="dialogVisible = true">拒绝</el-button>
      </div>
    </el-footer>
    <el-dialog title="审核意见" :visible.sync="dialogVisible" width="30%">
      <el-form ref="approvalForm" :model="approvalForm" label-width="150px">
        <el-form-item prop="opinion" label="审核意见">
          <el-input
            v-model="approvalForm.opinion"
            type="textarea"
            style="width: 90%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false;approvalForm.opinion = undefined">取 消</el-button>
        <el-button type="primary" @click="approvalRefuse">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EditTable from '@/components/EditTable/index.vue'
import request from '@/utils/request'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import item from '@/layout/components/Sidebar/Item.vue'
import { approvalPassOrRefuse } from '@/api/config/approval-instance'
import UploadFile from "@/components/UploadFile/index.vue";

export default {
  name: 'FormTable',
  components: {UploadFile, EditTable, TreeSelect },
  props: {
    canSubmit: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      }
    },
    contentText: {
      type: String,
      required: true,
      default: ''
    },
    // 面板设置，包括是否展开，面板title，面板name
    collapseConfig: {
      type: Array,
      required: true,
      default: () => [
        {
          active: true,
          title: '基本信息',
          name: 'baseInfo',
          type: 'form'
        }
      ]
    },
    // 表单设置，包括表单的label宽度，表单的label位置，表单的label内容，表单的prop属性，表单的type类型，表单的options选项，表单的rules规则，表单的placeholder提示，表单的span属性，表单的table属性
    collapseItemConfig: {
      type: Object,
      required: true,
      default: function() {
        return {
          // form
          baseInfo: [
            {
              label: '',
              prop: '',
              type: '',
              options: []
            }
          ],
          // table
          tableInfo: {
            // form中的哪一个属性对象
            prop: '',
            column: [
              {
                label: '',
                prop: '',
                type: ''
              }
            ]
          }
        }
      }
    },
    form: {
      type: Object,
      required: true,
      default: () => {
      }
    },
    submitUrl: {
      type: String,
      required: true
    },
    saveUrl: {
      type: String,
      required: true
    },
    rules: {
      type: Object,
      default: () => {
      }
    },
    saveFun: {
      type: Function,
      required: false,
      default: () => {
        return true
      }
    },
    submitFun: {
      type: Function,
      required: false,
      default: () => {
        return true
      }
    },
    showQuotes: {
      type: Boolean,
      required: false,
      default: true
    },
    isView: {
      type: Boolean,
      request: false,
      default: false
    },
    isApproval: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    const nameArr = []
    this.collapseConfig.forEach((value) => {
      if (value.active) {
        nameArr.push(value.name)
      }
    })
    return {
      activeNames: nameArr,
      approvalForm: {
        opinion: undefined
      },
      dialogVisible: false,
    }
  },
  computed: {
    item() {
      return item
    }
  },
  created() {
  },
  methods: {
    goBack() {
      this.backToLastView()
    },
    handleDataUpdate(updateData, prop) {
      this.form[prop] = updateData
    },
    save() {
      if (this.saveFun()) {
        const formArr = this.$refs['form']
        let canSave = true
        formArr.forEach(function(ele) {
          ele.validate(valid => {
            if (!valid) {
              canSave = false
            }
          })
        })
        if (canSave) {
          this.$refs.editTable.forEach(function(ele) {
            ele.$refs.editTableForm.validate(valid => {
              if (!valid) {
                canSave = false
              }
            })
          })
        }
        if (canSave) {
          request({
            url: this.saveUrl,
            method: 'post',
            data: this.form
          }).then(res => {
            const { code, msg } = res
            if (code === '100') {
              this.$modal.msgSuccess(msg)
            }
          })
          this.backToLastView()
        }
      }
    },
    submit() {
      if (this.submitFun()) {
        const formArr = this.$refs['form']
        let camSubmit = true
        formArr.forEach(function(ele) {
          ele.validate(valid => {
            if (!valid) {
              camSubmit = false
            }
          })
        })
        if (camSubmit) {
          request({
            url: this.submitUrl,
            method: 'post',
            data: this.form
          }).then(res => {
            const { code, msg } = res
            if (code === '100') {
              this.$modal.msgSuccess(msg)
            }
          })
          this.backToLastView()
        }
      }
    },
    selectChange(e, bundleConfig) {
      console.log(e)
      this.form[bundleConfig.label] = e.label
      this.form[bundleConfig.value] = e.key
    },
    normalizer(node) {
      if (node.children == null) {
        delete node.children
      }
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
    },
    handleSelectChange(changeValue, bundleConfig, options, clickConfig, optionValue) {
      var _this = this
      this.$nextTick(() => {
        if (bundleConfig === undefined) {
          return
        }
        // 未选中任何值
        if (changeValue === '') {
          var keys = Object.keys(bundleConfig)
          keys.forEach(key => {
            var value = bundleConfig[key]
            _this.form[value] = undefined
          })
          return
        }
        // 需要绑定多个值
        const obj = options.find((item) => {
          if (optionValue === undefined) {
            return item.value === changeValue
          }
          return item[optionValue] === changeValue
        })

        var keys = Object.keys(bundleConfig)

        keys.forEach(key => {
          var value = bundleConfig[key]
          if (obj[key] instanceof Array) {
            _this.handleDataUpdate(obj[key], value)
            // obj[key].forEach((item) => {
            //   _this.form[value].push(item)
            // })
          } else {
            _this.form[value] = obj[key]
          }
        })
      })
    },
    backToLastView() {
      const currentView = this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1]
      this.$store.dispatch('tagsView/delView', currentView).then(({ visitedViews }) => {
        if (currentView.path === this.$route.path) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.fullPath)
          } else {
            // now the default is to redirect to the home page if there is no tags-view,
            // you can adjust it according to your needs.
            if (currentView.name === 'Dashboard') {
              // to reload home page
              this.$router.replace({ path: '/redirect' + currentView.fullPath })
            } else {
              this.$router.push('/')
            }
          }
        }
      })
    },
    approvalPass() {
      const obj = {
        instanceId: this.form.instanceId,
        passOrRefuse: 1
      }
      approvalPassOrRefuse(obj).then(res => {
        const { code, msg } = res
        if (code === '100') {
          this.$modal.msgSuccess(msg)
          this.backToLastView()
        }
      })
    },
    approvalRefuse() {
      const obj = {
        instanceId: this.form.instanceId,
        passOrRefuse: 2,
        opinion: this.approvalForm.opinion
      }
      approvalPassOrRefuse(obj).then(res => {
        const { code, msg } = res
        if (code === '100') {
          this.dialogVisible = false
          this.$modal.msgSuccess(msg)
          this.backToLastView()
        }
      })
    },
    handleInputChange(event, inputConfig) {
      if (inputConfig.input) {
        inputConfig.input(event)
      }
      return event
    },
    computeShowButton(showButton) {
      console.log(showButton instanceof Boolean)
      console.log(showButton instanceof String)
      return !!showButton
    },
    uploadFile() {
      this.$refs.uploadFile.dialogVisible = true
    },
    remoteSelectMethod(remoteUrl, remoteParam, options) {
      request({
        url: remoteUrl,
        method: 'post',
        data: remoteParam
      }).then(res => {
        options = res.data.map(item => ({
          value: item.id,
          label: item.name
        }))
      })
    }
  }
}
</script>

<style>
blockquote {
  background: #f9f9f9;
  border-left: 10px solid #ccc;
  margin: 1.5em 10px;
  padding: 0.5em 10px;
  quotes: "\201C""\201D""\2018""\2019";
}

blockquote:before {
  color: #ccc;
  content: open-quote;
  font-size: 4em;
  line-height: 0.1em;
  margin-right: 0.25em;
  vertical-align: -0.4em;
}

blockquote p {
  display: inline;
}

.button-group {
  margin-top: 10px;
  margin-left: 10px;
  text-align: center;
}

.vue-treeselect__control {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  height: 34px;
  line-height: 34px;
}

.vue-treeselect__menu-container {
  font-size: 12px;
  color: #606266;
  position: absolute;
  left: 0;
  width: 100%;
  overflow: visible;
  transition: 0s;
  font-weight: 100;
}

.vue-treeselect__count {
  margin-left: 5px;
  font-weight: normal;
  opacity: 0.6;
}

.el-collapse, .el-collapse-item__wrap {
  border: none;
}

//去掉表格内的线
table th,
table td {
  border-bottom: none !important;
}

//去掉最下面的那一条线
.el-table::before {
  height: 0px;
}

.customer-table .el-table__fixed-right::before,
.el-table__fixed::before {
  width: 0;
}

.footer-css {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.2); /* 上边框阴影 */
  width: 100%;
  margin-top: 0px;
}

</style>
