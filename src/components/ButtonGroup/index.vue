<template>
  <el-row :gutter="10" class="mb8">
    <template v-for="button in buttonConfig">
      <el-col :span="1.5">
        <el-button
          :circle="button.circle"
          :icon="button.icon ? button.icon : ''"
          :plain="button.plain ? button.plain : false"
          :size="button.size ? button.size : 'mini'"
          :type="button.type ? button.type : 'primary'"
          @click="button.click()"
        >{{ button.text }}
        </el-button>
      </el-col>
    </template>
    <div class="top-right-btn" :style="style">
      <el-row>
        <el-tooltip v-if="search" class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导入" placement="top">
          <el-button size="mini" circle icon="el-icon-upload" @click="upload()" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导出" placement="top">
          <el-button size="mini" circle icon="el-icon-download" @click="refresh()" />
        </el-tooltip>
        <el-tooltip v-if="columns" class="item" effect="dark" content="显隐列" placement="top">
          <el-button v-if="showColumnsType == 'transfer'" size="mini" circle icon="el-icon-menu" @click="showColumn()" />
          <el-dropdown v-if="showColumnsType == 'checkbox'" trigger="click" :hide-on-click="false" style="padding-left: 12px">
            <el-button size="mini" circle icon="el-icon-menu" />
            <el-dropdown-menu slot="dropdown">
              <template v-for="item in columns">
                <el-dropdown-item :key="item.key">
                  <el-checkbox :checked="item.visible" :label="item.label" @change="checkboxChange($event, item.label)" />
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </el-row>
      <el-dialog :title="title" :visible.sync="open" append-to-body>
        <el-transfer
          v-model="value"
          :titles="['显示', '隐藏']"
          :data="columns"
          @change="dataChange"
        />
      </el-dialog>
      <upload-file ref="upload" :action-url="uploadUrl" />
    </div>
  </el-row>
</template>

<script>

import UploadFile from '@/components/UploadFile/index.vue'

export default {
  name: 'ButtonGroup',
  components: { UploadFile },
  props: {
    buttonConfig: {
      type: Array,
      required: true,
      default: [
        {
          text: '按钮',
          type: 'primary',
          size: 'mini',
          click: () => {
            console.log('click success')
          },
          plain: true,
          icon: ''
        }
      ]
    },
    /* 是否显示检索条件 */
    showSearch: {
      type: Boolean,
      default: true
    },
    /* 显隐列信息 */
    columns: {
      type: Array
    },
    /* 是否显示检索图标 */
    search: {
      type: Boolean,
      default: true
    },
    /* 显隐列类型（transfer穿梭框、checkbox复选框） */
    showColumnsType: {
      type: String,
      default: 'checkbox'
    },
    /* 右外边距 */
    gutter: {
      type: Number,
      default: 10
    },
    uploadUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 显隐数据
      value: [],
      // 弹出层标题
      title: '显示/隐藏',
      // 是否显示弹出层
      open: false
    }
  },
  computed: {
    style() {
      const ret = {}
      if (this.gutter) {
        ret.marginRight = `${this.gutter / 2}px`
      }
      return ret
    }
  },
  created() {
    if (this.showColumnsType == 'transfer') {
      // 显隐列初始默认隐藏列
      for (const item in this.columns) {
        if (this.columns[item].visible === false) {
          this.value.push(parseInt(item))
        }
      }
    }
  },
  methods: {
    // 搜索
    toggleSearch() {
      this.$emit('update:showSearch', !this.showSearch)
    },
    // 刷新
    refresh() {
      this.$emit('queryTable')
    },
    // 右侧列表元素变化
    dataChange(data) {
      for (const item in this.columns) {
        const key = this.columns[item].key
        this.columns[item].visible = !data.includes(key)
      }
    },
    // 打开显隐列dialog
    showColumn() {
      this.open = true
    },
    // 勾选
    checkboxChange(event, label) {
      this.columns.filter(item => item.label == label)[0].visible = event
    },
    // 导入
    upload() {
      this.$refs.upload.dialogVisible = true
    }
  }
}
</script>
