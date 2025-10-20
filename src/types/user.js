/**
 * 用户信息类型定义
 */

/**
 * @typedef {Object} UserInfo
 * @property {number} id - 用户ID
 * @property {string} username - 用户名
 * @property {string} email - 邮箱
 * @property {string} phone - 手机号
 * @property {number} avatarId - 头像ID
 * @property {string} avatarUrl - 头像URL
 * @property {number} role - 角色（1:管理员, 2:普通用户）
 * @property {boolean} status - 账号状态（true:启用, false:禁用）
 * @property {string} createTime - 创建时间
 * @property {string} updateTime - 更新时间
 */

/**
 * 角色枚举
 */
export const UserRole = {
  USER: 1,           // 普通用户
  TEACHER: 2,        // 教师
  ADMIN: 3           // 系统管理员
}

/**
 * 角色名称映射
 */
export const UserRoleNames = {
  1: '普通用户',
  2: '教师',
  3: '系统管理员'
}

/**
 * 获取角色名称
 * @param {number} role - 角色值
 * @returns {string} 角色名称
 */
export function getRoleName(role) {
  return UserRoleNames[role] || '未知角色'
}

/**
 * 判断是否为管理员
 * @param {number} role - 角色值
 * @returns {boolean}
 */
export function isAdmin(role) {
  return role === UserRole.ADMIN  // role === 3
}

/**
 * 判断是否为教师
 * @param {number} role - 角色值
 * @returns {boolean}
 */
export function isTeacher(role) {
  return role === UserRole.TEACHER  // role === 2
}

/**
 * 格式化时间
 * @param {string} time - 时间字符串
 * @returns {string} 格式化后的时间
 */
export function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 获取用户状态文本
 * @param {boolean} status - 状态值
 * @returns {string}
 */
export function getStatusText(status) {
  return status ? '正常' : '禁用'
}

/**
 * 示例用户信息
 */
export const exampleUserInfo = {
  id: 5,
  username: 'xhonell',
  email: 'xhonell@163.com',
  phone: '18996459789',
  avatarId: 11,
  avatarUrl: 'https://pe-1329896228.cos.ap-chengdu.myqcloud.com/images/3bf592d79f9d4c049d00ecf3b6dd83c2.jpg',
  role: 2,
  status: false,
  createTime: '2025-10-19T23:16:01',
  updateTime: '2025-10-19T23:16:34'
}

