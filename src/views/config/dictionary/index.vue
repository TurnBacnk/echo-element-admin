<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" size="small">
      <el-form-item label="字典名称" prop="dictionaryName">
        <el-input
          v-model="queryForm.dictionaryName"
          clearable
          placeholder="请输入字典名称"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictionaryType">
        <el-select
          v-model="queryForm.dictionaryType"
          clearable
          placeholder="请选择字典类型"
        >
          <el-option
            v-for="type in constant['DictionaryType']"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <button-group :button-config="buttonsConfig" />
    </el-form>
    <page-table
      ref="tableList"
      :query-form="queryForm"
      :data-source="dataSource"
      :table-column-config="tableColumnConfig"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      :title="title"
      width="500px"
      append-to-body
      @close="closeDialogForm"
    >
      <el-form ref="form" label-width="80px" :disabled="dialogFormDisable" :rules="rules">
        <el-form-item label="字典名称" prop="dictionaryName">
          <el-input v-model="form.dictionaryName" />
        </el-form-item>
        <el-form-item label="字典Key" prop="dictionaryKey">
          <el-input v-model="form.dictionaryKey" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template v-if="isShow" slot="footer" class="dialog-footer">
        <el-button type="info" @click="closeAddForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>

import { getConstant } from '@/api/common/dict'
import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import { insertDictionary, updateDictionary } from '@/api/dict'

export default {
  name: 'Dictionary',
  components: { PageTable, ButtonGroup },
  data() {
    return {
      queryForm: {
        dictionaryName: null,
        dictionaryType: null
      },
      constant: [],
      constantConfig: {
        constantNameList: ['DictionaryType', 'Enable']
      },
      buttonsConfig: [
        {
          text: '新增',
          click: () => {
            this.handleAdd()
          },
          plain: true,
          icon: 'el-icon-plus'
        },
        {
          text: '删除',
          type: 'danger',
          click: () => {
            this.handleDel()
          },
          plain: true,
          icon: 'el-icon-delete'
        }
      ],
      dataSource: '/api/dict/list',
      tableColumnConfig: [],
      dialogVisible: false,
      title: '字典新增',
      dialogFormDisable: false,
      form: {
        id: null,
        dictionaryName: null,
        dictionaryKey: null,
        dictionaryType: null,
        status: null,
        remark: null
      },
      isShow: true,
      rules: {
        dictionaryName: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        dictionaryKey: [
          { required: true, message: '请输入字典Key', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    getConstant(this.constantConfig).then(res => {
      const { data } = res
      this.constant = data
    })
    this.init()
  },
  methods: {
    init() {
      this.tableColumnConfig = [
        {
          type: 'selection',
          columnType: 'Index'
        },
        {
          columnType: 'Link',
          label: '字典名称',
          prop: 'dictionaryName',
          fixed: true,
          link: {
            click: (index, row) => {
              this.handleView(index, row)
            }
          }
        },
        {
          label: '字典标识',
          prop: 'dictionaryKey'
        },
        {
          columnType: 'Tag',
          label: '字典类型',
          prop: 'dictionaryType',
          tag: {
            type: (tag) => {
              if (tag === 0) {
                return 'success'
              }
              if (tag === 1) {
                return 'info'
              }
            },
            effect: 'light',
            dictList: this.constant['DictionaryType'],
            isConvert: true
          }
        },
        {
          columnType: 'Tag',
          label: '状态',
          prop: 'status',
          tag: {
            type: (tag) => {
              if (tag === 0) {
                return 'success'
              }
              if (tag === 1) {
                return 'info'
              }
            },
            effect: 'light',
            dictList: this.constant['Enable'],
            isConvert: true
          }
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
            {
              text: '修改',
              css: 'warning',
              click: (index, row) => {
                this.handleEdit(index, row)
              },
              isDisabled: (row) => {
                return this.canEdit(row)
              }
            },
            {
              text: '启用',
              css: 'success',
              click: (index, row) => {
                this.enableDict()
              },
              isDisabled: (row) => {
                return this.canEnable()
              }
            },
            {
              text: '禁用',
              css: 'danger',
              click: (index, row) => {
                this.disableDict()
              },
              isDisabled: (row) => {
                return this.canDisable()
              }
            }
          ]
        }
      ]
    },
    handleQuery() {
      this.$refs.tableList.list()
    },
    resetQuery() {
      this.queryForm = {
        dictionaryName: null,
        dictionaryType: null,
        status: null
      }
    },
    handleAdd() {
      this.dialogVisible = true
      this.title = '字典新增'
      this.dialogFormDisable = false
    },
    handleDel() {
    },
    handleView(index, row) {
    },
    handleEdit(index, row) {
    },
    canEdit() {},
    enableDict() {},
    canEnable() {},
    disableDict() {},
    canDisable() {},
    closeDialogForm() {
      this.dialogVisible = false
      this.form = {
        id: null,
        dictionaryName: null,
        dictionaryType: null,
        dictionaryKey: null,
        remark: null
      }
    },
    closeAddForm() {
      this.closeDialogForm()
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateDictionary(this.form).then(res => {
              const { msg } = res
              this.$modal.msgSuccess(msg)
            })
          } else {
            insertDictionary(this.form).then(res => {
              const { msg } = res
              this.$modal.msgSuccess(msg)
            })
          }
          this.closeDialogForm()
        }
      })
    }
  }
}
</script>
