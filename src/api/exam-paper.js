import request from '@/utils/request'

/**
 * 获取试卷分页列表
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {string} [params.title]
 * @param {number} [params.status]
 */
export function getExamPaperList(params) {
  return request({
    url: '/admin/exam/paper/list',
    method: 'get',
    params
  })
}

/**
 * 获取试卷详情
 * @param {number} paperId
 */
export function getExamPaperDetail(paperId) {
  return request({
    url: `/admin/exam/paper/detail/${paperId}`,
    method: 'get'
  })
}

/**
 * 保存试卷（新增/编辑）
 * @param {Object} data
 */
export function saveExamPaper(data) {
  return request({
    url: '/admin/exam/paper/save',
    method: 'post',
    data
  })
}

/**
 * 删除试卷
 * @param {number} paperId
 */
export function deleteExamPaper(paperId) {
  return request({
    url: `/admin/exam/paper/delete/${paperId}`,
    method: 'delete'
  })
}

/**
 * 更新试卷发布状态
 * @param {number} paperId
 * @param {number} status 0未发布 1已发布
 */
export function updateExamPaperStatus(paperId, status) {
  return request({
    url: `/admin/exam/paper/status/${paperId}/${status}`,
    method: 'put'
  })
}
