import request from '@/utils/request'

export function getTagList(params) {
  return request({
    url: '/admin/tag/list',
    method: 'get',
    params
  })
}

export function addTag(data) {
  return request({
    url: '/admin/tag/save',
    method: 'post',
    data
  })
}

export function updateTag(data) {
  return request({
    url: '/admin/tag/update',
    method: 'post',
    data
  })
}

export function updateTagStatus(data) {
  return request({
    url: `/admin/tag/status/${data.id}`,
    method: 'post',
    data: { status: data.status }
  })
}

export function deleteTag(id) {
  return request({
    url: `/admin/tag/delete/${id}`,
    method: 'delete'
  })
}

export function getTagOptions(params) {
  return request({
    url: '/admin/tag/options',
    method: 'get',
    params
  })
}
