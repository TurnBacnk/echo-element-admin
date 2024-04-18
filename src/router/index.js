import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
 roles: ['admin','editor']    control the page roles (you can set multiple roles)
 title: 'title'               the name show in sidebar and breadcrumb (recommend set)
 icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
 breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
 activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
 }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/login.vue'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index_v1.vue'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/config/dept/sub',
    component: Layout,
    hidden: true,
    // roles: ['admin'],
    permissions: ['dept:admin:add'],
    children: [
      {
        path: 'add',
        component: () => import('@/views/config/dept/dept-add.vue'),
        name: 'DeptAdd',
        meta: { activeMenu: '/config/dept', title: '部门新增' }
      },
      {
        path: 'edit',
        component: () => import('@/views/config/dept/dept-edit.vue'),
        name: 'DeptEdit',
        meta: { activeMenu: '/config/dept', title: '部门修改' }
      }
    ]
  },
  {
    path: '/config/workflow/sub',
    component: Layout,
    permissions: ['workflow:admin:list'],
    hidden: true,
    children: [
      {
        path: 'workspace',
        component: () =>
          import('@/views/config/workflow/component/workspace.vue'),
        name: 'WorkSpace',
        meta: { activeMenu: '/config/workflow', title: '工作区' }
      },
      {
        path: 'formsPanel',
        component: () =>
          import('@/views/config/workflow/component/formsPanel.vue'),
        name: 'FormsPanel',
        meta: { activeMenu: '/config/workflow', title: '管理后台' }
      }
    ]
  },
  {
    path: '/config/generate-code/sub',
    component: Layout,
    permissions: ['generate-code:admin:list'],
    hidden: true,
    children: [
      {
        path: 'generate-code-add',
        component: () =>
          import('@/views/config/generatecode/generate-code-add.vue'),
        name: 'GenerateCodeAdd',
        meta: { activeMenu: '/config/generate-code', title: '生成规则配置' }
      },
      {
        path: 'generate-code-edit',
        component: () =>
          import('@/views/config/generatecode/generate-code-edit.vue'),
        name: 'GenerateCodeEdit',
        meta: { activeMenu: '/config/generate-code', title: '生成规则修改' }
      }
    ]
  },
  {
    path: '/config/module/sub',
    component: Layout,
    permissions: ['module:admin:list'],
    hidden: true,
    children: [
      {
        path: 'module-add',
        component: () => import('@/views/config/module/module-add.vue'),
        name: 'ModuleAdd',
        meta: { activeMenu: '/config/module', title: '模块注册' }
      },
      {
        path: 'module-edit',
        component: () => import('@/views/config/module/module-edit.vue'),
        name: 'ModuleEdit',
        meta: { activeMenu: '/config/module', title: '模块修改' }
      }
    ]
  },
  {
    path: '/config/dict/sub',
    component: Layout,
    permissions: ['dict:admin:list'],
    hidden: true,
    children: [
      {
        path: 'dict-add',
        component: () => import('@/views/config/dict/dict-add.vue'),
        name: 'DictAdd',
        meta: { activeMenu: '/config/dict', title: '字典新增' }
      },
      {
        path: 'dict-edit',
        component: () => import('@/views/config/dict/dict-edit.vue'),
        name: 'DictEdit',
        meta: { activeMenu: '/config/dict', title: '字典修改' }
      }
    ]
  },
  {
    path: '/document/product/sub',
    component: Layout,
    // permissions: ['productInfo:user:list'],
    roles: ['user'],
    hidden: true,
    children: [
      {
        path: 'product-info-add',
        component: () =>
          import('@/views/document/product/product-info-add.vue'),
        name: 'ProductInfoAdd',
        meta: { activeMenu: '/document/product', title: '产品登记' }
      },
      {
        path: 'product-info-edit',
        component: () =>
          import('@/views/document/product/product-info-edit.vue'),
        name: 'ProductInfoEdit',
        meta: { activeMenu: '/document/product', title: '产品修改' }
      }
    ]
  },
  {
    path: '/document/category/sub',
    component: Layout,
    // permissions: ['category:user:list'],
    roles: ['user'],
    hidden: true,
    children: [
      {
        path: 'category-add',
        component: () => import('@/views/document/category/category-add.vue'),
        name: 'CategoryAdd',
        meta: { activeMenu: '/document/category', title: '类别登记' }
      },
      {
        path: 'category-edit',
        component: () => import('@/views/document/category/category-edit.vue'),
        name: 'CategoryEdit',
        meta: { activeMenu: '/document/category', title: '类别修改' }
      }
    ]
  },
  {
    path: '/document/client/sub',
    component: Layout,
    // permissions: ['client:user:list'],
    roles: ['user'],
    hidden: true,
    children: [
      {
        path: 'client-add',
        component: () => import('@/views/document/client/client-add.vue'),
        name: 'ClientAdd',
        meta: { activeMenu: '/document/client', title: '客户信息登记' }
      },
      {
        path: 'client-edit',
        component: () => import('@/views/document/client/client-edit.vue'),
        name: 'ClientEdit',
        meta: { activeMenu: '/document/client', title: '客户信息修改' }
      }
    ]
  },
  {
    path: '/document/vendor/sub',
    component: Layout,
    // permissions: ['vendor:user:list'],
    roles: ['user'],
    hidden: true,
    children: [
      {
        path: 'vendor-add',
        component: () => import('@/views/document/vendor/vendor-add.vue'),
        name: 'VendorAdd',
        meta: { activeMenu: '/document/vendor', title: '供应商信息登记' }
      },
      {
        path: 'vendor-edit',
        component: () => import('@/views/document/vendor/vendor-edit.vue'),
        name: 'VendorEdit',
        meta: { activeMenu: '/document/vendor', title: '供应商信息修改' }
      }
    ]
  },
  {
    path: '/document/warehouse/sub',
    component: Layout,
    // permissions: ['warehouse:user:list'],
    roles: ['user'],
    hidden: true,
    children: [
      {
        path: 'warehouse-add',
        component: () => import('@/views/document/warehouse/warehouse-add.vue'),
        name: 'WarehouseAdd',
        meta: { activeMenu: '/document/warehouse', title: '仓库信息登记' }
      },
      {
        path: 'warehouse-edit',
        component: () => import('@/views/document/warehouse/warehouse-edit.vue'),
        name: 'WarehouseEdit',
        meta: { activeMenu: '/document/warehouse', title: '仓库信息修改' }
      }
    ]
  },
  {
    path: '/buy/order/sub',
    component: Layout,
    // permissions: ['order:user:list'],
    roles: ['user'],
    hidden: true,
    children: [
      {
        path: 'order-add',
        component: () => import('@/views/buy/order/order-add.vue'),
        name: 'BuyOrderAdd',
        meta: { activeMenu: '/buy/order', title: '采购订单登记' }
      },
      {
        path: 'order-edit',
        component: () => import('@/views/buy/order/order-edit.vue'),
        name: 'BuyOrderEdit',
        meta: { activeMenu: '/buy/order', title: '采购订单修改' }
      },
      {
        path: 'order-view',
        component: () => import('@/views/buy/order/order-view.vue'),
        name: 'BuyOrderView',
        meta: { activeMenu: '/buy/order', title: '采购订单' }
      },
      {
        path: 'order-approval',
        component: () => import('@/views/buy/order/order-approval.vue'),
        name: 'BuyOrderApproval',
        meta: { activeMenu: '/buy/order', title: '采购订单审核' }
      }
    ]
  },
  {
    path: '/buy/inbound/sub',
    component: Layout,
    // permissions: ['inbound:user:list'],
    roles: ['user'],
    hidden: true,
    children: [
      {
        path: 'inbound-add',
        component: () => import('@/views/buy/inbound/inbound-add.vue'),
        name: 'BuyInboundAdd',
        meta: { activeMenu: '/buy/inbound', title: '采购入库单登记' }
      },
      {
        path: 'inbound-edit',
        component: () => import('@/views/buy/inbound/inbound-edit.vue'),
        name: 'BuyInboundEdit',
        meta: { activeMenu: '/buy/inbound', title: '采购入库单修改' }
      },
      {
        path: 'inbound-view',
        component: () => import('@/views/buy/inbound/inbound-view.vue'),
        name: 'BuyInboundView',
        meta: { activeMenu: '/buy/inbound', title: '采购入库单' }
      }
    ]
  },
  {
    path: '/buy/return/sub',
    component: Layout,
    // permissions: ['return-order:user:list'],
    roles: ['user'],
    hidden: true,
    children: [
      {
        path: 'return-order-add',
        component: () => import('@/views/buy/return/return-order-add.vue'),
        name: 'ReturnOrderAdd',
        meta: { activeMenu: '/buy/return-order', title: '退货单登记' }
      }
    ]
  },
  {
    path: '/config/approval/sub',
    component: Layout,
    permissions: ['approval:admin:list'],
    hidden: true,
    children: [
      {
        path: 'approval-add',
        component: () => import('@/views/config/approval/approval-add.vue'),
        name: 'ApprovalAdd',
        meta: { activeMenu: '/config/approval', title: '审核定义' }
      },
      {
        path: 'approval-ediut',
        component: () => import('@/views/config/approval/approval-edit.vue'),
        name: 'ApprovalEdit',
        meta: { activeMenu: '/config/approval', title: '审核定义修改' }
      }
    ]
  },
  {
    path: '/sale/sale-order/sub',
    component: Layout,
    // permissions: ['order:user:list'],
    roles: ['user'],
    hidden: true,
    children: [
      {
        path: 'sale-order-add',
        component: () => import('@/views/sale/order/sale-order-add.vue'),
        name: 'SaleOrderAdd',
        meta: { activeMenu: '/sale/order', title: '销售订单登记' }
      },
      {
        path: 'sale-order-edit',
        component: () => import('@/views/sale/order/sale-order-edit.vue'),
        name: 'SaleOrderEdit',
        meta: { activeMenu: '/sale/order', title: '销售订单修改' }
      },
      {
        path: 'sale-order-view',
        component: () => import('@/views/sale/order/sale-order-view.vue'),
        name: 'SaleOrderView',
        meta: { activeMenu: '/sale/order', title: '销售订单' }
      },
      {
        path: 'sale-order-approval',
        component: () => import('@/views/sale/order/sale-order-approval.vue'),
        name: 'SaleOrderApproval',
        meta: { activeMenu: '/sale/order', title: '销售订单审核' }
      }
    ]
  },
  {
    path: '/sale/outbound/sub',
    component: Layout,
    // permissions: ['sale-outbound:user:list'],
    roles: ['user'],
    hidden: true,
    children: [
      {
        path: 'sale-outbound-add',
        component: () => import('@/views/sale/outbound/outbound-add.vue'),
        name: 'SaleOutboundAdd',
        meta: { activeMenu: '/sale/outbound', title: '销售出库登记' }
      },
      {
        path: 'sale-outbound-edit',
        component: () => import('@/views/sale/outbound/outbound-edit.vue'),
        name: 'SaleOutboundEdit',
        meta: { activeMenu: '/sale/outbound', title: '销售出库修改' }
      },
      {
        path: 'sale-outbound-view',
        component: () => import('@/views/sale/outbound/outbound-view.vue'),
        name: 'SaleOutboundView',
        meta: { activeMenu: '/sale/outbound', title: '销售出库' }
      }
    ]
  },
  {
    path: '/sale/return-order/sub',
    component: Layout,
    // permissions: ['sale-return-order:user:list'],
    roles: ['user'],
    hidden: true,
    children: [
      {
        path: 'sale-return-order-add',
        component: () => import('@/views/sale/return/sale-return-order-add.vue'),
        name: 'SaleReturnOrderAdd',
        meta: { activeMenu: '/sale/return', title: '销售退货登记' }
      },
      {
        path: 'sale-return-order-edit',
        component: () => import('@/views/sale/return/sale-return-order-edit.vue'),
        name: 'SaleReturnOrderEdit',
        meta: { activeMenu: '/save/return', title: '销售退货修改' }
      },
      {
        path: 'sale-return-order-view',
        component: () => import('@/views/sale/return/sale-return-order-view.vue'),
        name: 'SaleReturnOrderView',
        meta: { activeMenu: '/save/return', title: '销售退货' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
