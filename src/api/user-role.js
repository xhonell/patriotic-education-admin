import request from '@/utils/request'

/**
 * 获取用户的角色列表（含详情）
 * @param {number} userId - 用户ID
 * @returns {Promise}
 */
export function getUserRoles(userId) {
  return request({
    url: `/admin/user-role/list/${userId}`,
    method: 'get'
  })
}

/**
 * 为用户分配角色（会先删除用户原有的所有角色，再分配新角色）
 * @param {Object} data - 用户角色分配请求
 * @param {number} data.userId - 用户ID
 * @param {Array<number>} data.roleIds - 角色ID列表
 * @returns {Promise}
 */
export function assignRoles(data) {
  return request({
    url: '/admin/user-role/assign',
    method: 'post',
    data
  })
}

/**
 * 为用户添加单个角色（不删除原有角色）
 * @param {number} userId - 用户ID
 * @param {number} roleId - 角色ID
 * @returns {Promise}
 */
export function addUserRole(userId, roleId) {
  return request({
    url: `/admin/user-role/add/${userId}/${roleId}`,
    method: 'post'
  })
}

/**
 * 删除用户的指定角色
 * @param {number} userId - 用户ID
 * @param {number} roleId - 角色ID
 * @returns {Promise}
 */
export function removeUserRole(userId, roleId) {
  return request({
    url: `/admin/user-role/remove/${userId}/${roleId}`,
    method: 'delete'
  })
}

/**
 * 删除用户的所有角色
 * @param {number} userId - 用户ID
 * @returns {Promise}
 */
export function removeAllUserRoles(userId) {
  return request({
    url: `/admin/user-role/remove-all/${userId}`,
    method: 'delete'
  })
}

