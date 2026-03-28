import request from '@/utils/request'

/**
 * 获取考试记录分页列表
 * @param {Object} params
 * @param {number} [params.paperId]
 * @param {number} [params.page]
 * @param {number} [params.pageSize]
 */
export function getExamRecordList(params) {
  return request({
    url: '/admin/exam/record/list',
    method: 'get',
    params
  })
}

/**
 * 获取试卷排名
 * @param {number} paperId
 */
export function getExamRanking(paperId) {
  return request({
    url: `/admin/exam/record/ranking/${paperId}`,
    method: 'get'
  })
}

/**
 * 获取答卷详情
 * @param {number} recordId
 */
export function getExamAnswerDetail(recordId) {
  return request({
    url: `/admin/exam/record/answer/${recordId}`,
    method: 'get'
  })
}
