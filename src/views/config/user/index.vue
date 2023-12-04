<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" size="small">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="queryForm.username"
          clearable
          placeholder="请输入用户名"
          @keyup.enter.native="handlerQuery"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="queryForm.nickName"
          clearable
          placeholder="请输入昵称"
          @keyup.enter.native="handlerQuery"
        />
      </el-form-item>
      <el-form-item label="角色" prop="username">
        <el-select v-model="queryForm.role" clearable placeholder="用户角色" multiple>
          <el-option
            v-for="role in javaCode['RoleBuilder']"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handlerQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
      <button-group :button-config="buttonsConfig"/>
    </el-form>
    <page-table
      ref="tableList"
      :query-form="queryForm"
      :data-source="dataSource"
      :table-column-config="tableColumnConfig"
    />
    <!--  新增,修改,查看  -->
    <el-dialog
      :visible.sync="addVisible"
      title="用户新增"
      width="500px"
      append-to-body
      @close="closeAddForm"

    >
      <el-form ref="form" label-width="80px" :disabled="addFormDisabled">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"/>
        </el-form-item>
        <template v-if="isAdd">
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" :show-password="true"/>
          </el-form-item>
        </template>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" clearable/>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role">
            <el-option
              v-for="role in javaCode['RoleBuilder']"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-select v-model="form.currency" filterable>
            <el-option
              v-for="currency in javaCode['CurrencyBuilder']"
              :key="currency.value"
              :label="currency.label"
              :value="currency.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="form.department" clearable/>
        </el-form-item>
      </el-form>
      <template slot="footer" class="dialog-footer" v-if="isView">
        <el-button type="info" @click="closeAddForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
    <upload-file ref="upload" action-url="/api/user/upload" business-name="user"/>
  </div>
</template>

<script>
import PageTable from '@/components/ListTable/index.vue'
import { getConstant, getJavaCode } from '@/api/common/dict'
import ButtonGroup from '@/components/ButtonGroup/index.vue'
import { addUser, deleteUser, enableOrDisableUser, modifyUser, queryUserInfoById } from '@/api/user'
import UploadFile from '@/components/UploadFile/index.vue'

export default {
  name: 'User',
  components: { UploadFile, ButtonGroup, PageTable },
  data() {
    return {
      queryForm: {
        username: undefined,
        nickName: undefined,
        role: undefined
      },
      form: {
        id: undefined,
        username: undefined,
        password: undefined,
        role: undefined,
        avatar: undefined,
        defaultRole: undefined,
        department: undefined,
        nickName: undefined,
        currency: undefined
      },
      addVisible: false,
      editVisible: false,
      addFormDisabled: false,
      isAdd: true,
      isView: true,
      dataSource: '/api/user/list',
      tableColumnConfig: [],
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['RoleBuilder', 'CurrencyBuilder']
      },
      constantConfig: {
        constantNameList: ['Enable']
      },
      constant: [],
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
      dialogButtonConfig: [
        {
          text: '取消',
          type: 'danger',
          plain: false
        },
        {
          text: '确认',
          plain: false,
          click: () => {

          }
        }
      ]
    }
  },
  async created() {
    await getJavaCode(this.javaCodeConfig).then(res => {
      const { data } = res
      this.javaCode = data
    })
    await getConstant(this.constantConfig).then(res => {
      const { data } = res
      this.constant = data
    })
    await this.init()
  },
  methods: {
    handlerQuery() {
      this.$refs.tableList.list()
    },
    init() {
      this.tableColumnConfig = [
        {
          type: 'selection',
          columnType: 'Index'
        },
        {
          columnType: 'Link',
          label: '昵称',
          prop: 'nickName',
          fixed: true,
          link: {
            click: (index, row) => {
              this.handleView(index, row)
            }
          }
        },
        {
          label: '用户名',
          prop: 'username'
        },
        {
          columnType: 'Tag',
          label: '角色',
          prop: 'role',
          tag: {
            type: (tag) => {
              if (tag === 'admin') {
                return 'success'
              }
              if (tag === 'editor') {
                return 'info'
              }
            },
            effect: 'light',
            dictList: this.javaCode['RoleBuilder'],
            isConvert: true
          }
        },
        {
          label: '币种',
          prop: 'currency'
        },
        {
          label: '部门',
          prop: 'department'
        },
        {
          columnType: 'Constant',
          label: '启用状态',
          prop: 'enable',
          constant: {
            constantList: this.constant['Enable'],
            type: (row) => {
              if (row.enable === 0) {
                return 'success'
              }
              if (row.enable === 1) {
                return 'info'
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
                this.enableUser(index, row)
              },
              isDisabled: (row) => {
                return this.canEnable(row)
              }
            },
            {
              text: '禁用',
              css: 'danger',
              click: (index, row) => {
                this.disableUser(index, row)
              },
              isDisabled: (row) => {
                return this.canDisable(row)
              }
            }
          ]
        }
      ]
    },
    handleView(index, row) {
      queryUserInfoById(row.id).then(res => {
        const { data } = res
        Object.assign(this.form, data)
        this.addVisible = true
        this.addFormDisabled = true
        this.isView = false
      })
    },
    handleEdit(index, row) {
      queryUserInfoById(row.id).then(res => {
        const { data } = res
        Object.assign(this.form, data)
        this.addVisible = true
        this.addFormDisabled = false
        this.isAdd = false
        this.isView = true
      })
    },
    handleDel() {
      this.$confirm('是否删除选中数据, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let rows = this.$refs.tableList.checkedRows()
        let idArr = []
        rows.forEach(function(ele) {
          idArr.push(ele.id)
        })
        deleteUser(idArr).then(res => {
          const { msg } = res
          this.$modal.msgSuccess(msg)
          this.handlerQuery()
        })
      })
    },
    restQuery() {
      this.queryForm = {
        username: undefined,
        nickName: undefined,
        role: undefined
      }
    },
    canEdit(row) {
      return false
    },
    canEnable(row) {
      return !(row.enable === 1)
    },
    canDisable(row) {
      return !(row.enable === 0)
    },
    enableUser(index, row) {
      enableOrDisableUser({ id: row.id, enable: row.enable }).then(res => {
        const { code } = res
        if (code === '100') {
          this.$modal.msgSuccess(row.enable === 0 ? '已禁用' : '已启用')
          this.handlerQuery()
        }
      })
    },
    disableUser(index, row) {
      enableOrDisableUser({ id: row.id, enable: row.enable }).then(res => {
        const { code } = res
        if (code === '100') {
          this.$modal.msgSuccess(row.enable === 0 ? '已禁用' : '已启用')
          this.handlerQuery()
        }
      })
    },
    handleAdd() {
      this.addVisible = true
      this.isView = true
      this.addFormDisabled = false
      this.form = {
        id: undefined,
        username: undefined,
        password: undefined,
        role: undefined,
        avatar: undefined,
        defaultRole: undefined,
        department: undefined,
        nickName: undefined,
        currency: undefined
      }
      this.isAdd = true
    },
    closeAddForm() {
      this.$refs.form.resetFields()
      this.addVisible = false
    },
    submitForm() {
      if (!this.form.id) {
        addUser(this.form).then(res => {
          const { msg }  = res
          this.$modal.msgSuccess(msg)
          this.closeAddForm()
          this.handlerQuery()
        })
      } else {
        modifyUser(this.form).then(res => {
          const { msg } = res
          this.$modal.msgSuccess(msg)
          this.closeAddForm()
          this.handlerQuery()
        })
      }
    },
    handleUpload() {
      this.$refs.upload.dialogVisible = true
    }
  }
}
</script>
