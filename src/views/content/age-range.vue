<template>
  <div class="age-range-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title gradient-text">年龄段管理</h1>
      <p class="page-subtitle">管理系统中的年龄段分类</p>
    </div>

    <!-- 搜索工具栏 -->
    <div class="toolbar card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入年龄段名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            重置
          </el-button>
          <el-button type="success" :icon="Plus" @click="handleAdd">
            新增年龄段
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <div class="card">
      <el-table
        :data="ageRangeList"
        v-loading="loading"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="年龄段名称" min-width="150" align="center">
          <template #default="{ row }">
            <el-tag type="primary" size="large">{{ row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="年龄范围" width="200" align="center">
          <template #default="{ row }">
            <el-tag type="success">{{ row.minAge }} - {{ row.maxAge }} 岁</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="200" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatTime(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="编辑" placement="top">
                <el-button 
                  type="warning" 
                  :icon="Edit" 
                  circle 
                  size="small"
                  @click="handleEdit(row)"
                />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <!-- 装饰头部 -->
        <div class="dialog-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-icon">⏱️</div>
          <div class="decoration-line"></div>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="90px"
          class="age-range-form"
        >
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入年龄段名称，如：儿童、青少年"
              size="large"
              maxlength="50"
              show-word-limit
              clearable
            >
              <template #prefix>
                <el-icon><EditPen /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="年龄范围" required>
            <div class="age-range-inputs">
              <el-form-item prop="minAge" style="margin-bottom: 0;">
                <el-input-number
                  v-model="form.minAge"
                  :min="0"
                  :max="150"
                  placeholder="最小年龄"
                  size="large"
                  style="width: 100%"
                  controls-position="right"
                />
              </el-form-item>
              <span class="age-separator">至</span>
              <el-form-item prop="maxAge" style="margin-bottom: 0;">
                <el-input-number
                  v-model="form.maxAge"
                  :min="0"
                  :max="150"
                  placeholder="最大年龄"
                  size="large"
                  style="width: 100%"
                  controls-position="right"
                />
              </el-form-item>
              <span class="age-unit">岁</span>
            </div>
          </el-form-item>
          <el-form-item label="说明" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入说明（可选）"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="dialogVisible = false">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button type="primary" size="large" @click="handleSubmit">
            <el-icon><Check /></el-icon>
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, Refresh, Plus, Edit, Delete,
  EditPen, Close, Check
} from '@element-plus/icons-vue'
import {
  getAgeRangeList,
  addAgeRange,
  updateAgeRange,
  deleteAgeRange
} from '@/api/age-range'

// 搜索表单
const searchForm = reactive({
  name: ''
})

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 数据列表
const ageRangeList = ref([])
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增年龄段')
const formRef = ref(null)
const form = reactive({
  id: null,
  name: '',
  minAge: 0,
  maxAge: 18,
  description: ''
})

// 自定义验证器：最大年龄必须大于最小年龄
const validateAgeRange = (rule, value, callback) => {
  if (value === null || value === undefined || value === '') {
    callback(new Error('请输入年龄'))
  } else if (rule.field === 'maxAge' && value <= form.minAge) {
    callback(new Error('最大年龄必须大于最小年龄'))
  } else if (rule.field === 'minAge' && form.maxAge && value >= form.maxAge) {
    callback(new Error('最小年龄必须小于最大年龄'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入年龄段名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  minAge: [
    { required: true, message: '请输入最小年龄', trigger: 'blur' },
    { validator: validateAgeRange, trigger: 'change' }
  ],
  maxAge: [
    { required: true, message: '请输入最大年龄', trigger: 'blur' },
    { validator: validateAgeRange, trigger: 'change' }
  ],
  description: [
    { max: 200, message: '说明最多 200 个字符', trigger: 'blur' }
  ]
}

// 加载数据列表
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    
    // 只添加非空的搜索条件
    if (searchForm.name) {
      params.name = searchForm.name
    }
    
    const res = await getAgeRangeList(params)
    
    // 处理 PageInfo 结构
    if (res && res.list) {
      ageRangeList.value = res.list
      pagination.total = res.total || 0
    } else {
      ageRangeList.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  pagination.page = 1
  loadData()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增年龄段'
  dialogVisible.value = true
  resetForm()
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑年龄段'
  dialogVisible.value = true
  form.id = row.id
  form.name = row.name
  form.minAge = row.minAge
  form.maxAge = row.maxAge
  form.description = row.description || ''
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.name = ''
  form.minAge = 0
  form.maxAge = 18
  form.description = ''
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    try {
      const submitData = {
        id: form.id,
        name: form.name,
        minAge: form.minAge,
        maxAge: form.maxAge,
        description: form.description
      }
      
      if (form.id) {
        // 编辑
        await updateAgeRange(submitData)
        ElMessage.success('更新成功')
      } else {
        // 新增
        delete submitData.id
        await addAgeRange(submitData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (error) {
      console.error(error)
    }
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除年龄段"${row.name}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteAgeRange(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      console.error(error)
    }
  }).catch(() => {
    // 取消删除
  })
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  loadData()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  loadData()
}

// 时间格式化
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

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.age-range-container {
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

/* 标签样式 */
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

/* 对话框样式 */
.dialog-content {
  position: relative;
}

/* 对话框装饰 */
.dialog-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
}

.decoration-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
}

.decoration-icon {
  font-size: 32px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.age-range-form {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

:deep(.age-range-form .el-form-item__label) {
  font-weight: 600;
  color: #303133;
}

:deep(.age-range-form .el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

:deep(.age-range-form .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

:deep(.age-range-form .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

/* 年龄范围输入区域 */
.age-range-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.age-range-inputs .el-form-item {
  flex: 1;
}

.age-separator {
  color: #909399;
  font-weight: 500;
  padding: 0 8px;
}

.age-unit {
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

:deep(.age-range-inputs .el-input-number) {
  width: 100%;
}

:deep(.age-range-inputs .el-input-number .el-input__inner) {
  text-align: center;
}

/* 对话框底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.dialog-footer .el-button) {
  min-width: 100px;
  font-weight: 500;
}

:deep(.dialog-footer .el-button .el-icon) {
  margin-right: 6px;
}
</style>

