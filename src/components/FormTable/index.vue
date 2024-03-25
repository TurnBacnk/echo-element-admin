<template>
  <div>
    <el-page-header :content="contentText" @back="goBack"/>
    <blockquote style="font-size: 14px;color: gray">
      <br> 制单日期： {{ new Date() }}
      <br> 制单人： {{ $store.state.user.name }}
    </blockquote>
    <div class="button-group">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="warning" v-if="canSubmit" @click="submit">提交</el-button>
      <el-button type="info" @click="backToLastView">取消</el-button>
    </div>
    <el-collapse v-model="activeNames">
      <el-card v-for="config in collapseConfig" :key="config.name" style="margin: 10px;">
        <div slot="header" class="clearfix">
          <span>{{ config.title }}<i class="header-icon el-icon-info"/></span>
        </div>
        <el-collapse-item
          :name="config.name"
        >
          <div>
            <!--         form         -->
            <template v-if="config.type === 'form'">
              <el-form ref="form" :model="form" label-width="120px">
                <el-row>
                  <el-col v-for="itemConfig in collapseItemConfig[config.name]" :key="itemConfig.prop" :span="8">
                    <el-form-item :label="itemConfig.label" :prop="itemConfig.prop" :rules="rules[config.name] ? rules[config.name][itemConfig.prop] : null" >
                      <!--         input         -->
                      <el-input v-if="itemConfig.type === 'input'" v-model="form[itemConfig.prop]" style="width: 90%"
                                :placeholder="itemConfig.placeholder ? itemConfig.placeholder : '请输入' + itemConfig.label" :disabled="itemConfig.disabled"
                      />
                      <!--         phone         -->
                      <el-input v-if="itemConfig.type === 'inputNumber'" v-model="form[itemConfig.prop]"
                                style="width: 90%" oninput="value=value.replace(/[^0-9.]/g,'')"
                                :placeholder="itemConfig.placeholder" maxlength="11"
                      />

                      <!--         data         -->
                      <el-date-picker v-if="itemConfig.type === 'date'" v-model="form[itemConfig.prop]" type="date"
                                      :placeholder="itemConfig.placeholder ? itemConfig.placeholder : '请选择' + itemConfig.label" style="width: 90%"
                      />
                      <!--         number         -->
                      <el-input-number v-if="itemConfig.type === 'number'" v-model=form[itemConfig.prop] :min="1" :disabled="itemConfig.disabled" />
                      <!--         select         -->
                      <el-select v-if="itemConfig.type === 'select'" v-model="form[itemConfig.prop]" style="width: 90%" @change="handleSelectChange($event, itemConfig.bundle, itemConfig.options)">
                        <el-option
                          v-for="option in itemConfig.options"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                      <!--         treeSelect         -->
                      <tree-select v-if="itemConfig.type === 'treeSelect'" v-model="form[itemConfig.prop]"
                                   :options="itemConfig.options" :normalizer="normalizer" :show-count="true"
                                   :placeholder="itemConfig.placeholder" style="width: 90%;display: table" :appendToBody="true" size="mini"
                      />
                      <!--         textarea         -->
                      <el-input v-if="itemConfig.type === 'textarea'" v-model="form[itemConfig.prop]" type="textarea"
                                style="width: 90%"
                      />
                      <!--        complete         -->
                      <el-autocomplete v-if="itemConfig.type === 'autoComplete'"
                                       class="inline-input"
                                       v-model="form[itemConfig.prop]"
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
              <edit-table :data="form[collapseItemConfig[config.name].prop]"
                          :columns="collapseItemConfig[config.name].column"
                          @update:data="handleDataUpdate($event, collapseItemConfig[config.name].prop)"
                          :rules="rules[config.name]"
              />
            </template>
          </div>
        </el-collapse-item>
      </el-card>
    </el-collapse>
  </div>
</template>

<script>
import EditTable from '@/components/EditTable/index.vue'
import request from '@/utils/request'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import item from '@/layout/components/Sidebar/Item.vue'

export default {
  name: 'FormTable',
  computed: {
    item() {
      return item
    }
  },
  components: { EditTable, TreeSelect },
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
      default: () => {}
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
    }
  },
  created() {
    // this.$nextTick(() => {
    //   var elements = document.querySelectorAll('.vue-treeselect__control')
    //   console.log(elements)
    //   elements.forEach(function(element) {
    //     element.style.removeProperty('display')
    //   })
    // })
  },
  data() {
    const nameArr = []
    this.collapseConfig.forEach((value) => {
      if (value.active) {
        nameArr.push(value.name)
      }
    })
    return {
      activeNames: nameArr
    }
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
        let formArr = this.$refs['form']
        formArr.forEach(function(ele) {
          ele.validate(valid => {
            if (!valid) {
              return false
            }
          })
        })
        request({
          url: this.saveUrl,
          method: 'post',
          data: this.form
        }).then(res => {
          const { code, msg } = res
          if (code === 100) {
            this.$modal.msgSuccess(msg)
          }
        })
        this.backToLastView()
      }
    },
    submit() {
      if (this.submitFun()) {
        let formArr = this.$refs['form']
        formArr.forEach(function(ele) {
          ele.validate(valid => {
            if (!valid) {
              return false
            }
          })
        })
        request({
          url: this.submitUrl,
          method: 'post',
          data: this.form
        }).then(res => {
          const { code, msg } = res
          if (code === 100) {
            this.$modal.msgSuccess(msg)
          }
        })
        this.backToLastView()}
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
    handleSelectChange(changeValue, bundleConfig, options) {
      if (bundleConfig === undefined) {
        return
      }
      // 需要绑定多个值
      let obj = options.find((item) => {
        return item.value === changeValue
      })
      this.form[bundleConfig.label] = obj.label
      this.form[bundleConfig.value] = changeValue
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
  margin-top: 20px;
  margin-left: 10px;
  text-align: left;
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

.el-collapse,.el-collapse-item__wrap {
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

</style>
