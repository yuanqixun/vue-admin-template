import request from '@/utils/request'

export function getAdminMenuList(params) {
  return request({
    url: '/api/menu/editMenuList',
    method: 'get',
    params
  })
}

export function getMenuList(params) {
  return request({
    url: '/api/menu/editMenuList',
    method: 'get',
    params
  })
}

export function saveMenuItem(data) {
  return request({
    url: '/api/menu/saveMenuItem',
    method: 'post',
    data
  })
}

export function remove(id) {
  return request({
    url: '/api/menu/remove',
    method: 'post',
    params: { id }
  })
}

export function moveup(id) {
  return request({
    url: '/api/menu/moveup',
    method: 'post',
    params: { id }
  })
}

export function movedown(id) {
  return request({
    url: '/api/menu/movedown',
    method: 'post',
    params: { id }
  })
}

export function getAllFunctionList() {
  return new Promise(resolve => {
    const result = {
      errcode: 0,
      success: true,
      data: [
        {
          'uuid': 'system',
          'name': '系统管理',
          'children': [
            {
              'uuid': 'system.config',
              'name': '系统配置',
              'children': [
                {
                  'uuid': 'system.config.MenuList',
                  'name': '菜单设置',
                  'pagePath': '/system/config/MenuList'
                }, {
                  'uuid': 'system.config.RoleList',
                  'name': '角色管理',
                  'pagePath': '/system/config/RoleList',
                  'subPages': [
                    {
                      'uuid': 'system.config.RoleDetail',
                      'name': '角色详情',
                      'pagePath': '/system/config/RoleDetail'
                    },{
                      'uuid': 'system.config.RoleMember',
                      'name': '角色成员',
                      'pagePath': '/system/config/RoleMember'
                    }
                  ]
                }, {
                  'uuid': 'system.config.UserList',
                  'name': '用户管理',
                  'pagePath': '/system/config/UserList',
                  'subPages': [
                    {
                      'uuid': 'system.config.UserDetail',
                      'name': '用户详情',
                      'pagePath': '/system/config/UserDetail'
                    }
                  ]
                }
              ]
            }
          ]
        }, {
          'uuid': 'demo',
          'name': '演示系统',
          'children': [
            {
              'uuid': 'demo.base.BaseForm',
              'name': '基本表单',
              'pagePath': '/demo/base/BaseForm'
            }, {
              'uuid': 'demo.base.AdvanceForm',
              'name': '高级表单',
              'pagePath': '/demo/base/AdvanceForm'
            }
          ]
        }
      ]
    }
    resolve(result)
  })
}



