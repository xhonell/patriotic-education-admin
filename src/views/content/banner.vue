<template>
  <div class="banner-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">轮播图管理</h1>
      <p class="page-subtitle">管理首页轮播图展示内容</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="toolbar card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input 
            v-model="searchForm.title" 
            placeholder="请输入轮播图标题" 
            clearable 
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select 
            v-model="searchForm.status" 
            placeholder="选择状态" 
            clearable
            style="width: 120px"
          >
            <el-option label="已启用" :value="true" />
            <el-option label="已禁用" :value="false" />
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
            新增轮播图
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 轮播图表格 -->
    <div class="card">
      <el-table 
        :data="bannerList" 
        stripe 
        style="width: 100%"
        v-loading="loading"
        row-key="id"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="预览" width="200">
          <template #default="{ row }">
            <el-image
              :src="row.filePathUrl"
              :preview-src-list="[row.filePathUrl]"
              fit="cover"
              class="banner-preview"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
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
      width="700px"
      class="banner-dialog"
      @close="handleDialogClose"
    >
      <div class="dialog-content">
        <!-- 对话框装饰 -->
        <div class="dialog-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-icon">🎠</div>
          <div class="decoration-line"></div>
        </div>

        <el-form
          ref="bannerFormRef"
          :model="bannerForm"
          :rules="bannerRules.value"
          label-width="80px"
          class="banner-form"
        >
          <el-form-item label="标题" prop="title">
            <el-input 
              v-model="bannerForm.title" 
              placeholder="请输入轮播图标题"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><EditPen /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="图片" prop="filePathUrl">
            <div class="upload-section">
              <!-- 编辑模式：只显示图片，不允许修改 -->
              <div v-if="bannerForm.id" class="image-preview-container">
                <div class="preview-wrapper">
                  <img v-if="bannerForm.filePathUrl" :src="bannerForm.filePathUrl" class="preview-image">
                  <div v-else class="no-image">
                    <el-icon><Picture /></el-icon>
                    <p>暂无图片</p>
                  </div>
                  <div class="image-mask">
                    <el-icon class="view-icon"><View /></el-icon>
                  </div>
                </div>
                <div class="edit-notice">
                  <el-icon><InfoFilled /></el-icon>
                  <span>编辑模式下不支持修改图片</span>
                </div>
              </div>

              <!-- 新增模式：允许上传 -->
              <div v-else class="upload-area">
                <el-upload
                  class="image-uploader"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  action="#"
                  :http-request="handleUpload"
                  drag
                >
                  <div v-if="bannerForm.filePathUrl" class="uploaded-preview">
                    <img :src="bannerForm.filePathUrl" class="uploaded-image">
                    <div class="upload-overlay">
                      <el-icon class="reupload-icon"><RefreshRight /></el-icon>
                      <p>点击重新上传</p>
                    </div>
                  </div>
                  <div v-else class="upload-placeholder">
                    <el-icon class="upload-icon"><UploadFilled /></el-icon>
                    <div class="upload-text">
                      <p class="main-text">将图片拖到此处，或点击上传</p>
                      <p class="sub-text">支持 JPG、PNG 格式</p>
                    </div>
                  </div>
                </el-upload>
                <div class="upload-info">
                  <el-icon><PictureFilled /></el-icon>
                  <span>建议尺寸：1920×600px，大小不超过 2MB</span>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="bannerForm.status" size="large" class="status-radio">
              <el-radio :label="true" border>
                <el-icon><Select /></el-icon>
                <span>启用</span>
              </el-radio>
              <el-radio :label="false" border>
                <el-icon><CircleClose /></el-icon>
                <span>禁用</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="dialogVisible = false">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button type="primary" size="large" @click="handleSubmit" :loading="submitLoading">
            <el-icon v-if="!submitLoading"><Check /></el-icon>
            {{ submitLoading ? '提交中...' : '确定' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      width="90%"
      class="preview-dialog"
      :show-close="false"
      @close="closePreview"
    >
      <template #header>
        <div class="preview-header">
          <div class="preview-title">
            <el-icon class="preview-icon"><View /></el-icon>
            <span>轮播图预览</span>
          </div>
          <div class="preview-actions">
            <el-tooltip content="编辑" placement="bottom">
              <el-button 
                type="warning" 
                :icon="Edit" 
                circle 
                class="action-btn edit-btn"
                @click="handleEditFromPreview"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom">
              <el-button 
                type="danger" 
                :icon="Delete" 
                circle 
                class="action-btn delete-btn"
                @click="handleDeleteFromPreview"
              />
            </el-tooltip>
            <el-tooltip content="关闭" placement="bottom">
              <el-button 
                :icon="Close" 
                circle 
                class="action-btn close-btn"
                @click="closePreview"
              />
            </el-tooltip>
          </div>
        </div>
      </template>
      
      <div class="preview-content">
        <!-- 图片信息卡片 -->
        <div class="preview-info-card" v-if="currentPreviewBanner">
          <div class="info-item">
            <span class="info-label">标题：</span>
            <span class="info-value">{{ currentPreviewBanner.title }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">状态：</span>
            <el-tag :type="currentPreviewBanner.status ? 'success' : 'info'" size="small">
              {{ currentPreviewBanner.status ? '已启用' : '已禁用' }}
            </el-tag>
          </div>
          <div class="info-item">
            <span class="info-label">创建时间：</span>
            <span class="info-value">{{ formatTime(currentPreviewBanner.createTime) }}</span>
          </div>
        </div>

        <!-- 图片展示区 -->
        <div class="preview-image-wrapper">
          <div class="image-decoration top-left"></div>
          <div class="image-decoration top-right"></div>
          <div class="image-decoration bottom-left"></div>
          <div class="image-decoration bottom-right"></div>
          
          <el-image
            :src="previewImageUrl"
            fit="contain"
            class="preview-image-full"
            :preview-src-list="[previewImageUrl]"
            :initial-index="0"
            hide-on-click-modal
          >
            <template #placeholder>
              <div class="image-loading">
                <el-icon class="is-loading"><Loading /></el-icon>
                <p>加载中...</p>
              </div>
            </template>
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
                <p>图片加载失败</p>
              </div>
            </template>
          </el-image>
        </div>

        <!-- 操作提示 -->
        <div class="preview-tips">
          <el-icon><InfoFilled /></el-icon>
          <span>点击图片可进入全屏查看模式</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  View, Edit, Delete, Search, Refresh, Plus, Picture,
  EditPen, InfoFilled, UploadFilled, PictureFilled, 
  RefreshRight, Select, CircleClose, Close, Check, Loading
} from '@element-plus/icons-vue'
import { getBannerList, addBanner, updateBanner, updateBannerStatus, deleteBanner, uploadBannerImage } from '@/api/banner'
import { formatTime } from '@/types/user'

export default {
  name: 'BannerManagement',
  setup() {
    const loading = ref(false)
    const submitLoading = ref(false)
    const dialogVisible = ref(false)
    const bannerFormRef = ref(null)
    
    // 图片预览
    const previewVisible = ref(false)
    const previewImageUrl = ref('')
    const currentPreviewBanner = ref(null)
    
    const searchForm = reactive({
      title: '',
      status: null
    })

    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })

    const bannerList = ref([])

    const bannerForm = reactive({
      id: null,
      title: '',
      fileId: null,
      filePathUrl: '',
      status: true
    })

    // 表单验证规则（动态）
    const bannerRules = computed(() => ({
      title: [
        { required: true, message: '请输入轮播图标题', trigger: 'blur' },
        { min: 2, max: 50, message: '标题长度在2-50个字符', trigger: 'blur' }
      ],
      // 编辑时不验证图片，新增时必须上传
      filePathUrl: bannerForm.id ? [] : [
        { required: true, message: '请上传轮播图图片', trigger: 'change' }
      ]
    }))

    const dialogTitle = computed(() => {
      return bannerForm.id ? '编辑轮播图' : '新增轮播图'
    })

    // 加载轮播图列表
    const loadBannerList = async () => {
      loading.value = true
      try {
        const params = {
          page: pagination.page,
          pageSize: pagination.pageSize,
          ...searchForm
        }
        
        const data = await getBannerList(params)
        
        if (data && data.list) {
          bannerList.value = data.list
          pagination.total = data.total
          console.log('轮播图列表加载成功：', {
            当前页: data.pageNum,
            每页数量: data.pageSize,
            总记录数: data.total,
            总页数: data.pages,
            数据条数: data.list.length
          })
        } else {
          bannerList.value = []
          pagination.total = 0
        }
      } catch (error) {
        console.error('获取轮播图列表失败：', error)
        bannerList.value = []
        pagination.total = 0
      } finally {
        loading.value = false
      }
    }

    // 搜索
    const handleSearch = () => {
      pagination.page = 1
      loadBannerList()
    }

    // 重置
    const handleReset = () => {
      searchForm.title = ''
      searchForm.status = null
      pagination.page = 1
      loadBannerList()
    }

    // 新增
    const handleAdd = () => {
      Object.assign(bannerForm, {
        id: null,
        title: '',
        fileId: null,
        filePathUrl: '',
        status: true
      })
      dialogVisible.value = true
    }

    // 查看（图片预览）
    const handleView = (row) => {
      if (row.filePathUrl) {
        previewImageUrl.value = row.filePathUrl
        currentPreviewBanner.value = row
        previewVisible.value = true
      } else {
        ElMessage.warning('暂无图片可预览')
      }
    }
    
    // 关闭预览
    const closePreview = () => {
      previewVisible.value = false
      previewImageUrl.value = ''
      currentPreviewBanner.value = null
    }

    // 从预览界面编辑
    const handleEditFromPreview = () => {
      if (currentPreviewBanner.value) {
        handleEdit(currentPreviewBanner.value)
        closePreview()
      }
    }

    // 从预览界面删除
    const handleDeleteFromPreview = () => {
      if (currentPreviewBanner.value) {
        handleDelete(currentPreviewBanner.value)
        closePreview()
      }
    }

    // 编辑
    const handleEdit = (row) => {
      Object.assign(bannerForm, { ...row })
      dialogVisible.value = true
    }

    // 状态切换
    const handleStatusChange = async (row) => {
      try {
        await updateBannerStatus({
          id: row.id,
          status: row.status
        })
        ElMessage.success(`轮播图 ${row.title} 状态已${row.status ? '启用' : '禁用'}`)
      } catch (error) {
        // 恢复原状态
        row.status = !row.status
        console.error('更新状态失败：', error)
      }
    }

    // 删除
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除轮播图 "${row.title}" 吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await deleteBanner(row.id)
          ElMessage.success('删除成功')
          loadBannerList()
        } catch (error) {
          console.error('删除失败：', error)
        }
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    // 上传前校验
    const beforeUpload = (file) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        ElMessage.error('只能上传 JPG/PNG 格式的图片！')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB！')
        return false
      }
      return true
    }

    // 上传图片
    const handleUpload = async ({ file }) => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        // 调用通用上传接口 /server/common/upload
        const result = await uploadBannerImage(formData)
        
        // 后端返回 { fileId, filePathUrl }
        bannerForm.fileId = result.fileId
        bannerForm.filePathUrl = result.filePathUrl
        
        console.log('图片上传成功：', {
          fileId: result.fileId,
          filePathUrl: result.filePathUrl
        })
        
        ElMessage.success('图片上传成功')
      } catch (error) {
        console.error('图片上传失败：', error)
      }
    }

    // 提交
    const handleSubmit = async () => {
      if (!bannerFormRef.value) return

      try {
        await bannerFormRef.value.validate()
        submitLoading.value = true

        if (bannerForm.id) {
          // 编辑：只提交标题和状态，不提交图片相关字段
          const data = {
            id: bannerForm.id,
            title: bannerForm.title,
            status: bannerForm.status
          }
          await updateBanner(data)
          ElMessage.success('编辑成功')
        } else {
          // 新增：提交所有字段
          const data = {
            title: bannerForm.title,
            fileId: bannerForm.fileId,
            status: bannerForm.status
          }
          await addBanner(data)
          ElMessage.success('新增成功')
        }
        
        dialogVisible.value = false
        loadBannerList()
      } catch (error) {
        console.error('提交失败：', error)
      } finally {
        submitLoading.value = false
      }
    }

    // 对话框关闭
    const handleDialogClose = () => {
      bannerFormRef.value?.resetFields()
    }

    // 分页
    const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.page = 1
      loadBannerList()
    }

    const handleCurrentChange = (page) => {
      pagination.page = page
      loadBannerList()
    }

    // 页面加载时获取数据
    onMounted(() => {
      loadBannerList()
    })

    return {
      loading,
      submitLoading,
      searchForm,
      pagination,
      bannerList,
      dialogVisible,
      dialogTitle,
      bannerForm,
      bannerFormRef,
      bannerRules,
      previewVisible,
      previewImageUrl,
      currentPreviewBanner,
      formatTime,
      loadBannerList,
      handleSearch,
      handleReset,
      handleAdd,
      handleView,
      handleEdit,
      handleStatusChange,
      handleDelete,
      closePreview,
      handleEditFromPreview,
      handleDeleteFromPreview,
      beforeUpload,
      handleUpload,
      handleSubmit,
      handleDialogClose,
      handleSizeChange,
      handleCurrentChange,
      // 图标
      View,
      Edit,
      Delete,
      Search,
      Refresh,
      Plus,
      Picture,
      EditPen,
      InfoFilled,
      UploadFilled,
      PictureFilled,
      RefreshRight,
      Select,
      CircleClose,
      Close,
      Check,
      Loading
    }
  }
}
</script>

