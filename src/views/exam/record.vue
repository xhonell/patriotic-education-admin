<template>
  <div class="exam-record-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">考试记录</h1>
      <p class="page-subtitle">查看考试记录、排名和答卷详情</p>
    </div>

    <div class="toolbar card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="试卷ID">
          <el-input-number v-model="searchForm.paperId" :min="1" placeholder="请输入试卷ID" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="card">
      <el-table :data="tableData" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="记录ID" width="90" align="center" />
        <el-table-column prop="paperId" label="试卷ID" width="90" align="center" />
        <el-table-column prop="paperTitle" label="试卷名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="userId" label="用户ID" width="90" align="center" />
        <el-table-column prop="username" label="用户名" width="120" align="center" />
        <el-table-column prop="score" label="得分" width="80" align="center" />
        <el-table-column prop="answerCount" label="答题数" width="80" align="center" />
        <el-table-column prop="correctCount" label="正确数" width="80" align="center" />
        <el-table-column label="及格" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.passStatus === 1 ? 'success' : 'danger'">{{ row.passStatus === 1 ? '及格' : '不及格' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="耗时(秒)" width="90" align="center" />
        <el-table-column prop="startTime" label="开始时间" width="170" align="center">
          <template #default="{ row }">{{ formatTime(row.startTime) }}</template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="170" align="center">
          <template #default="{ row }">{{ formatTime(row.submitTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" text @click="handleShowAnswer(row)">答卷详情</el-button>
              <el-button type="success" text @click="handleShowRanking(row)">试卷排名</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog v-model="rankingVisible" title="试卷排名" width="700px">
      <el-table :data="rankingData" border size="small" max-height="420">
        <el-table-column prop="rank" label="排名" width="80" align="center" />
        <el-table-column prop="userId" label="用户ID" width="90" align="center" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="score" label="得分" width="80" align="center" />
        <el-table-column prop="duration" label="耗时(秒)" width="90" align="center" />
        <el-table-column prop="submitTime" label="提交时间" min-width="170" />
      </el-table>
      <template #footer>
        <el-button @click="rankingVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="answerVisible" title="答卷详情" width="980px">
      <el-table :data="answerData" border size="small" max-height="520">
        <el-table-column prop="questionId" label="题目ID" width="90" align="center" />
        <el-table-column prop="type" label="类型" width="90" align="center" />
        <el-table-column prop="content" label="题目内容" min-width="220" show-overflow-tooltip />
        <el-table-column label="选项" min-width="260">
          <template #default="{ row }">
            <div v-if="row.options && row.options.length">
              <div v-for="opt in row.options" :key="opt.id" class="option-line">
                <span class="option-label">{{ opt.optionLabel }}.</span>
                <span>{{ opt.content }}</span>
                <el-tag v-if="opt.isCorrect" type="success" size="small" style="margin-left: 6px">正确</el-tag>
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="userAnswer" label="用户答案" min-width="120" show-overflow-tooltip />
        <el-table-column prop="correctAnswer" label="正确答案" min-width="120" show-overflow-tooltip />
        <el-table-column label="判定" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isCorrect ? 'success' : 'danger'">{{ row.isCorrect ? '正确' : '错误' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="得分" width="80" align="center" />
        <el-table-column prop="analysis" label="解析" min-width="160" show-overflow-tooltip />
      </el-table>
      <template #footer>
        <el-button @click="answerVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getExamAnswerDetail, getExamRanking, getExamRecordList } from '@/api/exam-record'

const loading = ref(false)
const tableData = ref([])
const rankingVisible = ref(false)
const rankingData = ref([])
const answerVisible = ref(false)
const answerData = ref([])

const searchForm = reactive({
  paperId: null
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    if (searchForm.paperId) params.paperId = searchForm.paperId

    const res = await getExamRecordList(params)
    tableData.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error) {
    console.error(error)
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const handleReset = () => {
  searchForm.paperId = null
  pagination.page = 1
  loadData()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  loadData()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  loadData()
}

const handleShowRanking = async (row) => {
  try {
    const res = await getExamRanking(row.paperId)
    rankingData.value = Array.isArray(res) ? res : []
    rankingVisible.value = true
  } catch (error) {
    console.error(error)
    ElMessage.error('获取排名失败')
  }
}

const handleShowAnswer = async (row) => {
  try {
    const res = await getExamAnswerDetail(row.id)
    answerData.value = Array.isArray(res) ? res : []
    answerVisible.value = true
  } catch (error) {
    console.error(error)
    ElMessage.error('获取答卷详情失败')
  }
}

const formatTime = (time) => {
  if (!time) return '-'
  const date = new Date(time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.exam-record-container { padding: 0; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 32px; margin-bottom: 8px; }
.page-subtitle { color: var(--text-secondary); font-size: 14px; }
.toolbar { margin-bottom: 24px; }
.search-form { margin: 0; }
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(230, 57, 70, 0.08);
  border: 1px solid var(--border-light);
}
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
.action-buttons { display: flex; justify-content: center; align-items: center; gap: 6px; }
.option-line { line-height: 1.7; }
.option-label { display: inline-block; width: 18px; font-weight: 600; }
</style>

