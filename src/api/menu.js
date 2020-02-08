import request from '@/utils/request'

export function getAdminMenuList(params) {
  return request({
    url: '/api/menu/adminMenuSet',
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



