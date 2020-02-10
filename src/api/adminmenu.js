import request from '@/utils/request'

export function getMenuList(params) {
  return request({
    url: '/api/adminmenu/editAdminMenuList',
    method: 'get',
    params
  })
}

export function saveMenuItem(data) {
  return request({
    url: '/api/adminmenu/saveMenuItem',
    method: 'post',
    data
  })
}

export function remove(id) {
  return request({
    url: '/api/adminmenu/remove',
    method: 'post',
    params: { id }
  })
}

export function moveup(id) {
  return request({
    url: '/api/adminmenu/moveup',
    method: 'post',
    params: { id }
  })
}

export function movedown(id) {
  return request({
    url: '/api/adminmenu/movedown',
    method: 'post',
    params: { id }
  })
}



