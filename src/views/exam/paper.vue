<template>
  <div class="exam-paper-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">试卷管理</h1>
      <p class="page-subtitle">管理考试试卷的发布、删除与详情</p>
    </div>

    <div class="toolbar card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="试卷名称">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入试卷名称"
            clearable
            style="width: 220px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 140px">
            <el-option label="未发布" :value="0" />
            <el-option label="已发布" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          <el-button type="success" :icon="Plus" @click="handleAdd">新增试卷</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="card">
      <el-table :data="tableData" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="title" label="试卷名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip />
        <el-table-column prop="questionCount" label="题目数" width="90" align="center" />
        <el-table-column prop="totalScore" label="总分" width="90" align="center" />
        <el-table-column prop="passScore" label="及格分" width="90" align="center" />
        <el-table-column prop="duration" label="时长(分)" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '已发布' : '未发布' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" align="center">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="查看详情" placement="top">
                <el-button type="primary" :icon="View" circle size="small" @click="handleDetail(row)" />
              </el-tooltip>
              <el-tooltip content="编辑试卷" placement="top">
                <el-button type="warning" :icon="Edit" circle size="small" @click="handleEdit(row)" />
              </el-tooltip>
              <el-tooltip :content="row.status === 1 ? '取消发布' : '发布试卷'" placement="top">
                <el-button
                  :type="row.status === 1 ? 'warning' : 'success'"
                  :icon="Switch"
                  circle
                  size="small"
                  @click="handleStatusChange(row)"
                />
              </el-tooltip>
              <el-tooltip content="删除试卷" placement="top">
                <el-button type="danger" :icon="Delete" circle size="small" @click="handleDelete(row)" />
              </el-tooltip>
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

    <el-dialog v-model="detailVisible" title="试卷详情" width="760px">
      <template v-if="detailData">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="试卷ID">{{ detailData.id }}</el-descriptions-item>
          <el-descriptions-item label="试卷名称">{{ detailData.title }}</el-descriptions-item>
          <el-descriptions-item label="总分">{{ detailData.totalScore }}</el-descriptions-item>
          <el-descriptions-item label="及格分">{{ detailData.passScore }}</el-descriptions-item>
          <el-descriptions-item label="时长(分钟)">{{ detailData.duration }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ detailData.status === 1 ? '已发布' : '未发布' }}</el-descriptions-item>
          <el-descriptions-item label="题目数量">{{ detailData.questionCount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatTime(detailData.createTime) }}</el-descriptions-item>
          <el-descriptions-item :span="2" label="描述">{{ detailData.description || '-' }}</el-descriptions-item>
        </el-descriptions>

        <div class="question-section" v-if="detailData && detailData.questions && detailData.questions.length">
          <h4>题目列表（{{ detailData.questions.length }}）</h4>
          <el-table :data="detailData.questions" size="small" max-height="260">
            <el-table-column prop="id" label="题目ID" width="90" />
            <el-table-column prop="content" label="题目内容" min-width="260" show-overflow-tooltip />
            <el-table-column label="类型" width="110" align="center">
              <template #default="{ row }">{{ row.typeName || row.type }}</template>
            </el-table-column>
            <el-table-column prop="score" label="分值" width="80" align="center" />
          </el-table>
        </div>
      </template>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, View, Delete, Switch, Plus, Edit } from '@element-plus/icons-vue'
import {
  getExamPaperList,
  getExamPaperDetail,
  deleteExamPaper,
  updateExamPaperStatus
} from '@/api/exam-paper'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const detailData = ref(null)

const searchForm = reactive({
  title: '',
  status: ''
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
    if (searchForm.title) params.title = searchForm.title
    if (searchForm.status !== '' && searchForm.status !== null) params.status = searchForm.status

    const res = await getExamPaperList(params)
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
  searchForm.title = ''
  searchForm.status = ''
  pagination.page = 1
  loadData()
}

const handleAdd = () => {
  router.push('/exam/paper-edit')
}

const handleEdit = (row) => {
  router.push(`/exam/paper-edit?id=${row.id}`)
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

const handleDetail = async (row) => {
  try {
    const res = await getExamPaperDetail(row.id)
    detailData.value = res || null
    detailVisible.value = true
  } catch (error) {
    console.error(error)
  }
}

const handleStatusChange = async (row) => {
  const targetStatus = row.status === 1 ? 0 : 1
  try {
    await updateExamPaperStatus(row.id, targetStatus)
    row.status = targetStatus
    ElMessage.success(targetStatus === 1 ? '发布成功' : '已取消发布')
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除试卷“${row.title}”吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteExamPaper(row.id)
      ElMessage.success('删除成功')
      if (tableData.value.length === 1 && pagination.page > 1) {
        pagination.page -= 1
      }
      loadData()
    } catch (error) {
      console.error(error)
    }
  }).catch(() => {})
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
.exam-paper-container { padding: 0; }
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
.action-buttons { display: flex; justify-content: center; align-items: center; gap: 8px; }
.question-section { margin-top: 16px; }
.question-section h4 { margin: 0 0 8px; }
</style>
