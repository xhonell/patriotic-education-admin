import request from '@/utils/request'

/**
 * 获取政治面貌列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} [params.name] - 名称
 * @param {boolean} [params.status] - 状态
 * @returns {Promise}
 */
export function getPoliticList(params) {
  return request({
    url: '/admin/politic/list',
    method: 'get',
    params
  })
}

/**
 * 新增政治面貌
 * @param {Object} data - 政治面貌数据
 * @param {string} data.name - 名称
 * @param {string} data.description - 说明
 * @param {number} data.status - 状态（1启用/0禁用）
 * @returns {Promise}
 */
export function addPolitic(data) {
  return request({
    url: '/admin/politic/save',
    method: 'post',
    data
  })
}

/**
 * 更新政治面貌
 * @param {Object} data - 政治面貌数据
 * @param {number} data.id - 政治面貌ID
 * @param {string} data.name - 名称
 * @param {string} data.description - 说明
 * @param {number} data.status - 状态（1启用/0禁用）
 * @returns {Promise}
 */
export function updatePolitic(data) {
  return request({
    url: '/admin/politic/update',
    method: 'post',
    data
  })
}

/**
 * 更新政治面貌状态
 * @param {Object} data - 状态数据
 * @param {number} data.id - 政治面貌ID
 * @param {number} data.status - 新状态（1启用/0禁用）
 * @returns {Promise}
 */
export function updatePoliticStatus(data) {
  return request({
    url: `/admin/politic/status/${data.id}`,
    method: 'post',
    data: { status: data.status }
  })
}

/**
 * 删除政治面貌
 * @param {number} id - 政治面貌ID
 * @returns {Promise}
 */
export function deletePolitic(id) {
  return request({
    url: `/admin/politic/delete/${id}`,
    method: 'delete'
  })
}

