import request from '@/utils/request'
/**
 * 用户列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getUserList(pageable,data) {
  return request({
    url: '/api/adminuser/userList',
    method: 'post',
    params: pageable,
    data
  })
}
