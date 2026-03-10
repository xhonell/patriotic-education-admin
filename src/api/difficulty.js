import request from '@/utils/request'

/**
 * 获取积分难度列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} [params.name] - 名称
 * @returns {Promise}
 */
export function getDifficultyList(params) {
  return request({
    url: '/admin/difficulty/list',
    method: 'get',
    params
  })
}

/**
 * 新增积分难度
 * @param {Object} data - 积分难度数据
 * @param {string} data.name - 难度名称
 * @param {string} data.description - 难度说明
 * @param {number} data.starts - 星级（1~5）
 * @param {number} data.score - 对应积分
 * @param {number} data.status - 状态（1 启用，0 禁用）
 * @returns {Promise}
 */
export function addDifficulty(data) {
  return request({
    url: '/admin/difficulty/save',
    method: 'post',
    data
  })
}

/**
 * 更新积分难度
 * @param {Object} data - 积分难度数据
 * @param {number} data.id - 难度ID
 * @param {string} data.name - 难度名称
 * @param {string} data.description - 难度说明
 * @param {number} data.starts - 星级（1~5）
 * @param {number} data.score - 对应积分
 * @param {number} data.status - 状态（1 启用，0 禁用）
 * @returns {Promise}
 */
export function updateDifficulty(data) {
  return request({
    url: '/admin/difficulty/update',
    method: 'post',
    data
  })
}

/**
 * 删除积分难度
 * @param {number} id - 难度ID
 * @returns {Promise}
 */
export function deleteDifficulty(id) {
  return request({
    url: `/admin/difficulty/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 更新积分难度状态
 * @param {number} id - 难度ID
 * @param {boolean} status - 状态（true 启用，false 禁用）
 * @returns {Promise}
 */
export function updateDifficultyStatus(id, status) {
  return request({
    url: `/admin/difficulty/status/${id}`,
    method: 'post',
    data: { status }
  })
}

export function getDifficultyOptions(params) {
  return request({
    url: '/admin/difficulty/options',
    method: 'get',
    params
  })
}
