<template>
  <div class="tag-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">标签管理</h1>
      <p class="page-subtitle">管理内容标签与适用年龄段</p>
    </div>

    <div class="toolbar card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标签名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入标签名称"
            clearable
            style="width: 220px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 140px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          <el-button type="success" :icon="Plus" @click="handleAdd">新增标签</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="card">
      <el-table :data="tagList" v-loading="loading" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="标签名称" min-width="180" align="center" />
        <el-table-column prop="description" label="标签描述" min-width="220" show-overflow-tooltip />
        <el-table-column prop="ageRangeName" label="适用年龄段" width="140" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="170" align="center">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.status === 1" @change="handleStatusChange(row, $event)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="编辑" placement="top">
                <el-button type="warning" :icon="Edit" circle size="small" @click="handleEdit(row)" />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" maxlength="50" show-word-limit />
        </el-form-item>

        <el-form-item label="标签描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
            placeholder="请输入标签描述"
          />
        </el-form-item>

        <el-form-item label="年龄段" prop="ageRangeId">
          <el-select v-model="form.ageRangeId" placeholder="请选择年龄段" style="width: 100%" clearable>
            <el-option v-for="item in ageRangeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getAgeRangeList } from '@/api/age-range'
import { addTag, deleteTag, getTagList, updateTag, updateTagStatus } from '@/api/tag'

const loading = ref(false)
const tagList = ref([])
const ageRangeOptions = ref([])

const searchForm = reactive({
  name: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增标签')
const formRef = ref(null)

const form = reactive({
  id: null,
  name: '',
  description: '',
  ageRangeId: null,
  status: 1
})

const rules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [{ max: 200, message: '描述最多 200 个字符', trigger: 'blur' }],
  ageRangeId: [{ required: true, message: '请选择年龄段', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const loadAgeRangeOptions = async () => {
  const res = await getAgeRangeList({ page: 1, pageSize: 999 })
  ageRangeOptions.value = res?.list || []
}

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }

    if (searchForm.name) params.name = searchForm.name
    if (searchForm.status !== '' && searchForm.status !== null) params.status = searchForm.status

    const res = await getTagList(params)
    tagList.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error) {
    console.error(error)
    tagList.value = []
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
  searchForm.name = ''
  searchForm.status = ''
  pagination.page = 1
  loadData()
}

const resetForm = () => {
  form.id = null
  form.name = ''
  form.description = ''
  form.ageRangeId = null
  form.status = 1
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增标签'
  dialogVisible.value = true
  resetForm()
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑标签'
  dialogVisible.value = true
  form.id = row.id
  form.name = row.name
  form.description = row.description || ''
  form.ageRangeId = row.ageRangeId || null
  form.status = row.status ?? 1
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async valid => {
    if (!valid) return

    try {
      const payload = {
        id: form.id,
        name: form.name,
        description: form.description,
        ageRangeId: form.ageRangeId,
        status: form.status
      }

      if (form.id) {
        await updateTag(payload)
        ElMessage.success('更新成功')
      } else {
        delete payload.id
        await addTag(payload)
        ElMessage.success('新增成功')
      }

      dialogVisible.value = false
      loadData()
    } catch (error) {
      console.error(error)
    }
  })
}

const handleStatusChange = async (row, newStatus) => {
  const oldStatus = row.status
  try {
    row.status = newStatus ? 1 : 0
    await updateTagStatus({ id: row.id, status: newStatus ? 1 : 0 })
    ElMessage.success(`已${newStatus ? '启用' : '禁用'}`)
  } catch (error) {
    row.status = oldStatus
    ElMessage.error('状态更新失败')
    console.error(error)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除标签“${row.name}”吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteTag(row.id)
      ElMessage.success('删除成功')
      if (tagList.value.length === 1 && pagination.page > 1) {
        pagination.page -= 1
      }
      loadData()
    } catch (error) {
      console.error(error)
    }
  }).catch(() => {})
}

const handleSizeChange = size => {
  pagination.pageSize = size
  pagination.page = 1
  loadData()
}

const handleCurrentChange = page => {
  pagination.page = page
  loadData()
}

const formatTime = time => {
  if (!time) return '-'
  const date = new Date(time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

onMounted(async () => {
  try {
    await loadAgeRangeOptions()
    await loadData()
  } catch (error) {
    console.error(error)
  }
})
</script>

<style scoped>
.tag-container {
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

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
</style>
