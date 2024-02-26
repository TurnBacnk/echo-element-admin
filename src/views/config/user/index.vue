<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            :data="deptOptions"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :props="{ children: 'children', label: 'label'}"
            default-expand-all
            highlight-current
            node-key="id"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form
          v-if="showSearch"
          ref="queryForm"
          :inline="true"
          size="small"
        >
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
        </el-form>
        <button-group :button-config="buttonsConfig" :show-search.sync="showSearch" @queryTable="handlerQuery" />
        <page-table
          ref="tableList"
          :query-form="queryForm"
          :data-source="dataSource"
          :table-column-config="tableColumnConfig"
        />
      </el-col>
    </el-row>
    <!--  新增,修改,查看  -->
    <el-dialog
      :visible.sync="addVisible"
      :title="title"
      width="500px"
      append-to-body
      @close="closeAddForm"
    >
      <el-form ref="form" label-width="80px" :disabled="addFormDisabled">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <template v-if="isAdd">
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" :show-password="true" />
          </el-form-item>
        </template>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" clearable />
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
        <el-form-item label="部门" prop="deptId">
          <tree-select v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" :normalizer="normalizer" />
        </el-form-item>
        <el-form-item label="岗位" prop="postId">
          <el-select v-model="form.postId" placeholder="请选择岗位">
            <el-option
              v-for="post in javaCode['PostBuilder']"
              :key="post.value"
              :label="post.label"
              :value="post.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template v-if="isView" slot="footer" class="dialog-footer">
        <el-button type="info" @click="closeAddForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
    <upload-file ref="upload" action-url="/api/user/upload" business-name="user" />
  </div>
</template>

<script>
import PageTable from '@/components/ListTable/index.vue'
import { getConstant, getJavaCode } from '@/api/common/dict'
import ButtonGroup from '@/components/ButtonGroup/index.vue'
import { addUser, deleteUser, enableOrDisableUser, modifyUser, queryUserInfoById } from '@/api/user'
import UploadFile from '@/components/UploadFile/index.vue'
import { getDeptTree } from '@/api/dept'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'User',
  components: { UploadFile, ButtonGroup, PageTable, TreeSelect },
  data() {
    return {
      title: '',
      showSearch: true,
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
        nickName: undefined,
        currency: undefined,
        deptId: undefined,
        postId: undefined
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
        javaCodeNameList: ['RoleBuilder', 'CurrencyBuilder', 'PostBuilder']
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
      ],
      deptName: undefined,
      deptOptions: []
    }
  },
  watch: {
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  async created() {
    await this.initParam()
    await getDeptTree().then(res => {
      this.deptOptions = res.data
    })
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
    initParam() {
      if (this.$route.params.role) {
        this.queryForm.role = [this.$route.params.role]
      }
    },
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
          prop: 'deptName'
        },
        {
          label: '岗位',
          prop: 'postName'
        },
        {
          columnType: 'Constant',
          label: '启用状态',
          prop: 'enable',
          constant: {
            constantList: this.constant['Enable'],
            type: (row) => {
              if (row.enable === 1) {
                return 'success'
              }
              if (row.enable === 0) {
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
        this.title = '用户查看'
      })
    },
    handleEdit(index, row) {
      this.form = {
        id: undefined,
        username: undefined,
        password: undefined,
        role: undefined,
        avatar: undefined,
        defaultRole: undefined,
        nickName: undefined,
        currency: undefined,
        deptId: undefined,
        postId: undefined
      }
      queryUserInfoById(row.id).then(res => {
        const { data } = res
        Object.assign(this.form, data)
        this.addVisible = true
        this.addFormDisabled = false
        this.isAdd = false
        this.isView = true
        this.title = '用户修改'
      })
    },
    handleDel() {
      this.$confirm('是否删除选中数据, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const rows = this.$refs.tableList.checkedRows()
        const idArr = []
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
      return row.enable === 1
    },
    canDisable(row) {
      return row.enable === 0
    },
    enableUser(index, row) {
      enableOrDisableUser({ id: row.id, enable: 1 }).then(res => {
        const { code } = res
        if (code === '100') {
          this.$modal.msgSuccess(row.enable === 0 ? '已禁用' : '已启用')
          this.handlerQuery()
        }
      })
    },
    disableUser(index, row) {
      enableOrDisableUser({ id: row.id, enable: 0 }).then(res => {
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
      this.title = '用户新增'
    },
    closeAddForm() {
      this.$refs.form.resetFields()
      this.addVisible = false
    },
    submitForm() {
      if (!this.form.id) {
        addUser(this.form).then(res => {
          const { msg } = res
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
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.queryForm.deptId = data.id
      this.handlerQuery()
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
    }
  }
}
</script>
