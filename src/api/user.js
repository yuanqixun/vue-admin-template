import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

/**
 * 用户列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getUserList(pageable,data) {
  return request({
    url: '/api/user/userList',
    method: 'post',
    params: pageable,
    data
  })
}

export function getEditUserDetail(params) {
  return request({
    url: '/api/user/editUserDetail',
    method: 'post',
    params
  })
}

export function saveUserDetail(data) {
  return request({
    url: '/api/user/saveUserDetail',
    method: 'post',
    data
  })
}
