<template>
  <div class="category-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">内容分类</h1>
      <p class="page-subtitle">管理所有内容分类</p>
    </div>

    <div class="card">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增分类
        </el-button>
      </div>

      <el-table
        :data="categoryList"
        row-key="id"
        stripe
        style="width: 100%"
        default-expand-all
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图标" width="80">
          <template #default="{ row }">
            <el-image
              v-if="row.icon"
              :src="row.icon"
              fit="cover"
              style="width: 32px; height: 32px; border-radius: 4px"
            >
              <template #error>
                <div class="icon-fallback">无</div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="分类名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="weight" label="权重" width="80" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="val => handleStatusChange(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="新增子类" placement="top">
                <el-button
                  type="primary"
                  :icon="Plus"
                  circle
                  size="small"
                  @click="handleAdd(row)"
                />
              </el-tooltip>
              <el-tooltip content="编辑分类" placement="top">
                <el-button
                  type="warning"
                  :icon="Edit"
                  circle
                  size="small"
                  @click="handleEdit(row)"
                />
              </el-tooltip>
              <el-tooltip content="删除分类" placement="top">
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
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" label-width="90px">
        <el-form-item label="上级分类">
          <el-input
            v-model="parentName"
            placeholder="根级分类"
            disabled
          />
        </el-form-item>
        <el-form-item label="图标">
          <div class="icon-upload-wrapper">
            <el-upload
              class="icon-uploader"
              :show-file-list="false"
              :http-request="handleIconUpload"
              accept="image/*"
            >
              <el-image
                v-if="form.icon"
                :src="form.icon"
                fit="cover"
                style="width: 48px; height: 48px; border-radius: 8px"
                class="icon-preview-click"
              >
                <template #error>
                  <div class="icon-fallback">无</div>
                </template>
              </el-image>
              <el-button v-else type="primary">上传图标</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="form.categoryName" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="权重">
          <div class="weight-slider-wrap">
            <el-slider
              v-model="form.weight"
              :min="0"
              :max="10"
              :step="1"
              :show-input="false"
              show-stops
            />
            <span class="weight-value">{{ form.weight }}</span>
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import {
  getContentCategoryList,
  addContentCategory,
  updateContentCategory,
  deleteContentCategory,
  updateContentCategoryStatus,
  uploadContentCategoryIcon
} from '@/api/content-category'

export default {
  name: 'ContentCategory',
  setup() {
    const categoryList = ref([])
    const dialogVisible = ref(false)
    const dialogTitle = ref('新增分类')
    const currentParent = ref(null)

    const form = reactive({
      id: null,
      icon: '',
      categoryName: '',
      description: '',
      weight: 0,
      status: 1,
      parentId: 0
    })

    const parentName = ref('根级分类')

    const resetForm = () => {
      form.id = null
      form.icon = ''
      form.categoryName = ''
      form.description = ''
      form.weight = 0
      form.status = 1
      form.parentId = 0
      currentParent.value = null
      parentName.value = '根级分类'
    }

    const fetchList = () => {
      getContentCategoryList({}).then(res => {
        // request 拦截器已返回 res.data，这里 res 就是列表数组
        categoryList.value = Array.isArray(res) ? res : []
      })
    }

    const handleAdd = (parent) => {
      resetForm()
      if (parent && parent.id) {
        form.parentId = parent.id
        currentParent.value = parent
        parentName.value = parent.categoryName
      }
      dialogTitle.value = parent ? '新增子分类' : '新增分类'
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      form.id = row.id
      form.icon = row.icon
      form.categoryName = row.categoryName
      form.description = row.description
      form.weight = row.weight
      form.status = row.status
      form.parentId = row.parentId || 0

      if (row.parentId && row.parent) {
        parentName.value = row.parent.categoryName
      } else {
        parentName.value = '根级分类'
      }

      dialogTitle.value = '编辑分类'
      dialogVisible.value = true
    }

    const submitForm = () => {
      const api = form.id ? updateContentCategory : addContentCategory
      api(form).then(() => {
        ElMessage.success('操作成功')
        dialogVisible.value = false
        fetchList()
      })
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除分类 ${row.categoryName} 吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteContentCategory(row.id).then(() => {
          ElMessage.success('删除成功')
          fetchList()
        })
      }).catch(() => {})
    }

    const handleStatusChange = (row, val) => {
      updateContentCategoryStatus(row.id, val).then(() => {
        row.status = val
        ElMessage.success('状态更新成功')
      }).catch(() => {
        // 回滚
        row.status = row.status === 1 ? 0 : 1
      })
    }

    const handleIconUpload = (option) => {
      const formData = new FormData()
      formData.append('file', option.file)
      uploadContentCategoryIcon(formData).then(res => {
        // request 拦截器已返回 data，这里 res 就是上传返回对象
        const url = res?.filePathUrl || res?.url
        if (url) {
          form.icon = url
          ElMessage.success('图标上传成功')
        } else {
          ElMessage.error('上传成功但未获取到文件地址')
        }
        option.onSuccess && option.onSuccess(res)
      }).catch(err => {
        ElMessage.error('图标上传失败')
        option.onError && option.onError(err)
      })
    }

    onMounted(() => {
      fetchList()
    })

    return {
      categoryList,
      dialogVisible,
      dialogTitle,
      form,
      parentName,
      handleAdd,
      handleEdit,
      handleDelete,
      handleStatusChange,
      handleIconUpload,
      submitForm,
      Plus,
      Edit,
      Delete
    }
  }
}
</script>

<style scoped>
.category-container {
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

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(230, 57, 70, 0.08);
  border: 1px solid var(--border-light);
}

.toolbar {
  margin-bottom: 24px;
}

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

.action-buttons .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.action-buttons .el-button--primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.action-buttons .el-button--warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
}

.action-buttons .el-button--warning:hover {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
}

.action-buttons .el-button--danger {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border: none;
}

.action-buttons .el-button--danger:hover {
  background: linear-gradient(135deg, #fee140 0%, #fa709a 100%);
}

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

:deep(.el-switch) {
  --el-switch-on-color: var(--primary-color);
}

.icon-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weight-slider-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}

.weight-slider-wrap :deep(.el-slider) {
  flex: 1;
}

.weight-value {
  min-width: 24px;
  color: var(--text-secondary);
  font-weight: 600;
}

.icon-preview {
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 2px;
}

.icon-preview-click {
  cursor: pointer;
  border: 1px solid var(--border-light);
}

.icon-fallback {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
  font-size: 12px;
}
</style>

