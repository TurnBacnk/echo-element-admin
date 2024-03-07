<template>
  <div class="app-container">
    <el-form v-if="showSearch" ref="queryForm" :inline="true" size="small">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryForm.roleName"
          clearable
          placeholder="请输入角色名称"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonsConfig" :show-search.sync="showSearch" @queryTable="handleQuery" />
    <page-table
      ref="tableList"
      :query-form="queryForm"
      :data-source="dataSource"
      :table-column-config="tableColumnConfig"
    />
    <el-dialog
      :visible.sync="addVisible"
      title="角色新增"
      width="500px"
      append-to-body
      @close="closeAddForm"
    >
      <el-form ref="form" label-width="80px" :disabled="addFormDisabled" :model="form" :rules="rule">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" />
        </el-form-item>
        <el-form-item label="角色Key" prop="roleKey">
          <el-input v-model="form.roleKey" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree
            ref="menu"
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <template v-if="isDisplay" slot="footer" class="dialog-footer">
        <el-button type="info" @click="closeAddForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import PageTable from '@/components/ListTable/index.vue'
import ButtonGroup from '@/components/ButtonGroup/index.vue'
import { addRole, deleteRole, enableOrDisableRole, getMenuTreeByRoleId, getRoleById, modifyRole } from '@/api/config/role'
import { getMenuTree } from '@/api/config/menu'

export default {
  name: 'Role',
  components: { ButtonGroup, PageTable },
  data() {
    return {
      showSearch: true,
      dataSource: '/api/role/list',
      tableColumnConfig: [],
      queryForm: {
        roleName: undefined
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
      addVisible: false,
      form: {
        roleName: undefined,
        roleKey: undefined,
        sort: undefined,
        id: undefined,
        menuIdList: [],
        menuCheckStrictly: true
      },
      addFormDisabled: false,
      isDisplay: true,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      menuOptions: [],
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '角色Key不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  async created() {
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
          label: '角色名称',
          prop: 'roleName'
        },
        {
          label: '排序',
          prop: 'sort'
        },
        {
          columnType: 'Link',
          label: '用户数量',
          prop: 'roleUserNum',
          link: {
            click: (index, row) => {
              this.handleJumpToUserList(index, row)
            }
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
                this.handleEnable(row.id, 1)
              },
              isDisabled: (row) => {
                if (row.roleKey === 'admin') {
                  return true
                }

                return row.status === 1
              }
            },
            {
              text: '禁用',
              css: 'danger',
              click: (index, row) => {
                this.handleEnable(row.id, 0)
              },
              isDisabled: (row) => {
                if (row.roleKey === 'admin') {
                  return true
                }

                return row.status !== 1
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
        roleName: undefined
      }
    },
    // 跳转特殊的UserList页面
    handleJumpToUserList(index, row) {
      this.$router.push({
        name: 'User',
        params: {
          role: row.roleKey
        }
      })
    },
    handleEdit(index, row) {
      const id = row.id
      // 根据id查询数据
      getRoleById(id).then(res => {
        const { data } = res
        Object.assign(this.form, data)
        const selectedMenuTree = this.getSelectedMenuTree(id)
        getMenuTree().then(res => {
          const { data } = res
          this.menuOptions = data
          selectedMenuTree.then(res => {
            const { data } = res
            data.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false)
              })
            })
          })
        })
        this.addVisible = true
        this.isDisplay = true
      })
    },
    getSelectedMenuTree(id) {
      return getMenuTreeByRoleId(id).then(res => {
        return res
      })
    },
    canEdit(row) {
      return false
    },
    handleAdd() {
      this.getMenuTree()
      this.addVisible = true
      this.isDisplay = true
      this.form = {
        roleName: undefined,
        roleKey: undefined
      }
    },
    getMenuTree() {
      getMenuTree().then(res => {
        const { data } = res
        this.menuOptions = data
      })
    },
    handleDel() {
      const checkedRowsId = []
      this.$refs.tableList.checkedRows().forEach(function(element) {
        checkedRowsId.push(element.id)
      })
      deleteRole(checkedRowsId).then(res => {
        const { msg } = res
        this.$modal.msgSuccess(msg)
        this.handleQuery()
      })
    },
    handleEnable(id, status) {
      enableOrDisableRole(id, status).then(res => {
        const { msg } = res
        this.$modal.msgSuccess(msg)
        this.handleQuery()
      })
    },
    closeAddForm() {
      this.menuOptions = []
      this.$refs.form.resetFields()
      this.addVisible = false
    },
    submitForm() {
      // 校验
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.menuIdList = this.getMenuAllCheckedKeys()
          if (!this.form.id) {
            // 新增
            addRole(this.form).then(res => {
              const { msg } = res
              this.addVisible = false
              this.$modal.msgSuccess(msg)
              this.handleQuery()
            })
          } else {
            // 修改
            modifyRole(this.form).then(res => {
              const { msg } = res
              this.addVisible = false
              this.$modal.msgSuccess(msg)
              this.handleQuery()
            })
          }
        }
      })
    },
    handleCheckedTreeExpand(value, type) {
      if (type === 'menu') {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      } else if (type === 'dept') {
        const treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type === 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type === 'dept') {
        this.$refs.menu.setCheckedNodes(value ? this.deptOptions : [])
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type === 'menu') {
        this.form.menuCheckStrictly = !!value
      } else if (type === 'dept') {
        this.form.deptCheckStrictly = !!value
      }
    },
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    }
  }
}
</script>
