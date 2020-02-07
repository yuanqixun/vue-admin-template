import request from '@/utils/request'

export function getMyMenuList(roles) {
  return request({
    // url: '/auth/myMenuList',
    // 顶部导航栏菜单
    // url: '/api/menu/myMenuList',
    url: '/api/menu/myMenuList2',
    method: 'get',
    data: { roles }
  })
}
