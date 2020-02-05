import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 用户列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getUserList(params) {
  return request({
    url: '/api/user/userList',
    method: 'get',
    params
  })
}
