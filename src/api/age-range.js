import request from '@/utils/request'

/**
 * 获取年龄段列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} [params.name] - 名称
 * @returns {Promise}
 */
export function getAgeRangeList(params) {
  return request({
    url: '/admin/age-range/list',
    method: 'get',
    params
  })
}

/**
 * 新增年龄段
 * @param {Object} data - 年龄段数据
 * @param {string} data.name - 名称
 * @param {number} data.minAge - 最小年龄
 * @param {number} data.maxAge - 最大年龄
 * @param {string} data.description - 说明
 * @returns {Promise}
 */
export function addAgeRange(data) {
  return request({
    url: '/admin/age-range/save',
    method: 'post',
    data
  })
}

/**
 * 更新年龄段
 * @param {Object} data - 年龄段数据
 * @param {number} data.id - 年龄段ID
 * @param {string} data.name - 名称
 * @param {number} data.minAge - 最小年龄
 * @param {number} data.maxAge - 最大年龄
 * @param {string} data.description - 说明
 * @returns {Promise}
 */
export function updateAgeRange(data) {
  return request({
    url: '/admin/age-range/update',
    method: 'post',
    data
  })
}

/**
 * 删除年龄段
 * @param {number} id - 年龄段ID
 * @returns {Promise}
 */
export function deleteAgeRange(id) {
  return request({
    url: `/admin/age-range/delete/${id}`,
    method: 'delete'
  })
}

