import request from '@/utils/request'

const _FAST_MOCK_URL = 'https://www.fastmock.site/mock/b7e8297bdb872377310cf1f8b0b4d6db/hellovue'

/**
 * 基础档案列表
 * @param pageable 分页参数
 * @param data POS参数
 * @returns {AxiosPromise}
 */
export function getDataList(pageable,data) {
  return request({
    // baseURL: _FAST_MOCK_URL,
    url: '/api/base/baseDataList',
    method: 'post',
    params: pageable,
    data
  })
}

export function getDataItemList(pageable,data) {
  return request({
    // baseURL: _FAST_MOCK_URL,
    url: '/api/base/baseDataItemList',
    method: 'post',
    params: pageable,
    data
  })
}


/**
 * 基础档案页面
 * @param params
 * @returns {AxiosPromise}
 */
export function getEditDetail(params) {
  return request({
    // baseURL: _FAST_MOCK_URL,
    url: '/api/base/editBaseDataDetail',
    method: 'get',
    params
  })
}

/**
 * 保存表单
 * @param formData
 * @returns {AxiosPromise}
 */
export function saveDetail(data) {
  return request({
    url: '/api/base/saveBaseDataDetail',
    method: 'post',
    data
  })
}

export function saveItemDetail(data) {
  return request({
    url: '/api/base/saveBaseDataItemDetail',
    method: 'post',
    data
  })
}

export function remove(id) {
  return request({
    url: '/api/base/baseDataItemRemove',
    method: 'post',
    params: { id }
  })
}

export function moveup(id) {
  return request({
    url: '/api/base/baseDataItemMoveup',
    method: 'post',
    params: { id }
  })
}

export function movedown(id) {
  return request({
    url: '/api/base/baseDataItemMovedown',
    method: 'post',
    params: { id }
  })
}
