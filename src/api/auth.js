import request from '@/utils/request'

export function getMyMenuList(roles) {
  return request({
    url: '/auth/myMenuList',
    method: 'post',
    data: { roles }
  })
}
