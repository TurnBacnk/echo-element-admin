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
    path: '/document/capital/sub',
    component: Layout,
    roles: ['admin'],
    hidden: true,
    children: [
      {
        path: 'capital-account-add',
        component: () => import('@/views/document/capital/capital-account-add.vue'),
        name: 'CapitalAccountAdd',
        meta: { activeMenu: '/document/capital', title: '资金账户登记' }
      },
      {
        path: 'capital-account-edit',
        component: () => import('@/views/document/capital/capital-account-edit.vue'),
        name: 'CapitalAccountEdit',
        meta: { activeMenu: '/document/category', title: '资金账户修改' }
      },
      {
        path: 'capital-account-view',
        component: () => import('@/views/document/capital/capital-account-view.vue'),
        name: 'CapitalAccountView',
        meta: { activeMenu: '/document/category', title: '资金账户查看' }
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
      },
      {
        path: 'inbound-approval',
        component: () => import('@/views/buy/inbound/inbound-approval.vue'),
        name: 'BuyInboundApproval',
        meta: { activeMenu: '/buy/inbound', title: '采购入库单审核' }
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
        name: 'BuyOrderReturnAdd',
        meta: { activeMenu: '/buy/return-order', title: '退货单登记' }
      },
      {
        path: 'return-order-edit',
        component: () => import('@/views/buy/return/return-order-edit.vue'),
        name: 'BuyReturnOrderEdit',
        meta: { activeMenu: '/buy/return-order', title: '退货单修改' }
      },
      {
        path: 'return-order-view',
        component: () => import('@/views/buy/return/return-order-view.vue'),
        name: 'BuyReturnOrderView',
        meta: { activeMenu: '/buy/return-order', title: '退货单' }
      },
      {
        path: 'return-order-approval',
        component: () => import('@/views/buy/return/return-order-approval.vue'),
        name: 'BuyReturnOrderApproval',
        meta: { activeMenu: '/buy/return-order', title: '退货单深恶黑' }
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
      },
      {
        path: 'sale-outbound-approval',
        component: () => import('@/views/sale/outbound/outbound-approval.vue'),
        name: 'SaleOutboundApproval',
        meta: { activeMenu: '/sale/outbound', title: '销售出库审核' }
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
      },
      {
        path: 'sale-return-order-approval',
        component: () => import('@/views/sale/return/sale-return-approval.vue'),
        name: 'SaleReturnOrderApproval',
        meta: { activeMenu: '/save/return', title: '销售退货审核' }
      }
    ]
  },
  {
    path: '/repo/stocktaking/sub',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'repo-stocktaking-add',
        component: () => import('@/views/repo/stocktaking/stocktaking-add.vue'),
        name: 'RepoStocktakingAdd',
        meta: { activeMenu: '/repo/stocktaking', title: '库存盘点' }
      },
      {
        path: 'repo-stocktaking-edit',
        component: () => import('@/views/repo/stocktaking/stocktaking-edit.vue'),
        name: 'RepoStocktakingEdit',
        meta: { activeMenu: '/repo/stocktaking', title: '库存盘点' }
      },
      {
        path: 'repo-stocktaking-view',
        component: () => import('@/views/repo/stocktaking/stocktaking-view.vue'),
        name: 'RepoStocktakingView',
        meta: { activeMenu: '/repo/stocktaking', title: '库存盘点' }
      }
    ]
  },
  {
    path: '/repo/other-inbound/sub',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'repo-other-inbound-add',
        component: () => import('@/views/repo/inbound/other-inbound-add.vue'),
        name: 'RepoOtherInboundAdd',
        meta: { activeMenu: '/repo/other-inbound', title: '其它入库登记' }
      },
      {
        path: 'repo-other-inbound-edit',
        component: () => import('@/views/repo/inbound/other-inbound-edit.vue'),
        name: 'RepoOtherInboundEdit',
        meta: { activeMenu: '/repo/other-inbound', title: '其它入库修改' }
      },
      {
        path: 'repo-other-inbound-view',
        component: () => import('@/views/repo/inbound/other-inbound-view.vue'),
        name: 'RepoOtherInboundView',
        meta: { activeMenu: '/repo/other-inbound', title: '其它入库查看' }
      },
      {
        path: 'repo-other-inbound-approval',
        component: () => import('@/views/repo/inbound/other-inbound-approval.vue'),
        name: 'RepoOtherInboundApproval',
        meta: { activeMenu: '/repo/other-inbound', title: '其它入库审核' }
      }
    ]
  },
  {
    path: '/repo/other-outbound/sub',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'repo-other-outbound-add',
        component: () => import('@/views/repo/outbound/other-outbound-add.vue'),
        name: 'RepoOtherOutboundAdd',
        meta: { activeMenu: '/repo/other-outbound', title: '其他出库登记' }
      },
      {
        path: 'repo-other-outbound-edit',
        component: () => import('@/views/repo/outbound/other-outbound-edit.vue'),
        name: 'RepoOtherOutboundEdit',
        meta: { activeMenu: '/repo/other-outbound', title: '其他出库修改' }
      },
      {
        path: 'repo-other-outbound-view',
        component: () => import('@/views/repo/outbound/other-outbound-view.vue'),
        name: 'RepoOtherOutboundView',
        meta: { activeMenu: '/repo/other-outbound', title: '其他出库查看' }
      },
      {
        path: 'repo-other-outbound-approval',
        component: () => import('@/views/repo/outbound/other-outbound-approval.vue'),
        name: 'RepoOtherOutboundApproval',
        meta: { activeMenu: '/repo/other-outbound', title: '其他出库审核' }
      }
    ]
  },
  {
    path: '/repo/transfer/sub',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'repo-transfer-add',
        component: () => import('@/views/repo/transfer/transfer-add.vue'),
        name: 'RepoTransferOrderAdd',
        meta: { activeMenu: '/repo/transfer/', title: '调拨单登记' }
      },
      {
        path: 'repo-transfer-edit',
        component: () => import('@/views/repo/transfer/transfer-edit.vue'),
        name: 'RepoTransferOrderEdit',
        meta: { activeMenu: '/repo/transfer/', title: '调拨单修改' }
      },
      {
        path: 'repo-transfer-view',
        component: () => import('@/views/repo/transfer/transfer-view.vue'),
        name: 'RepoTransferOrderView',
        meta: { activeMenu: '/repo/transfer/', title: '调拨单查看' }
      },
      {
        path: 'repo-transfer-approval',
        component: () => import('@/views/repo/transfer/transfer-approval.vue'),
        name: 'RepoTransferOrderApproval',
        meta: { activeMenu: '/repo/transfer/', title: '调拨单审核' }
      }
    ]
  },
  {
    path: '/repo/repo-materials',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'repo-materials-add',
        component: () => import('@/views/repo/materials/materials-add.vue'),
        name: 'RepoMaterialsAdd',
        meta: { activeMenu: '/repo/materials', title: '物资清单登记' }
      },
      {
        path: 'repo-materials-edit',
        component: () => import('@/views/repo/materials/materials-edit.vue'),
        name: 'RepoMaterialsEdit',
        meta: { activeMenu: '/repo/materials', title: '物资清单修改' }
      },
      {
        path: 'repo-materials-view',
        component: () => import('@/views/repo/materials/materials-view.vue'),
        name: 'RepoMaterialsView',
        meta: { activeMenu: '/repo/materials', title: '物资清单修改' }
      }
    ]
  },
  {
    path: '/repo/assembly/sub',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'repo-assembly-add',
        component: () => import('@/views/repo/assembly/assembly-add.vue'),
        name: 'RepoAssemblyAdd',
        meta: { activeMenu: '/repo/assembly', title: '组装单' }
      },
      {
        path: 'repo-assembly-edit',
        component: () => import('@/views/repo/assembly/assembly-edit.vue'),
        name: 'RepoAssemblyEdit',
        meta: { activeMenu: '/repo/assembly', title: '组装单' }
      },
      {
        path: 'repo-assembly-view',
        component: () => import('@/views/repo/assembly/assembly-view.vue'),
        name: 'RepoAssemblyView',
        meta: { activeMenu: '/repo/assembly', title: '组装单' }
      },
      {
        path: 'repo-assembly-approval',
        component: () => import('@/views/repo/assembly/assembly-approval.vue'),
        name: 'RepoAssemblyApproval',
        meta: { activeMenu: '/repo/assembly', title: '组装单' }
      }
    ]
  },
  {
    path: '/financial/receive-order/sub',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'receive-order-add',
        component: () => import('@/views/financial/receive-order/receive-order-add.vue'),
        name: 'FinancialReceiveOrderAdd',
        meta: { activeMenu: '/financial/receiver-order-add', title: '收款单登记' }
      },
      {
        path: 'receive-order-edit',
        component: () => import('@/views/financial/receive-order/receive-order-edit.vue'),
        name: 'FinancialReceiveOrderEdit',
        meta: { activeMenu: '/financial/receiver-order', title: '收款单修改' }
      },
      {
        path: 'receive-order-view',
        component: () => import('@/views/financial/receive-order/receive-order-view.vue'),
        name: 'FinancialReceiveOrderView',
        meta: { activeMenu: '/financial/receiver-order', title: '收款单' }
      },
      {
        path: 'receive-order-approval',
        component: () => import('@/views/financial/receive-order/receive-order-approval.vue'),
        name: 'FinancialReceiveOrderApproval',
        meta: { activeMenu: '/financial/receiver-order', title: '收款单审核' }
      }
    ]
  },
  {
    path: '/financial/payment-order/sub',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'payment-order-add',
        component: () => import('@/views/financial/payment-order/payment-order-add.vue'),
        name: 'FinancialPaymentOrderAdd',
        meta: { activeMenu: '/financial/payment-order', title: '付款单登记' }
      },
      {
        path: 'payment-order-edit',
        component: () => import('@/views/financial/payment-order/payment-order-edit.vue'),
        name: 'FinancialPaymentOrderEdit',
        meta: { activeMenu: '/financial/payment-order', title: '付款单修改' }
      },
      {
        path: 'payment-order-view',
        component: () => import('@/views/financial/payment-order/payment-order-view.vue'),
        name: 'FinancialPaymentOrderView',
        meta: { activeMenu: '/financial/payment-order', title: '付款单' }
      },
      {
        path: 'payment-order-approval',
        component: () => import('@/views/financial/payment-order/payment-order-approval.vue'),
        name: 'FinancialPaymentOrderApproval',
        meta: { activeMenu: '/financial/payment-order', title: '付款单审核' }
      }
    ]
  },
  {
    path: '/financial/invoice-order/sub',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'invoice-order-add',
        component: () => import('@/views/financial/invoice-order/invoice-order-add.vue'),
        name: 'FinancialInvoiceOrderAdd',
        meta: { activeMenu: '/financial/invoice', title: '销售开票登记' }
      },
      {
        path: 'invoice-order-edit',
        component: () => import('@/views/financial/invoice-order/invoice-order-edit.vue'),
        name: 'FinancialInvoiceOrderEdit',
        meta: { activeMenu: '/financial/invoice', title: '销售开票修改' }
      },
      {
        path: 'invoice-order-view',
        component: () => import('@/views/financial/invoice-order/invoice-order-view.vue'),
        name: 'FinancialInvoiceOrderView',
        meta: { activeMenu: '/financial/invoice', title: '销售开票' }
      },
      {
        path: 'invoice-order-approval',
        component: () => import('@/views/financial/invoice-order/invoice-order-approval.vue'),
        name: 'FinancialInvoiceOrderApproval',
        meta: { activeMenu: '/financial/invoice', title: '销售开票' }
      }
    ]
  },
  {
    path: '/financial-write-off/sub',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'write-off-add',
        component: () => import('@/views/financial/write-off/write-off-add.vue'),
        name: 'FinancialWriteOffAdd',
        meta: { activeMenu: '/financial/write-off', title: '核销单登记' }
      },
      {
        path: 'write-off-edit',
        component: () => import('@/views/financial/write-off/write-off-edit.vue'),
        name: 'FinancialWriteOffEdit',
        meta: { activeMenu: '/financial/write-off', title: '核销单修改' }
      },
      {
        path: 'write-off-view',
        component: () => import('@/views/financial/write-off/write-off-edit.vue'),
        name: 'FinancialWriteOffView',
        meta: { activeMenu: '/financial/write-off', title: '核销单' }
      },
      {
        path: 'write-off-approval',
        component: () => import('@/views/financial/write-off/write-off-approval.vue'),
        name: 'FinancialWriteOffApproval',
        meta: { activeMenu: '/financial-write-off', title: '核销单审核' }
      }
    ]
  },
  {
    path: '/financial-ticket-order/sub',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'ticket-order-add',
        component: () => import('@/views/financial/ticket-order/ticket-order-add.vue'),
        name: 'FinancialTicketOrderAdd',
        meta: { activeMenu: '/financial/ticket-order', title: '采购收票登记' }
      },
      {
        path: 'ticket-order-edit',
        component: () => import('@/views/financial/ticket-order/ticket-order-edit.vue'),
        name: 'FinancialTicketOrderEdit',
        meta: { activeMenu: '/financial/ticket-order', title: '采购收票修改' }
      },
      {
        path: 'ticket-order-view',
        component: () => import('@/views/financial/ticket-order/ticket-order-view.vue'),
        name: 'FinancialTicketOrderView',
        meta: { activeMenu: '/financial/ticket-order', title: '采购收票' }
      },
      {
        path: 'ticket-order-approval',
        component: () => import('@/views/financial/ticket-order/ticket-order-approval.vue'),
        name: 'FinancialTicketOrderApproval',
        meta: { activeMenu: '/financial/ticket-order', title: '采购收票审核' }
      }
    ]
  },
  {
    path: '/financial-other-receive/sub',
    component: Layout,
    hidden: true,
    roles: ['user'],
    children: [
      {
        path: 'other-receive-add',
        component: () => import('@/views/financial/other-receive/other-receive-add.vue'),
        name: 'FinancialOtherReceiveAdd',
        meta: { activeMenu: '/financial/other-receive', title: '其他收入登记' }
      },
      {
        path: 'other-receive-edit',
        component: () => import('@/views/financial/other-receive/other-receive-edit.vue'),
        name: 'FinancialOtherReceiveEdit',
        meta: { activeMenu: '/financial/other-receive', title: '其他收入修改' }
      },
      {
        path: 'other-receive-view',
        component: () => import('@/views/financial/other-receive/other-receive-view.vue'),
        name: 'FinancialOtherReceiveView',
        meta: { activeMenu: '/financial/other-receive', title: '其他收入' }
      },
      {
        path: 'other-receive-approval',
        component: () => import('@/views/financial/other-receive/other-receive-approval.vue'),
        name: 'FinancialOtherReceiveApproval',
        meta: { activeMenu: '/financial/other-receive', title: '其他收入审核' }
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
