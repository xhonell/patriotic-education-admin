import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.email - 邮箱
 * @param {string} data.password - 密码（6-20个字符）
 * @returns {Promise}
 */
export function login(data) {
  return request({
    url: '/admin/login/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return request({
    url: '/admin/login/info',
    method: 'get'
  })
}

/**
 * 退出登录
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