<style scoped>
.banner-container {
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

/* 轮播图预览 */
.banner-preview {
  width: 180px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

.banner-preview:hover {
  transform: scale(1.05);
  border-color: var(--primary-color);
  box-shadow: 0 4px 16px rgba(211, 47, 47, 0.2);
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  color: var(--text-secondary);
  font-size: 30px;
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

/* 状态开关样式 */
:deep(.el-switch) {
  --el-switch-on-color: var(--primary-color);
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

/* 上传组件样式 */
.upload-container {
  width: 100%;
}

.banner-uploader {
  width: 100%;
}

:deep(.banner-uploader .el-upload) {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.banner-uploader .el-upload:hover) {
  border-color: var(--primary-color);
}

.banner-uploader-icon {
  font-size: 48px;
  color: var(--text-secondary);
}

.banner-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 对话框样式美化 */
.banner-dialog {
  border-radius: 20px;
  overflow: hidden;
}

:deep(.banner-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;
  padding: 24px 30px;
  margin: 0;
  border-radius: 0;
  position: relative;
  overflow: hidden;
}

:deep(.banner-dialog .el-dialog__header::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
}

:deep(.banner-dialog .el-dialog__title) {
  color: white;
  font-weight: 700;
  font-size: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

:deep(.banner-dialog .el-dialog__headerbtn) {
  top: 24px;
  right: 30px;
  width: 36px;
  height: 36px;
  z-index: 1;
}

:deep(.banner-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 20px;
}

:deep(.banner-dialog .el-dialog__headerbtn:hover .el-dialog__close) {
  color: #ffd700;
}

:deep(.banner-dialog .el-dialog__body) {
  padding: 30px;
  background: #fafafa;
}

:deep(.banner-dialog .el-dialog__footer) {
  padding: 20px 30px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

/* 对话框内容 */
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
  background: linear-gradient(90deg, transparent 0%, var(--primary-color) 50%, transparent 100%);
}

.decoration-icon {
  font-size: 24px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 表单样式 */
.banner-form {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

:deep(.banner-form .el-form-item__label) {
  font-weight: 600;
  color: #303133;
}

:deep(.banner-form .el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

:deep(.banner-form .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

:deep(.banner-form .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

/* 上传区域样式 */
.upload-section {
  width: 100%;
}

.upload-area {
  width: 100%;
}

:deep(.image-uploader .el-upload) {
  width: 100%;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  background: white;
}

:deep(.image-uploader .el-upload:hover) {
  border-color: var(--primary-color);
  background: #fff5f5;
}

:deep(.image-uploader .el-upload-dragger) {
  padding: 40px 20px;
  width: 100%;
  height: auto;
  background: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  font-size: 60px;
  color: #c0c4cc;
  margin-bottom: 15px;
  transition: all 0.3s;
}

:deep(.el-upload:hover) .upload-icon {
  color: var(--primary-color);
  transform: scale(1.1);
}

.upload-text {
  color: #606266;
}

.upload-text .main-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #303133;
}

.upload-text .sub-text {
  font-size: 13px;
  color: #909399;
}

.uploaded-preview {
  position: relative;
  width: 100%;
  height: 250px;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
}

.uploaded-preview:hover .upload-overlay {
  opacity: 1;
}

.reupload-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.upload-info {
  margin-top: 12px;
  padding: 10px 15px;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
  color: #1976d2;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 图片预览容器（编辑模式） */
.image-preview-container {
  width: 100%;
}

.preview-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  font-size: 14px;
  background: #fafafa;
}

.no-image .el-icon {
  font-size: 60px;
  margin-bottom: 10px;
}

.image-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.preview-wrapper:hover .image-mask {
  opacity: 1;
}

.view-icon {
  font-size: 40px;
  color: white;
}

.edit-notice {
  margin-top: 12px;
  padding: 12px 15px;
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  border-radius: 4px;
  color: #e65100;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

/* 状态单选框 */
.status-radio {
  display: flex;
  gap: 15px;
}

:deep(.status-radio .el-radio) {
  margin-right: 0;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s;
}

:deep(.status-radio .el-radio.is-bordered.is-checked) {
  border-color: var(--primary-color);
  background: rgba(211, 47, 47, 0.05);
}

:deep(.status-radio .el-radio__label) {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

/* 对话框底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.dialog-footer .el-button {
  min-width: 100px;
  font-weight: 500;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dialog-footer .el-button--primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  border: none;
}

.dialog-footer .el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
}

/* ==================== 图片预览对话框样式 ==================== */
.preview-dialog {
  border-radius: 20px;
  overflow: hidden;
}

:deep(.preview-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  margin: 0;
  border-radius: 0;
}

:deep(.preview-dialog .el-dialog__body) {
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 20%, #e0c3fc 100%);
  min-height: 500px;
}

/* 预览头部 */
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  position: relative;
  overflow: hidden;
}

.preview-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.4;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 20px;
  font-weight: 700;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-icon {
  font-size: 24px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* 预览操作按钮组 */
.preview-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 2px solid rgba(255, 255, 255, 0.5) !important;
  color: white !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  border-color: white !important;
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.action-btn:active {
  transform: translateY(-1px) scale(1.05);
}

/* 编辑按钮特效 */
.edit-btn:hover {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.3), rgba(255, 152, 0, 0.3)) !important;
  border-color: #ffc107 !important;
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
}

/* 删除按钮特效 */
.delete-btn:hover {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.3), rgba(211, 47, 47, 0.3)) !important;
  border-color: #f44336 !important;
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
}

/* 关闭按钮特效 */
.close-btn:hover {
  background: rgba(255, 255, 255, 0.4) !important;
  border-color: white !important;
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

/* 预览内容 */
.preview-content {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 信息卡片 */
.preview-info-card {
  background: white;
  border-radius: 16px;
  padding: 20px 25px;
  display: flex;
  gap: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-weight: 600;
  color: #606266;
  font-size: 14px;
}

.info-value {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

/* 图片展示区 */
.preview-image-wrapper {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.9);
  overflow: hidden;
  animation: zoomIn 0.5s ease-out;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 装饰元素 */
.image-decoration {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 3px solid;
  border-image: linear-gradient(135deg, #667eea, #764ba2) 1;
  pointer-events: none;
  z-index: 1;
}

.image-decoration.top-left {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
  animation: decorationTopLeft 2s ease-in-out infinite;
}

.image-decoration.top-right {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
  animation: decorationTopRight 2s ease-in-out infinite;
}

.image-decoration.bottom-left {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
  animation: decorationBottomLeft 2s ease-in-out infinite;
}

.image-decoration.bottom-right {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
  animation: decorationBottomRight 2s ease-in-out infinite;
}

@keyframes decorationTopLeft {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-5px, -5px); }
}

@keyframes decorationTopRight {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(5px, -5px); }
}

@keyframes decorationBottomLeft {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-5px, 5px); }
}

@keyframes decorationBottomRight {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(5px, 5px); }
}

/* 预览图片 */
.preview-image-full {
  width: 100%;
  min-height: 450px;
  max-height: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: zoom-in;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
}

.preview-image-full:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

:deep(.preview-image-full img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 加载状态 */
.image-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 450px;
  color: #909399;
  font-size: 16px;
  gap: 15px;
}

.image-loading .el-icon {
  font-size: 50px;
  color: #667eea;
}

.image-loading p {
  font-weight: 500;
  color: #606266;
}

/* 错误状态 */
.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 450px;
  color: #f56c6c;
  font-size: 16px;
  gap: 15px;
  background: linear-gradient(135deg, #fff5f5 0%, #fee 100%);
  border-radius: 12px;
}

.image-error .el-icon {
  font-size: 60px;
}

.image-error p {
  font-weight: 500;
}

/* 操作提示 */
.preview-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 20px;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  border-radius: 12px;
  color: #00695c;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(0, 105, 92, 0.1);
  border: 1px solid rgba(0, 105, 92, 0.1);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.preview-tips .el-icon {
  font-size: 18px;
  color: #00897b;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .preview-info-card {
    flex-direction: column;
    gap: 15px;
  }
  
  .preview-content {
    padding: 20px;
  }
  
  .preview-image-wrapper {
    padding: 20px;
  }
  
  .preview-image-full {
    min-height: 300px;
  }
}

</style>
