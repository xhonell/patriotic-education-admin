import request from '@/utils/request'

/**
 * 获取权限列表（懒加载，无分页）
 * @param {Object} params - 查询参数
 * @param {number} [params.parentId] - 父级ID（懒加载时传递）
 * @param {string} [params.name] - 权限名称
 * @param {number} [params.type] - 权限类型（1 菜单 2 按钮/接口）
 * @param {boolean} [params.status] - 状态
 * @returns {Promise}
 */
export function getPermissionList(params) {
  return request({
    url: '/admin/permission/list',
    method: 'get',
    params
  })
}

/**
 * 获取菜单下拉树（一次性返回完整树状结构）
 * @returns {Promise<Array>} 返回树状结构的启用菜单列表
 */
export function getPermissionSelectTree() {
  return request({
    url: '/admin/permission/select',
    method: 'get'
  })
}

/**
 * 获取当前登录用户的权限菜单树
 * 后端返回结构对应 PermissionTreeResponse，包含 childrenPermission
 * @returns {Promise<Array>} 返回当前用户可见的菜单权限树
 */
export function getCurrentPermissionTree() {
  return request({
    // 按后端约定，这里使用 current/tree 接口
    // 如果网关或模块前缀不同，只需调整此处路径
    url: '/admin/permission/current/tree',
    method: 'get'
  })
}


/**
 * 新增权限
 * @param {Object} data - 权限数据
 * @param {string} data.name - 权限名称
 * @param {string} data.code - 权限标识
 * @param {number} data.type - 权限类型（1 菜单 2 按钮/接口）
 * @param {string} [data.path] - 前端路由路径
 * @param {number} [data.parentId] - 父级ID
 * @param {boolean} data.status - 状态
 * @param {number} [data.sort] - 排序
 * @returns {Promise}
 */
export function addPermission(data) {
  return request({
    url: '/admin/permission/save',
    method: 'post',
    data
  })
}

/**
 * 更新权限
 * @param {Object} data - 权限数据
 * @param {number} data.id - 权限ID
 * @param {string} data.name - 权限名称
 * @param {string} data.code - 权限标识
 * @param {number} data.type - 权限类型（1 菜单 2 按钮/接口）
 * @param {string} [data.path] - 前端路由路径
 * @param {number} [data.parentId] - 父级ID
 * @param {boolean} data.status - 状态
 * @param {number} [data.sort] - 排序
 * @returns {Promise}
 */
export function updatePermission(data) {
  return request({
    url: '/admin/permission/update',
    method: 'post',
    data
  })
}

/**
 * 更新权限状态
 * @param {number} id - 权限ID
 * @param {boolean} status - 状态
 * @returns {Promise}
 */
export function updatePermissionStatus(id, status) {
  return request({
    url: `/admin/permission/status/${id}`,
    method: 'post',
    data: { status }
  })
}

/**
 * 删除权限
 * @param {number} id - 权限ID
 * @returns {Promise}
 */
export function deletePermission(id) {
  return request({
    url: `/admin/permission/delete/${id}`,
    method: 'delete'
  })
}