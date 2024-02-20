<template>
  <div>
    <el-page-header :content="contentText" @back="goBack" />
    <blockquote style="font-size: 14px;color: gray">
      <br> 制单日期： {{ new Date() }}
      <br> 制单人： {{ $store.state.user.name }}
    </blockquote>
    <div class="button-group">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="warning">提交</el-button>
      <el-button type="info">取消</el-button>
    </div>
    <el-collapse v-model="activeNames">
      <el-card v-for="config in collapseConfig" :key="config.name" style="margin: 10px">
        <div slot="header" class="clearfix">
          <span>{{ config.title }}<i class="header-icon el-icon-info" /></span>
        </div>
        <el-collapse-item
          :name="config.name"
        >
          <div>
            <!--         form         -->
            <template v-if="config.type === 'form'">
              <el-form ref="form" v-model="form" label-width="120px">
                <el-row>
                  <el-col v-for="itemConfig in collapseItemConfig[config.name]" :key="itemConfig.prop" :span="8">
                    <el-form-item :label="itemConfig.label" :prop="itemConfig.prop">
                      <!--         input         -->
                      <el-input v-if="itemConfig.type === 'input'" v-model="form[itemConfig.prop]" style="width: 90%" />
                      <!--         data         -->
                      <el-date-picker v-if="itemConfig.type === 'date'" v-model="form[itemConfig.prop]" type="date" :placeholder="itemConfig.placeholder" style="width: 90%" />
                      <!--         select         -->
                      <el-select v-if="itemConfig.type === 'select'" v-model="form[itemConfig.prop]" style="width: 90%">
                        <el-option
                          v-for="option in itemConfig.options"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                      <!--         textarea         -->
                      <el-input v-if="itemConfig.type === 'textarea'" v-model="form[itemConfig.prop]" type="textarea" style="width: 90%" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
            <template v-else>
              <edit-table :data="form[collapseItemConfig[config.name].prop]" :columns="collapseItemConfig[config.name].column" @update:data="handleDataUpdate($event, collapseItemConfig[config.name].prop)" />
            </template>
          </div>
        </el-collapse-item>
      </el-card>
    </el-collapse>
  </div>
</template>

<script>
import EditTable from '@/components/EditTable/index.vue'

export default {
  name: 'FormTable',
  components: { EditTable },
  props: {
    contentText: {
      type: String,
      default: ''
    },
    // 面板设置，包括是否展开，面板title，面板name
    collapseConfig: {
      type: Array,
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
      default: () => {}
    },
    submitUrl: {
      type: String,
      required: true
    },
    saveUrl: {
      type: String,
      required: true
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
      activeNames: nameArr
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    handleDataUpdate(updateData, prop) {
      this.form[prop] = updateData
    },
    submit() {
      console.log(this.form)
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
</style>
