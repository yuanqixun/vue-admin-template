import request from '@/utils/request'

export function getAdminMenuList(params) {
  return request({
    url: '/api/menu/adminMenuSet',
    method: 'get',
    params
  })
}
