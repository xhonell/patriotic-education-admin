import request from '@/utils/request'

/**
 * 角色管理 API
 */

// 获取角色列表（分页）
export function getRoleList(params) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/admin/role/save',
    method: 'post',
    data
  })
}

// 更新角色
export function updateRole(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data
  })
}

// 修改角色状态
export function updateRoleStatus(id, status) {
  return request({
    url: `/admin/role/status/${id}`,
    method: 'post',
    data: { status }
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/admin/role/delete/${id}`,
    method: 'delete'
  })
}

// 获取角色的权限ID列表
export function getRolePermissions(roleId) {
  return request({
    url: `/admin/role/permissions/${roleId}`,
    method: 'get'
  })
}

// 获取角色详情（包含权限树）
export function getRoleDetail(id) {
  return request({
    url: `/admin/role/detail/${id}`,
    method: 'get'
  })
}

