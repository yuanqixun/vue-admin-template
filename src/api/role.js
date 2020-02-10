import request from '@/utils/request'

export function getEditRoleList(pageable,data) {
  return request({
    url: '/api/role/editRoleList',
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
export function getEditRoleAuthDetail(params) {
  return request({
    url: '/api/role/editRoleAuthDetail',
    method: 'post',
    params
  })
}

export function saveForm(data) {
  return request({
    url: '/api/role/saveRoleAuthDetail',
    method: 'post',
    data
  })
}
