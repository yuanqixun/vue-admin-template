import request from '@/utils/request'

export function getAdminRoleList(params) {
  return request({
    url: '/api/role/adminRoleList',
    method: 'get',
    params
  })
}
