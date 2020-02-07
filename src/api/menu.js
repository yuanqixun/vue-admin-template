import request from '@/utils/request'

export function getAdminMenuList(params) {
  return request({
    url: '/api/menu/adminMenuSet',
    method: 'get',
    params
  })
}

export function saveMenuItem(data) {
  debugger
  return request({
    url: '/api/menu/saveMenuItem',
    method: 'post',
    data
  })
}


