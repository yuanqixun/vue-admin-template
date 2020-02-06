import request from '@/utils/request'

export function getMyMenuList(roles) {
  return request({
    // url: '/auth/myMenuList',
    url: '/api/menu/myMenuList',
    method: 'get',
    data: { roles }
  })
}
