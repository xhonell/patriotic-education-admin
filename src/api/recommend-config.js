import request from '@/utils/request'

export function getRecommendConfigList(params) {
  return request({
    url: '/admin/recommend-config/list',
    method: 'get',
    params
  })
}

export function getActiveRecommendConfig() {
  return request({
    url: '/admin/recommend-config/active',
    method: 'get'
  })
}

export function addRecommendConfig(data) {
  return request({
    url: '/admin/recommend-config/save',
    method: 'post',
    data
  })
}

export function updateRecommendConfig(data) {
  return request({
    url: '/admin/recommend-config/update',
    method: 'post',
    data
  })
}

export function deleteRecommendConfig(id) {
  return request({
    url: `/admin/recommend-config/delete/${id}`,
    method: 'delete'
  })
}
