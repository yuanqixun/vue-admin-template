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

function loopTree(list, array) {
  array.forEach((item, i) => {
    // const _cobj = {}
    if (item.children.length > 0) {
      // _cobj.path = item.pagePath
      // _cobj.component = Layout
      // if (item.grade === 0) {
      //   _cobj.redirect = item.defaultPagePath
      // } else {
      //   _cobj.redirect = 'noRedirect'
      // }
      // _cobj.alwaysShow = true
      // _cobj.meta = { id: item.id, grade: item.grade, icon: 'el-icon-folder', title: item.name, fullPath: item.pagePath }
      // _cobj.children = []
      // loopTree(_cobj.children, item.children)
      // list.push(_cobj)
      let comp = allViews[item.uuid]
      if (!comp) {
        comp = allViews[404]
      }
      const menu = {
        path: item.pagePath,
        name: item.uuid,
        hidden: false,
        alwaysShow: true,
        component: item.grade === 0 ? Layout : comp,
        redirect: item.grade === 0 ? item.defaultPagePath : 'noRedirect',
        meta: { id: item.id, grade: item.grade, icon: 'el-icon-folder', title: item.name, fullPath: item.path },
        children: []
      }
      loopTree(menu.children, item.children)
      list.push(menu)
    } else {
      // 某些菜单关联明细页面，需要增加到路由表中
      const _hidden = item.hidden ? item.hidden : false
      let comp = allViews[item.uuid]
      if (!comp) {
        comp = allViews[404]
      }
      const menu = {
        path: item.pagePath,
        name: item.uuid,
        component: comp,
        hidden: _hidden,
        meta: { id: item.id, grade: item.grade, icon: 'el-icon-document', title: item.name, fullPath: item.path }
      }
      list.push(menu)
    }
  })
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(async resolve => {
      const resData = await getMyMenuList(roles)
      const menuRouters = []
      const menuList = resData.data
      loopTree(menuRouters, menuList)
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
