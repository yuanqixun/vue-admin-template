import { constantRoutes, allViews } from '@/router'
import { getMyMenuList } from '@/api/auth'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归转换为路由列表
 * @param routes
 * @param menuList
 */
function convertRoutes(routers, menuList) {
  routers.forEach(r => {
    menuList.forEach((m, i) => {
      if (m.pid && m.pid === r.meta.id) {
        if (!r.children) r.children = []
        m.fullPath = r.meta.fullPath + '/' + m.path
        // 某些菜单关联明细页面，需要增加到路由表中
        const _hidden = m.hidden ? m.hidden : false
        let comp = allViews[m.name]
        if (!comp) {
          comp = allViews[404]
        }
        const menu = {
          path: m.path,
          name: m.name,
          component: comp,
          hidden: _hidden,
          meta: { id: m.id, icon: 'el-icon-document', title: m.title, fullPath: r.meta.fullPath + '/' + m.path }
        }
        r.children.push(menu)
      }
    })
    if (r.children) convertRoutes(r.children, menuList)
  })
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(async resolve => {
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      const resData = await getMyMenuList(roles)
      const menuRouters = []
      const menuList = resData.data
      // 先取出根节点，没有父id的就是根节点
      menuList.forEach((m, i) => {
        if (m.pid == null) {
          m.fullPath = '/' + m.path
          const module = {
            path: '/' + m.path,
            // name: m.name,
            component: Layout,
            redirect: 'noRedirect',
            alwaysShow: true,
            meta: { id: m.id, icon: 'el-icon-folder', title: m.title, fullPath: '/' + m.path, breadcrumb: false },
            children: []
          }
          menuRouters.push(module)
        }
      })
      // 递归调用
      convertRoutes(menuRouters, menuList)
      // 压入404页面
      const notfound = { path: '*', redirect: '/404', hidden: true }
      menuRouters.push(notfound)
      commit('SET_ROUTES', menuRouters)
      resolve(menuRouters)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
