<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" size="small">
      <el-form-item label="任务名称" prop="menuName">
        <el-input
          v-model="queryForm.menuName"
          clearable
          placeholder="请输入任务名称"
          @keyup.enter.native="handlerQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handlerQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
      <button-group :button-config="buttonConfig"/>
    </el-form>
    <page-table
      ref="tableList"
      :query-form="queryForm"
      :data-source="dataSource"
      :table-column-config="tableColumnConfig"
    />
    <el-dialog
      :visible.sync="addDialogVisible"
      v-if="addDialogVisible"
      :title="formTitle"
      append-to-body
      @close="closeAddForm"
      :destroy-on-close="true"
      width="600px"
    >
      <el-form ref="form" label-width="100px" :model="form" :disabled="addFormDisabled" :rules="rules">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="form.jobName" placeholder="请输入任务名称"/>
        </el-form-item>
        <el-form-item label="任务分组" prop="jobGroup">
          <el-select v-model="form.jobGroup" filterable>
            <el-option
              v-for="group in constant['JobGroup']"
              :key="group.value"
              :label="group.label"
              :value="group.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="调用方法" prop="invokeTarget">
          <span slot="label">
                调用方法
                <el-tooltip placement="top">
                  <div slot="content">
                    Bean调用示例：ryTask.ryParams('ry')
                    <br/>Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                    <br/>参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
          </span>
          <el-input v-model="form.invokeTarget" placeholder="请输入调用目标字符串"/>
        </el-form-item>
        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input v-model="form.cronExpression" placeholder="请输入cron执行表达式">
            <template slot="append">
              <el-button type="primary" @click="handleShowCron">
                生成表达式
                <i class="el-icon-time el-icon--right"></i>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="执行策略" prop="misfirePolicy">
          <el-radio-group v-model="form.misfirePolicy" size="small">
            <el-radio-button
              v-for="policy in constant['MisfirePolicy']"
              :label="policy.value"
            >
              {{ policy.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否并发" prop="concurrent">
          <el-radio-group v-model="form.concurrent" size="small">
            <el-radio-button
              v-for="item in constant['Concurrent']"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Cron表达式生成器" :visible.sync="openCron" append-to-body destroy-on-close>
      <cron-tab @hide="openCron = false" @fill="crontabFill" :expression="expression"/>
    </el-dialog>
  </div>
</template>

<script>

import PageTable from '@/components/ListTable/index.vue'
import ButtonGroup from '@/components/ButtonGroup/index.vue'
import CronTab from '@/components/Crontab/index.vue'
import { getConstant } from '@/api/common/dict'
import { disableJob, enableJob, execute, insertJob, queryTaskById, startOrPauseJob, updateJob } from '@/api/task'

export default {
  name: 'Task',
  components: { ButtonGroup, PageTable, CronTab },
  data() {
    return {
      queryForm: {
        menuName: undefined
      },
      dataSource: '/api/task/list',
      tableColumnConfig: [],
      buttonConfig: [
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
        },
        {
          text: '导入',
          type: 'success',
          click: () => {
            this.handleUpload()
          },
          plain: true,
          icon: 'el-icon-cloudy'
        },
        {
          text: '导出',
          type: 'warning',
          click: () => {
            this.handleEdit()
          },
          plain: true,
          icon: 'el-icon-download'
        }
      ],
      addDialogVisible: false,
      formTitle: '任务新增',
      form: {
        id: undefined,
        jobName: undefined,
        jobGroup: undefined,
        invokeTarget: undefined,
        cronExpression: undefined,
        misfirePolicy: undefined,
        concurrent: undefined
      },
      addFormDisabled: false,
      rules: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        jobGroup: [
          { required: true, message: '请输入任务组名', trigger: 'blur' }
        ],
        invokeTarget: [
          { required: true, message: '请输入调用对象字符串', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: '请输入cron表达式', trigger: 'blur' }
        ],
        misfirePolicy: [
          { required: true, message: '请选择计划执行错误策略', trigger: 'blur' }
        ],
        concurrent: [
          { required: true, message: '请选择是否并发执行', trigger: 'blur' }
        ]
      },
      constant: [],
      constantConfig: {
        constantNameList: ['JobGroup', 'MisfirePolicy', 'Concurrent', 'Enable', 'StartPause'],
      },
      openCron: false,
      expression: undefined
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      const { data } = res
      this.constant = data
    })
    await this.init()
  },
  methods: {
    init() {
      this.tableColumnConfig = [
        {
          type: 'selection',
          columnType: 'Index'
        },
        {
          fixed: 'left',
          label: '任务名称',
          prop: 'jobName'
        },
        {
          columnType: 'Constant',
          label: '任务组名',
          prop: 'jobGroup',
          constant: {
            constantList: this.constant['JobGroup'],
            type: (row) => {
              if (row.jobGroup === 'system') {
                return 'success'
              }
              if (row.jobGroup === 'default') {
                return ''
              }
            },
            effect: 'light'
          }
        },
        {
          label: '调用目标字符串',
          prop: 'invokeTarget'
        },
        {
          label: 'cron表达式',
          prop: 'cronExpression'
        },
        {
          columnType: 'Constant',
          label: '计划执行错误策略',
          prop: 'misfirePolicy',
          constant: {
            constantList: this.constant['MisfirePolicy'],
            type: (row) => {
              if (row.misfirePolicy === '1') {
                return 'success'
              }
              if (row.misfirePolicy === '2') {
                return ''
              }
              if (row.misfirePolicy === '3') {
                return 'warning'
              }
            },
            effect: 'light'
          }
        },
        {
          columnType: 'Constant',
          label: '是否并发执行',
          prop: 'concurrent',
          constant: {
            constantList: this.constant['Concurrent'],
            type: (row) => {
              if (row.concurrent === '1') {
                return 'success'
              }
              if (row.concurrent === '2') {
                return ''
              }
            },
            effect: 'light'
          }
        },
        {
          columnType: 'Constant',
          label: '任务状态',
          prop: 'status',
          constant: {
            constantList: this.constant['StartPause'],
            type: (row) => {
              if (row.status === '1') {
                return 'success'
              }
              if (row.status === '0') {
                return ''
              }
            },
            effect: 'light'
          }
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
            {
              text: '立即执行',
              css: 'text',
              click: (index, row) => {
                this.handleExecute(row)
              },
              isDisabled: () => {
                return false
              }
            },
            {
              text: '修改',
              css: 'text',
              click: (index, row) => {
                this.handleEdit(index, row)
              },
              isDisabled: (row) => {
                return false
              }
            },
            {
              text: '恢复任务',
              css: 'text',
              click: (index, row) => {
                this.handleStart(row)
              },
              isDisabled: (row) => {
                return row.status === '1'
              }
            },
            {
              text: '暂停任务',
              css: 'text',
              click: (index, row) => {
                this.handlePause(row)
              },
              isDisabled: (row) => {
                return row.status === '0'
              }
            }
          ]
        }
      ]
    },
    handleStart(row) {
      startOrPauseJob(row.id, '1').then(res => {
        const { msg } = res
        this.$modal.msgSuccess(msg)
        this.handlerQuery()
      })
    },
    handlePause(row) {
      startOrPauseJob(row.id, '0').then(res => {
        const { msg } = res
        this.$modal.msgSuccess(msg)
        this.handlerQuery()
      })
    },
    handlerQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.$refs.queryForm.resetFields()
    },
    handleEdit(index, row) {
      queryTaskById(row.id).then(res => {
        const { data } = res
        Object.assign(this.form, data)
        this.addDialogVisible = true
      })
    },
    handleExecute(row) {
      execute(row.id, row.jobGroup).then(res => {
        const { msg } = res
        this.$modal.msgSuccess(msg)
      })
    },
    handleDel() {

    },
    handleAdd() {
      this.form = {
        id: undefined,
        jobName: undefined,
        jobGroup: undefined,
        invokeTarget: undefined,
        cronExpression: undefined,
        misfirePolicy: undefined,
        concurrent: undefined
      }
      this.addDialogVisible = true
    },
    handleUpload() {

    },
    closeAddForm() {

    },
    handleShowCron() {
      this.expression = this.form.cronExpression
      this.openCron = true
    },
    crontabFill(value) {
      this.form.cronExpression = value
    },
    cancel() {
      this.addDialogVisible = false
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateJob(this.form).then(res => {
              const { msg } = res
              this.$modal.msgSuccess(msg)
              this.addDialogVisible = false
              this.handlerQuery()
            })
          } else {
            insertJob(this.form).then(res => {
              const { msg } = res
              this.$modal.msgSuccess(msg)
              this.addDialogVisible = false
              this.handlerQuery()
            })
          }
        }
      })
    }
  }
}

</script>
