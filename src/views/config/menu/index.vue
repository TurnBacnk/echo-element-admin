<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" size="small" v-if="showSearch">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryForm.menuName"
          clearable
          placeholder="请输入菜单名称"
          @keyup.enter.native="handlerQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handlerQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="restQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <button-group :button-config="buttonConfig" :show-search.sync="showSearch" @queryTable="handlerQuery"/>
    <page-table
      ref="tableList"
      :query-form="queryForm"
      :data-source="dataSource"
      :table-column-config="tableColumnConfig"
      :tree-config="{children: 'children', hasChildren: 'hasChildren'}"
      :pageable="false"
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
        <el-form-item label="上级菜单" prop="parentId">
          <tree-select
            v-model="form.parentId"
            :options="cascadeOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="form.menuType">
            <el-radio label="1">目录</el-radio>
            <el-radio label="2">菜单</el-radio>
            <el-radio label="3">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.menuType === '1'">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover
              placement="bottom-start"
              width="460"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" :active-icon="form.menuIcon"/>
              <el-input slot="reference" v-model="form.menuIcon" placeholder="点击选择图标" readonly>
                <svg-icon
                  v-if="form.menuIcon"
                  slot="prefix"
                  :icon-class="form.menuIcon"
                  style="width: 25px;"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称"/>
          </el-form-item>
          <el-form-item label="显示顺序" prop="sort">
            <el-input-number v-model="form.sort" controls-position="right" :min="1"/>
          </el-form-item>
          <el-form-item label="路由地址" prop="menuPath">
            <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
            </span>
            <el-input v-model="form.menuPath" placeholder="请输入路由地址"/>
          </el-form-item>
          <el-form-item label="菜单状态">
            <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
              </span>
            <el-radio-group v-model="form.enable">
              <el-radio
                v-for="status in constant['Enable']"
                :key="status.value"
                :label="status.value"
              >{{ status.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-if="form.menuType === '2'">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover
              placement="bottom-start"
              width="460"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" :active-icon="form.menuIcon"/>
              <el-input slot="reference" v-model="form.menuIcon" placeholder="点击选择图标" readonly>
                <svg-icon
                  v-if="form.menuIcon"
                  slot="prefix"
                  :icon-class="form.menuIcon"
                  style="width: 25px;"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称"/>
          </el-form-item>
          <el-form-item label="显示顺序" prop="sort">
            <el-input-number v-model="form.sort" controls-position="right" :min="1"/>
          </el-form-item>
          <el-form-item label="路由地址" prop="menuPath">
            <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
            </span>
            <el-input v-model="form.menuPath" placeholder="请输入路由地址"/>
          </el-form-item>
          <el-form-item label="组件路径" prop="componentPath">
            <span slot="label">
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
            <el-input v-model="form.componentPath" placeholder="请输入组件路径" />
          </el-form-item>
          <el-form-item label="权限字符" prop="authKey">
            <el-input v-model="form.authKey" placeholder="请输入权限标识" maxlength="100"/>
            <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                            placement="top"
                >
                <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
          </el-form-item>
          <el-form-item prop="menuParam">
            <el-input v-model="form.menuParam" placeholder="请输入路由参数" maxlength="255" />
            <span slot="label">
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由参数
              </span>
          </el-form-item>
          <el-form-item prop="isHidden">
            <span slot="label">
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                显示状态
            </span>
            <el-radio-group v-model="form.isHidden">
              <el-radio
                v-for="status in constant['ShowHide']"
                :key="status.value"
                :label="status.value"
              >{{ status.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="enable">
            <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
            </span>
            <el-radio-group v-model="form.enable">
              <el-radio
                v-for="status in constant['Enable']"
                :key="status.value"
                :label="status.value"
              >{{ status.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-if="form.menuType === '3'">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称"/>
          </el-form-item>
          <el-form-item label="显示顺序" prop="sort">
            <el-input-number v-model="form.sort" controls-position="right" :min="1"/>
          </el-form-item>
          <el-form-item label="权限字符" prop="authKey">
            <el-input v-model="form.authKey" placeholder="请输入权限标识" maxlength="100"/>
            <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                            placement="top"
                >
                <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
          </el-form-item>
          <el-form-item label="菜单状态" prop="enable">
            <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
              </span>
            <el-radio-group v-model="form.enable">
              <el-radio
                v-for="status in constant['Enable']"
                :key="status.value"
                :label="status.value"
              >{{ status.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
      <template slot="footer" class="dialog-footer" v-if="isView">
        <el-button type="info" @click="closeAddForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>

import ButtonGroup from '@/components/ButtonGroup/index.vue'
import PageTable from '@/components/ListTable/index.vue'
import IconSelect from '@/components/IconSelect/index.vue'
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getConstant } from '@/api/common/dict'
import { deleteMenu, getMenuById, getMenuTree, insertMenu, modifyMenu } from '@/api/config/menu'

export default {
  name: 'Menu',
  components: { IconSelect, PageTable, ButtonGroup, TreeSelect },
  data() {
    return {
      showSearch: true,
      queryForm: {
        menuName: undefined
      },
      buttonConfig: [
        {
          text: '新增',
          click: () => {
            this.handleAdd()
          }
        }
      ],
      dataSource: '/api/menu/list',
      tableColumnConfig: [],
      // Add Dialog Param
      addDialogVisible: false,
      addFormDisabled: false,
      form: {
        id: undefined,
        parentId: undefined,
        menuType: undefined,
        menuName: undefined,
        menuIcon: undefined,
        sort: undefined,
        authKey: undefined,
        menuPath: undefined,
        componentPath: undefined,
        menuParam: undefined,
        isHidden: undefined,
        enable: undefined
      },
      javaCode: [],
      javaCodeConfig: {
        javaCodeNameList: ['MenuTreeBuilder']
      },
      constant: [],
      constantConfig: {
        constantNameList: ['Enable', 'ShowHide']
      },
      isView: true,
      cascadeOptions: [],
      formTitle: undefined,
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        menuPath: [
          { required: true, message: "路由地址不能为空", trigger: "blur" }
        ]
      }
    }
  },
  async created() {
    await getConstant(this.constantConfig).then(res => {
      const { data } = res
      this.constant = data
    })

    await this.initTree()

    await this.init()
  },
  methods: {
    init() {
      this.tableColumnConfig = [
        {
          fixed: 'left',
          label: '菜单名称',
          prop: 'menuName'
        },
        {
          columnType: 'Icon',
          label: '图标',
          prop: 'menuIcon'
        },
        {
          label: '排序',
          prop: 'sort'
        },
        {
          label: '权限标识',
          prop: 'authKey'
        },
        {
          label: '组件路径',
          prop: 'componentPath'
        },
        {
          columnType: 'Tag',
          label: '状态',
          prop: 'enable',
          tag: {
            type: (tag) => {
              if (tag === 1) {
                return 'success'
              }
              if (tag === 0) {
                return 'info'
              }
            },
            effect: 'light',
            dictList: this.constant['Enable'],
            isConvert: true
          }
        },
        {
          label: '创建时间',
          prop: 'createTime'
        },
        {
          columnType: 'Operation',
          label: '操作',
          button: [
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
              text: '删除',
              css: 'text',
              click: (index, row) => {
                this.handleDel(index, row)
              },
              isDisabled: (row)=> {
                return !!row.children;
              }
            }
          ]
        }
      ]
    },
    initTree() {
      getMenuTree().then(res => {
        const { data } = res
        this.cascadeOptions = data
      })
    },
    handlerQuery() {
      this.$refs.tableList.list()
    },
    restQuery() {
      this.queryForm = {
        menuName: undefined
      }
    },
    handleAdd() {
      this.formTitle = '菜单新增'
      this.addDialogVisible = true
      this.form.menuType = '1'
    },
    handleEdit(index, row) {
      this.formTitle = '菜单修改'
      this.addDialogVisible = true
      getMenuById(row.id).then(res => {
        const { data } = res
        Object.assign(this.form, data)
      })
    },
    handleDel(index , row) {
      // 删除
      deleteMenu(row.id).then(res => {
        const { msg } = res
        this.$modal.msgSuccess(msg)
        this.handlerQuery()
      })
    },
    // Add Dialog Methods
    closeAddForm() {
      this.addDialogVisible = false
      this.form = {
        id: undefined,
        parentId: undefined,
        menuType: undefined,
        menuName: undefined,
        menuIcon: undefined,
        sort: undefined,
        authKey: undefined,
        menuPath: undefined,
        componentPath: undefined,
        menuParam: undefined,
        isHidden: undefined,
        enable: undefined
      }
    },
    selected(name) {
      this.form.menuIcon = name
    },
    submitForm() {
      if (!this.form.id) {
        insertMenu(this.form).then(res => {
          const { msg } = res
          this.$modal.msgSuccess(msg)
          this.closeAddForm()
          this.handlerQuery()
          this.initTree()
        })
      } else {
        modifyMenu(this.form).then(res => {
          const { msg } = res
          this.$modal.msgSuccess(msg)
          this.closeAddForm()
          this.handlerQuery()
        })
      }
      this.initTree()
    },
    cascadeChange(value) {
      this.form.parentId = value[value.length - 1]
    },
    normalizer(node) {
      if (node.children == null) {
        delete node.children
      }
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      };
    },
  }
}

</script>
