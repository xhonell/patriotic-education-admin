import request from '@/utils/request'

/**
 * 获取年龄段列表
 */
export function getAgeRangeList(params) {
  return request({
    url: '/admin/age-range/list',
    method: 'get',
    params
  })
}

export function addAgeRange(data) {
  return request({
    url: '/admin/age-range/save',
    method: 'post',
    data
  })
}

export function updateAgeRange(data) {
  return request({
    url: '/admin/age-range/update',
    method: 'post',
    data
  })
}

export function deleteAgeRange(id) {
  return request({
    url: `/admin/age-range/delete/${id}`,
    method: 'delete'
  })
}

export function getAgeRangeOptions(params) {
  return request({
    url: '/admin/age-range/options',
    method: 'get',
    params
  })
}