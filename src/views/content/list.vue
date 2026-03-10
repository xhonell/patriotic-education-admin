<template>
  <div class="content-list-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">内容列表</h1>
      <p class="page-subtitle">管理所有爱国教育内容</p>
    </div>

    <div class="toolbar card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入内容标题"
            clearable
            style="width: 220px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
            clearable
            style="width: 140px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          <el-button type="success" :icon="Plus" @click="handleAdd">新增内容</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="card">
      <el-table :data="contentList" stripe style="width: 100%" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column label="封面" width="120" align="center">
          <template #default="{ row }">
            <template v-if="row.fileImage">
              <video
                v-if="isVideoUrl(row.fileImage)"
                :src="row.fileImage"
                class="thumb-video"
                muted
                playsinline
              ></video>
              <el-image
                v-else
                :src="row.fileImage"
                fit="cover"
                style="width: 72px; height: 40px; border-radius: 6px"
                :preview-src-list="[row.fileImage]"
                preview-teleported
              />
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'success' : 'warning'">
              {{ row.type === 1 ? '文章' : row.type === 2 ? '视频' : '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="分类" width="120" align="center" />
        <el-table-column prop="difficultyName" label="难度" width="120" align="center" />
        <el-table-column prop="tagName" label="标签" width="120" align="center" />
        <el-table-column prop="politicName" label="政治面貌" width="120" align="center" />
        <el-table-column prop="author" label="作者" width="110" align="center" />
        <el-table-column prop="viewCount" label="阅读" width="90" align="center" />
        <el-table-column prop="likeCount" label="点赞" width="90" align="center" />
        <el-table-column prop="collectCount" label="收藏" width="90" align="center" />
        <el-table-column prop="duration" label="时长(秒)" width="100" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="170" align="center">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status === 1"
              @change="handleStatusChange(row, $event)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="编辑内容" placement="top">
                <el-button
                  type="warning"
                  :icon="Edit"
                  circle
                  size="small"
                  @click="handleEdit(row)"
                />
              </el-tooltip>
              <el-tooltip content="删除内容" placement="top">
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  @click="handleDelete(row)"
                />
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
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getContentList, updateContentStatus, deleteContent } from '@/api/content'

const router = useRouter()
const loading = ref(false)

const searchForm = reactive({
  title: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const contentList = ref([])

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }

    if (searchForm.title) params.title = searchForm.title
    if (searchForm.status !== '' && searchForm.status !== null) params.status = searchForm.status

    const res = await getContentList(params)
    contentList.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error) {
    console.error(error)
    contentList.value = []
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
  router.push('/content/add')
}

const handleEdit = (row) => {
  router.push(`/content/add?id=${row.id}`)
}

const handleStatusChange = async (row, newStatus) => {
  const oldStatus = row.status
  try {
    row.status = newStatus ? 1 : 0
    await updateContentStatus({ id: row.id, status: newStatus ? 1 : 0 })
    ElMessage.success(`已${newStatus ? '启用' : '禁用'}`)
  } catch (error) {
    row.status = oldStatus
    ElMessage.error('状态更新失败')
    console.error(error)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除内容“${row.title}”吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteContent(row.id)
      ElMessage.success('删除成功')
      if (contentList.value.length === 1 && pagination.page > 1) {
        pagination.page -= 1
      }
      loadData()
    } catch (error) {
      console.error(error)
    }
  }).catch(() => {})
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

const isVideoUrl = (url = '') => /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url)

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
.content-list-container { padding: 0; }
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
.thumb-video { width: 72px; height: 40px; border-radius: 6px; object-fit: cover; }
</style>
