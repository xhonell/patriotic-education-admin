import request from '@/utils/request'

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.username - 用户名（可选）
 * @param {string} params.email - 邮箱（可选）
 * @param {string} params.ageRange - 年龄段（可选）
 * @param {string} params.region - 地区（可选）
 * @returns {Promise}
 */
export function getUserList(params) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params
  })
}

/**
 * 添加用户
 * @param {Object} data - 用户信息
 * @returns {Promise}
 */
export function addUser(data) {
  return request({
    url: '/admin/user/add',
    method: 'post',
    data
  })
}

/**
 * 更新用户
 * @param {Object} data - 用户信息
 * @returns {Promise}
 */
export function updateUser(data) {
  return request({
    url: '/admin/user/update',
    method: 'put',
    data
  })
}

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Promise}
 */
export function deleteUser(id) {
  return request({
    url: `/admin/user/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 更新用户状态
 * @param {Object} data - { id, status }
 * @returns {Promise}
 */
export function updateUserStatus(data) {
  return request({
    url: '/admin/user/status',
    method: 'put',
    data
  })
}

