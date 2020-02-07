import request from '@/utils/request'

export function getMyMenuList(roles) {
  return request({
    // url: '/auth/myMenuList',
    // 顶部导航栏菜单
    url: '/api/menu/myMenuList',
    method: 'get',
    data: { roles }
  })
}
