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
    component: () => import('@/views/login/index'),
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
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/base',
    component: Layout,
    name: 'Base',
    meta: {
      title: '基础信息',
      icon: 'el-icon-document'
    },
    children: [
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/business/base/product/index.vue'),
        meta: {
          title: '产品资料',
          icon: 'product',
          permissions: ['business:product:all']
        },
        children: [
          {
            path: 'category',
            component: () => import('@/views/business/base/product/category/index.vue'),
            name: 'Category',
            meta: {
              title: '产品分类',
              roles: ['admin'],
              icon: 'category'
            }
          },
          {
            path: 'categoryView/:id',
            component: () => import('@/views/business/base/product/category/sub-view/category-view.vue'),
            name: 'ProductCategoryView',
            hidden: true,
            meta: {
              title: '产品-查看',
              roles: ['admin'],
              icon: 'category',
              permissions: ['business:product:view']
            }
          },
          {
            path: 'categoryAdd',
            component: () => import('@/views/business/base/product/category/sub-view/category-add.vue'),
            name: 'ProductCategoryAdd',
            hidden: true,
            meta: {
              title: '产品-新增',
              roles: ['admin'],
              icon: 'category',
              permissions: ['business:product:add']
            }
          },
          {
            path: 'categoryEdit/:id',
            component: () => import('@/views/business/base/product/category/sub-view/category-edit.vue'),
            name: 'ProductCategoryEdit',
            hidden: true,
            meta: {
              title: '产品-修改',
              roles: ['admin'],
              icon: 'category',
              permissions: ['business:product:edit']
            }
          },
          {
            path: 'quantity',
            component: () => import('@/views/business/base/product/quantity/index.vue'),
            name: 'Quantity',
            meta: {
              title: '产品库存',
              roles: ['admin'],
              icon: 'quantity'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    name: 'Monitor',
    meta: {
      title: '系统状态',
      icon: 'monitor',
      permissions: ['business:monitor:all']
    },
    children: [
      {
        path: 'druid',
        component: () => import('@/views/business/monitor/druid/index.vue'),
        name: 'Druid',
        meta: {
          title: '数据监控',
          roles: ['admin'],
          icon: 'druid'
        }
      },
      {
        path: 'login',
        component: () => import('@/views/business/monitor/login/index.vue'),
        name: 'Login',
        meta: {
          title: '在线用户',
          roles: ['admin'],
          icon: 'user'
        }
      },
      {
        path: 'cache',
        component: () => import('@/views/business/monitor/cache/index.vue'),
        name: 'Cache',
        meta: {
          title: '缓存监控',
          roles: ['admin'],
          icon: 'cache'
        }
      },
      {
        path: 'cache-list',
        component:() => import('@/views/business/monitor/cache/list.vue'),
        name: 'CacheList',
        meta: {
          title: '缓存列表',
          roles: ['admin'],
          icon: 'cacheList'
        }
      },
      {
        path: 'server',
        component: () => import('@/views/business/monitor/server/index.vue'),
        name: 'Server',
        meta: {
          title: '服务监控',
          roles: ['admin'],
          icon: 'server'
        }
      }
    ]
  },
  {
    path: '/Config',
    name: 'Config',
    component: Layout,
    meta: {
      title: '系统设置',
      roles: ['admin'],
      icon: 'config'
    },
    alwaysShow: true,
    children: [
      {
        path: 'user',
        component: () => import('@/views/config/user/index.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          roles: ['admin'],
          icon: 'user'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/config/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          roles: ['admin'],
          icon: 'role'
        }
      },
      {
        path: 'menu',
        component: () => import('@/views/config/menu/index.vue'),
        name: 'Menu',
        meta: {
          title: '菜单管理',
          roles: ['admin'],
          icon: 'menu'
        }
      },
      {
        path: 'task',
        component: () => import('@/views/config/task/index.vue'),
        name: 'Task',
        meta: {
          title: '定时任务',
          roles: ['admin'],
          icon: 'task'
        }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
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
