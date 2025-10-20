import request from '@/utils/request'

/**
 * 获取轮播图列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 当前页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} [params.title] - 标题
 * @param {boolean} [params.status] - 状态
 * @returns {Promise}
 */
export function getBannerList(params) {
  return request({
    url: '/admin/banner/list',
    method: 'get',
    params
  })
}

/**
 * 新增轮播图
 * @param {Object} data - 轮播图数据
 * @param {string} data.title - 标题
 * @param {number} data.fileId - 文件ID
 * @param {boolean} data.status - 状态
 * @returns {Promise}
 */
export function addBanner(data) {
  return request({
    url: '/admin/banner/save',
    method: 'post',
    data
  })
}

/**
 * 更新轮播图
 * @param {Object} data - 轮播图数据
 * @param {number} data.id - 轮播图ID
 * @param {string} data.title - 标题
 * @param {number} data.fileId - 文件ID
 * @param {boolean} data.status - 状态
 * @returns {Promise}
 */
export function updateBanner(data) {
  return request({
    url: '/admin/banner/update',
    method: 'post',
    data
  })
}

/**
 * 更新轮播图状态
 * @param {Object} data - 状态数据
 * @param {number} data.id - 轮播图ID
 * @param {boolean} data.status - 新状态
 * @returns {Promise}
 */
export function updateBannerStatus(data) {
  return request({
    url: `/admin/banner/status/${data.id}`,
    method: 'post',
    data: { status: data.status }
  })
}

/**
 * 删除轮播图
 * @param {number} id - 轮播图ID
 * @returns {Promise}
 */
export function deleteBanner(id) {
  return request({
    url: `/admin/banner/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 上传轮播图图片（通用文件上传接口）
 * @param {FormData} formData - 图片文件
 * @returns {Promise<{fileId: Long, filePathUrl: String}>}
 */
export function uploadBannerImage(formData) {
  return request({
    url: '/server/common/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

