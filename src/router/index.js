import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    icon: 'svg-name'             the icon show in the sidebar
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
    redirect: '/',
    children: [{
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/index'),
      meta: { title: '首页', icon: 'el-icon-odometer', affix: true }
    }]
  },
  {
    path: '/system/config/UserProfile',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: '/system/config/UserProfile',
        name: 'system_config_UserProfile',
        component: () => import('@/views/system/config/UserProfile'),
        meta: {
          title: '个人设置'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/system/config/UserDetail',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: '/system/config/UserDetail',
        name: 'system_config_UserDetail',
        component: () => import('@/views/system/config/UserDetail'),
        meta: {
          title: '用户详情'
        },
        hidden: true
      }
    ]
  }
  // {
  //   path: '/system/config/RoleDetail',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   children: [
  //     {
  //       path: '/system/config/RoleDetail',
  //       name: 'system_config_RoleDetail',
  //       component: () => import('@/views/system/config/RoleDetail'),
  //       meta: {
  //         title: '角色详情'
  //       },
  //       hidden: true
  //     }
  //   ]
  // }
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

// 所有的页面，用以匹配动态路由
export const allViews = {
  demo_base: () => import('@/views/demo/index'),
  demo_base_BaseForm: () => import('@/views/demo/base/BaseForm'),
  demo_base_AdvanceForm: () => import('@/views/demo/base/AdvanceForm'),
  Vgrid: () => import('@/views/demo/base/vgrid'),
  Vtable: () => import('@/views/demo/base/vtable'),
  system_config: () => import('@/views/system/index'),
  system_config_MenuList: () => import('@/views/system/config/MenuList'),
  system_config_RoleList: () => import('@/views/system/config/RoleList'),
  system_config_RoleDetail: () => import('@/views/system/config/RoleDetail'),
  system_config_UserList: () => import('@/views/system/config/UserList'),
  router_view: () => import('@/views/router'),
  404: () => import('@/views/404')
}

// 实例化vue的时候只挂载constantRouter
export default router
