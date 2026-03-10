import request from '@/utils/request'

export function getContentList(params) {
  return request({
    url: '/admin/content/list',
    method: 'get',
    params
  })
}

export function addContent(data) {
  return request({
    url: '/admin/content/save',
    method: 'post',
    data
  })
}

export function updateContent(data) {
  return request({
    url: '/admin/content/update',
    method: 'post',
    data
  })
}

export function updateContentStatus(data) {
  return request({
    url: `/admin/content/status/${data.id}`,
    method: 'post',
    data: { status: data.status }
  })
}

export function deleteContent(id) {
  return request({
    url: `/admin/content/delete/${id}`,
    method: 'delete'
  })
}

export function uploadContentFile(formData) {
  return request({
    url: '/server/common/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
