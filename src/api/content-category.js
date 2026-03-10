import request from '@/utils/request'

export function getContentCategoryList(params) {
  return request({
    url: '/admin/content-category/list',
    method: 'get',
    params
  })
}

export function getContentCategoryOptions(params) {
  return request({
    url: '/admin/content-category/options',
    method: 'get',
    params
  })
}

export function addContentCategory(data) {
  return request({
    url: '/admin/content-category/save',
    method: 'post',
    data
  })
}

export function updateContentCategory(data) {
  return request({
    url: '/admin/content-category/update',
    method: 'post',
    data
  })
}

export function updateContentCategoryStatus(id, status) {
  return request({
    url: `/admin/content-category/status/${id}`,
    method: 'post',
    data: { status }
  })
}

export function deleteContentCategory(id) {
  return request({
    url: `/admin/content-category/delete/${id}`,
    method: 'delete'
  })
}

export function uploadContentCategoryIcon(formData) {
  return request({
    url: '/server/common/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
