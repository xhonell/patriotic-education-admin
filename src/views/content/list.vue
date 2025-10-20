<template>
  <div class="content-list-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">内容列表</h1>
      <p class="page-subtitle">管理所有爱国教育内容</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="toolbar card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input 
            v-model="searchForm.title" 
            placeholder="请输入内容标题" 
            clearable 
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select 
            v-model="searchForm.category" 
            placeholder="选择分类" 
            clearable
            style="width: 150px"
          >
            <el-option label="历史故事" value="history" />
            <el-option label="英雄事迹" value="hero" />
            <el-option label="文化传承" value="culture" />
            <el-option label="科技成就" value="tech" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select 
            v-model="searchForm.status" 
            placeholder="选择状态" 
            clearable
            style="width: 120px"
          >
            <el-option label="已发布" value="1" />
            <el-option label="草稿" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            重置
          </el-button>
          <el-button type="success" :icon="Plus" @click="handleAdd">
            新增内容
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 内容表格 -->
    <div class="card">
      <el-table 
        :data="contentList" 
        stripe 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="封面" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.cover"
              :preview-src-list="[row.cover]"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 8px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)" size="small">
              {{ getCategoryLabel(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览量" width="100" sortable />
        <el-table-column prop="likes" label="点赞数" width="100" sortable />
        <el-table-column prop="author" label="作者" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="查看详情" placement="top">
                <el-button 
                  type="primary" 
                  :icon="View" 
                  circle 
                  size="small"
                  @click="handleView(row)"
                />
              </el-tooltip>
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

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
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

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, Edit, Delete, Search, Refresh, Plus } from '@element-plus/icons-vue'

export default {
  name: 'ContentList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    
    const searchForm = reactive({
      title: '',
      category: '',
      status: ''
    })

    const pagination = reactive({
      page: 1,
      size: 10,
      total: 50
    })

    const contentList = ref([
      {
        id: 1,
        cover: 'https://picsum.photos/200/200?random=1',
        title: '新中国成立的伟大历程',
        category: 'history',
        views: 15234,
        likes: 1234,
        author: '编辑部',
        createTime: '2025-01-15 10:30',
        status: 1
      },
      {
        id: 2,
        cover: 'https://picsum.photos/200/200?random=2',
        title: '黄继光：用生命铸就不朽丰碑',
        category: 'hero',
        views: 13890,
        likes: 1089,
        author: '编辑部',
        createTime: '2025-01-14 14:20',
        status: 1
      },
      {
        id: 3,
        cover: 'https://picsum.photos/200/200?random=3',
        title: '中华传统文化的魅力',
        category: 'culture',
        views: 12456,
        likes: 987,
        author: '编辑部',
        createTime: '2025-01-13 09:15',
        status: 1
      },
      {
        id: 4,
        cover: 'https://picsum.photos/200/200?random=4',
        title: '中国航天事业的辉煌成就',
        category: 'tech',
        views: 11234,
        likes: 856,
        author: '编辑部',
        createTime: '2025-01-12 16:45',
        status: 1
      },
      {
        id: 5,
        cover: 'https://picsum.photos/200/200?random=5',
        title: '改革开放四十年',
        category: 'history',
        views: 10567,
        likes: 734,
        author: '编辑部',
        createTime: '2025-01-11 11:20',
        status: 0
      }
    ])

    const getCategoryType = (category) => {
      const types = {
        history: 'danger',
        hero: 'warning',
        culture: 'success',
        tech: 'primary'
      }
      return types[category] || 'info'
    }

    const getCategoryLabel = (category) => {
      const labels = {
        history: '历史故事',
        hero: '英雄事迹',
        culture: '文化传承',
        tech: '科技成就'
      }
      return labels[category] || '其他'
    }

    const handleSearch = () => {
      loading.value = true
      setTimeout(() => {
        ElMessage.success('搜索完成')
        loading.value = false
      }, 500)
    }

    const handleReset = () => {
      searchForm.title = ''
      searchForm.category = ''
      searchForm.status = ''
    }

    const handleAdd = () => {
      router.push('/content/add')
    }

    const handleStatusChange = (row) => {
      ElMessage.success(`内容 ${row.title} 已${row.status ? '发布' : '下架'}`)
    }

    const handleView = (row) => {
      ElMessage.info(`查看内容：${row.title}`)
    }

    const handleEdit = (row) => {
      router.push(`/content/add?id=${row.id}`)
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除内容 ${row.title} 吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        ElMessage.success('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    const handleSizeChange = (size) => {
      pagination.size = size
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 500)
    }

    const handleCurrentChange = (page) => {
      pagination.page = page
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 500)
    }

    return {
      loading,
      searchForm,
      pagination,
      contentList,
      getCategoryType,
      getCategoryLabel,
      handleSearch,
      handleReset,
      handleAdd,
      handleStatusChange,
      handleView,
      handleEdit,
      handleDelete,
      handleSizeChange,
      handleCurrentChange,
      // 图标
      View,
      Edit,
      Delete,
      Search,
      Refresh,
      Plus
    }
  }
}
</script>

<style scoped>
.content-list-container {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 32px;
  margin-bottom: 8px;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.toolbar {
  margin-bottom: 24px;
}

.search-form {
  margin: 0;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(230, 57, 70, 0.08);
  border: 1px solid var(--border-light);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.action-buttons .el-button {
  transition: all 0.3s ease;
}

.action-buttons .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 主色按钮 */
.action-buttons .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.action-buttons .el-button--primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

/* 警告按钮 */
.action-buttons .el-button--warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
}

.action-buttons .el-button--warning:hover {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
}

/* 危险按钮 */
.action-buttons .el-button--danger {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border: none;
}

.action-buttons .el-button--danger:hover {
  background: linear-gradient(135deg, #fee140 0%, #fa709a 100%);
}

/* 搜索表单按钮样式 */
.search-form .el-button {
  min-width: 100px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-form .el-button--primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  border: none;
}

.search-form .el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
}

.search-form .el-button--success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border: none;
}

.search-form .el-button--success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
}

.search-form .el-button:not(.el-button--primary):not(.el-button--success) {
  border: 2px solid var(--border-color);
}

.search-form .el-button:not(.el-button--primary):not(.el-button--success):hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table__header) {
  font-weight: 600;
  color: var(--text-primary);
}

:deep(.el-table th) {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

:deep(.el-table tr:hover) {
  background-color: rgba(211, 47, 47, 0.05);
}

/* 封面图片样式优化 */
:deep(.el-image) {
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

:deep(.el-image:hover) {
  transform: scale(1.05);
  border-color: var(--primary-color);
  box-shadow: 0 4px 16px rgba(211, 47, 47, 0.2);
}

/* 状态开关样式 */
:deep(.el-switch) {
  --el-switch-on-color: var(--primary-color);
}

/* 分类标签样式 */
:deep(.el-tag) {
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 12px;
}

/* 分页样式 */
:deep(.el-pagination) {
  font-weight: 500;
}

:deep(.el-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
}

:deep(.el-pagination button:hover) {
  color: var(--primary-color);
}
</style>

