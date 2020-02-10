import store from '@/store'
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
    if (item.children && item.children.length > 0) {
      let item_comp = Layout
      let item_name = ''
      let item_redirect = 'noRedirect'
      if(item.grade >= 1){
        item_comp = allViews['router_view']
        item_name = 'router_view'
      }
      // router_view的key为pagePath
      item.pagePath = '/' + item.id
      // 顶部导航时设置为 defaultPagePath
      if(item.grade == 0 && store.state.settings.showTopNavBar){
        item_redirect = item.defaultPagePath
      }
      const menu = {
        path: item.pagePath,
        name: item_name,
        hidden: false,
        alwaysShow: true,
        component: item_comp,
        redirect: item_redirect,
        meta: { id: item.id, grade: item.grade, icon: 'el-icon-folder', title: item.name, fullPath: item.pagePath },
        children: []
      }
      loopTree(menu.children, item.children)
      list.push(menu)
    } else {
      // 某些菜单关联明细页面，需要增加到路由表中
      const _hidden = item.hidden ? item.hidden : false
      let viewkey = item.uuid.replace(/([.])/g,"_")
      let comp = allViews[viewkey]
      if (!comp) {
        comp = allViews[404]
      }
      const menu = {
        path: item.pagePath,
        name: viewkey,
        component: comp,
        hidden: _hidden,
        meta: { id: item.id, grade: item.grade, icon: 'el-icon-document', title: item.name, fullPath: item.pagePath }
      }
      list.push(menu)
      if(item.subPages) {
        const _subPagesArray = JSON.parse(item.subPages)
        _subPagesArray.forEach((sub,subIndex) => {
          let subKey = sub.uuid.replace(/([.])/g,"_")
          let sub_comp = allViews[subKey]
          if (!sub_comp) {
            sub_comp = allViews[404]
          }
          const hidden_menu = {
            path: sub.pagePath,
            name: subKey,
            component: sub_comp,
            hidden: true,
            meta: { title: sub.name, fullPath: sub.pagePath }
          }
          list.push(hidden_menu)
        })
      }
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
