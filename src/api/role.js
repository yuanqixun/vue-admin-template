import request from '@/utils/request'

export function getAdminRoleList(params) {
  return request({
    url: '/api/role/adminRoleList',
    method: 'get',
    params
  })
}

/**
 * 管理员角色授权详情
 * @param params
 * @returns {AxiosPromise}
 */
export function getAdminRoleAuthDetail(params) {
  return request({
    url: '/api/role/adminRoleAuthDetail',
    method: 'get',
    params
  })
}
