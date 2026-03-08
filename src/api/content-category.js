import request from '@/utils/request'

/**
 * 获取内容分类树列表（一次性返回树状结构）
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getContentCategoryList(params) {
  return request({
    url: '/admin/content-category/list',
    method: 'get',
    params
  })
}

/**
 * 新增内容分类
 * @param {Object} data - 分类数据
 * @returns {Promise}
 */
export function addContentCategory(data) {
  return request({
    url: '/admin/content-category/save',
    method: 'post',
    data
  })
}

/**
 * 更新内容分类
 * @param {Object} data - 分类数据（需包含 id）
 * @returns {Promise}
 */
export function updateContentCategory(data) {
  return request({
    url: '/admin/content-category/update',
    method: 'post',
    data
  })
}

/**
 * 更新内容分类状态
 * @param {number} id - 分类ID
 * @param {number} status - 状态（1 启用，0 禁用）
 * @returns {Promise}
 */
export function updateContentCategoryStatus(id, status) {
  return request({
    url: `/admin/content-category/status/${id}`,
    method: 'post',
    data: { status }
  })
}

/**
 * 删除内容分类
 * @param {number} id - 分类ID
 * @returns {Promise}
 */
export function deleteContentCategory(id) {
  return request({
    url: `/admin/content-category/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 上传内容分类图标文件
 * @param {FormData} formData - 文件表单，字段名为 file
 * @returns {Promise<{fileId: number, filePathUrl: string}>}
 */
export function uploadContentCategoryIcon(formData) {
  return request({
    url: '/server/common/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
