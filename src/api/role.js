import request from '@/utils/request'

export function getAdminRoleList(pageable,data) {
  return request({
    url: '/api/role/adminRoleList',
    method: 'post',
    params: pageable,
    data
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
