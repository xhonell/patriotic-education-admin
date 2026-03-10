<template>
  <div class="content-add-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">{{ isEdit ? '编辑内容' : '新增内容' }}</h1>
      <p class="page-subtitle">维护爱国教育内容信息，支持文章与视频两种类型</p>
    </div>

    <div class="card form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" class="content-form">
        <div class="form-section">
          <div class="section-title">基础信息</div>
          <div class="section-grid two-col">
            <el-form-item label="内容标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入内容标题" maxlength="100" show-word-limit />
            </el-form-item>

            <el-form-item label="内容类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio :label="1">文章</el-radio>
                <el-radio :label="2">视频</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="内容分类" prop="categoryId">
              <el-tree-select
                v-model="form.categoryId"
                :data="categoryOptions"
                :props="{ label: 'label', value: 'value', children: 'children' }"
                placeholder="请选择分类"
                check-strictly
                clearable
              />
            </el-form-item>

            <el-form-item label="内容标签" prop="tagId">
              <el-select v-model="form.tagId" placeholder="请选择标签" clearable>
                <el-option
                  v-for="item in tagOptions"
                  :key="item.value ?? item.id"
                  :label="item.label ?? buildOptionLabel(item.name, item.description)"
                  :value="item.value ?? item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="难度等级" prop="difficultyId">
              <el-select v-model="form.difficultyId" placeholder="请选择难度" clearable>
                <el-option
                  v-for="item in difficultyOptions"
                  :key="getOptionId(item)"
                  :label="buildOptionLabel(getOptionLabel(item), item.description)"
                  :value="getOptionId(item)"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="政治面貌" prop="politicId">
              <el-select v-model="form.politicId" placeholder="请选择政治面貌" clearable>
                <el-option
                  v-for="item in politicOptions"
                  :key="getOptionId(item)"
                  :label="buildOptionLabel(getOptionLabel(item), item.description)"
                  :value="getOptionId(item)"
                />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="内容简介" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入内容简介"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="发布状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="form-section">
          <div class="section-title">封面上传</div>
          <el-form-item label="封面图片" prop="fileId">
            <div class="cover-upload-wrap">
              <el-upload
                class="cover-uploader"
                :show-file-list="false"
                :http-request="handleCoverUpload"
                accept="image/*"
              >
                <img v-if="coverPreviewUrl" :src="coverPreviewUrl" class="cover-image" />
                <div v-else class="cover-placeholder">
                  <el-icon class="cover-icon"><Plus /></el-icon>
                  <span>点击上传封面</span>
                </div>
              </el-upload>
              <div class="cover-tips">
                <p>建议尺寸：16:9，支持 jpg/png/webp</p>
                <p>上传成功后自动写入封面ID：<b>{{ form.fileId || '未上传' }}</b></p>
              </div>
            </div>
          </el-form-item>
        </div>

        <div class="form-section" v-if="form.type === 1">
          <div class="section-title">文章信息</div>
          <el-form-item label="文章内容" prop="content">
            <div class="editor-wrap">
              <div class="editor-toolbar-extra">
                <el-button type="primary" plain size="small" @click="previewVisible = true">预览富文本</el-button>
              </div>
              <QuillEditor
                v-model:content="form.content"
                content-type="html"
                theme="snow"
                toolbar="full"
                placeholder="请输入文章内容"
                class="rich-editor"
              />
            </div>
          </el-form-item>
          <div class="section-grid two-col">
            <el-form-item label="作者" prop="author">
              <el-input v-model="form.author" placeholder="请输入作者" />
            </el-form-item>
            <el-form-item label="来源" prop="source">
              <el-input v-model="form.source" placeholder="请输入来源" />
            </el-form-item>
          </div>
        </div>

        <div class="form-section" v-else>
          <div class="section-title">视频信息</div>
          <el-form-item label="上传视频" prop="coverId">
            <div class="video-upload-area">
              <el-upload
                class="video-uploader"
                :show-file-list="false"
                :http-request="handleVideoUpload"
                accept="video/*"
              >
                <el-button v-if="!videoPreviewUrl" type="primary" class="video-upload-btn">选择并上传视频</el-button>
              </el-upload>

              <video v-if="videoPreviewUrl" :src="videoPreviewUrl" controls class="video-preview"></video>

              <el-upload
                v-if="videoPreviewUrl"
                class="video-uploader"
                :show-file-list="false"
                :http-request="handleVideoUpload"
                accept="video/*"
              >
                <el-button type="primary" class="video-upload-btn">重新上传视频</el-button>
              </el-upload>
            </div>
          </el-form-item>

          <div class="section-grid two-col">
            <el-form-item label="视频时长(秒)" prop="duration">
              <el-input-number v-model="form.duration" :min="1" :step="1" style="width: 100%" />
            </el-form-item>
            <el-form-item label="分辨率" prop="resolution">
              <el-input v-model="form.resolution" placeholder="如：1920x1080" />
            </el-form-item>
            <el-form-item label="视频格式" prop="format">
              <el-input v-model="form.format" placeholder="如：mp4" />
            </el-form-item>
            <el-form-item label="视频大小(字节)" prop="size">
              <el-input-number v-model="form.size" :min="1" :step="1" style="width: 100%" />
            </el-form-item>
          </div>
        </div>

        <el-form-item class="form-actions">
          <el-button type="primary" :loading="submitting" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog v-model="previewVisible" title="文章内容预览" width="900px" destroy-on-close>
      <div class="preview-container ql-editor" v-html="previewContent"></div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { addContent, getContentList, updateContent, uploadContentFile } from '@/api/content'
import { getContentCategoryOptions } from '@/api/content-category'
import { getDifficultyOptions } from '@/api/difficulty'
import { getPoliticOptions } from '@/api/politic'
import { getTagOptions } from '@/api/tag'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const submitting = ref(false)
const isEdit = ref(!!route.query.id)
const coverPreviewUrl = ref('')
const videoPreviewUrl = ref('')
const previewVisible = ref(false)
const previewContent = computed(() => form.content || '<p style="color:#909399">暂无内容</p>')

const categoryOptions = ref([])
const difficultyOptions = ref([])
const politicOptions = ref([])
const tagOptions = ref([])

const form = reactive({
  id: null,
  title: '',
  type: 1,
  categoryId: null,
  description: '',
  fileId: null,
  difficultyId: null,
  tagId: null,
  politicId: null,
  status: 1,
  content: '',
  author: '',
  source: '',
  duration: null,
  coverId: null,
  resolution: '',
  format: '',
  size: null
})

const validateCoverImage = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('请上传封面图片'))
    return
  }
  callback()
}

const validateVideoId = (_rule, value, callback) => {
  if (form.type === 2 && !value) {
    callback(new Error('请上传视频'))
    return
  }
  callback()
}

const rules = {
  title: [{ required: true, message: '请输入内容标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择内容类型', trigger: 'change' }],
  categoryId: [{ required: true, message: '请选择内容分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入内容简介', trigger: 'blur' }],
  difficultyId: [{ required: true, message: '请选择难度等级', trigger: 'change' }],
  politicId: [{ required: true, message: '请选择政治面貌', trigger: 'change' }],
  tagId: [{ required: true, message: '请选择内容标签', trigger: 'change' }],
  fileId: [{ validator: validateCoverImage, trigger: 'change' }],
  coverId: [{ validator: validateVideoId, trigger: 'change' }],
  status: [{ required: true, message: '请选择发布状态', trigger: 'change' }]
}

const getOptionId = (item) => item?.value ?? item?.id ?? null
const getOptionLabel = (item) => item?.label ?? item?.name ?? ''

const buildOptionLabel = (name, description) => {
  if (!description) return name || ''
  return `${name || ''}（${description}）`
}

const loadOptions = async () => {
  const [categoryRes, difficultyRes, politicRes, tagRes] = await Promise.all([
    getContentCategoryOptions({}),
    getDifficultyOptions({}),
    getPoliticOptions({}),
    getTagOptions({})
  ])

  categoryOptions.value = Array.isArray(categoryRes) ? categoryRes : []
  difficultyOptions.value = Array.isArray(difficultyRes) ? difficultyRes : difficultyRes?.list || []
  politicOptions.value = Array.isArray(politicRes) ? politicRes : politicRes?.list || []
  tagOptions.value = Array.isArray(tagRes) ? tagRes : tagRes?.list || []
}

const handleCoverUpload = async (option) => {
  try {
    const formData = new FormData()
    formData.append('file', option.file)
    const res = await uploadContentFile(formData)

    const uploadedId = res?.fileId ?? res?.id
    const url = res?.filePathUrl ?? res?.url

    if (!uploadedId) {
      throw new Error('未获取到文件ID')
    }

    form.fileId = uploadedId
    if (url) {
      coverPreviewUrl.value = url
    }

    ElMessage.success('封面上传成功')
    option.onSuccess && option.onSuccess(res)
  } catch (error) {
    ElMessage.error(error?.message || '封面上传失败')
    option.onError && option.onError(error)
  }
}

const parseVideoMeta = (file, videoUrl) => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = videoUrl

    video.onloadedmetadata = () => {
      resolve({
        duration: Math.round(video.duration || 0),
        resolution: `${video.videoWidth || 0}x${video.videoHeight || 0}`,
        format: (file?.name?.split('.').pop() || '').toLowerCase(),
        size: file?.size || 0
      })
      URL.revokeObjectURL(videoUrl)
    }

    video.onerror = () => {
      resolve({
        duration: null,
        resolution: '',
        format: (file?.name?.split('.').pop() || '').toLowerCase(),
        size: file?.size || 0
      })
      URL.revokeObjectURL(videoUrl)
    }
  })
}

const handleVideoUpload = async (option) => {
  try {
    const formData = new FormData()
    formData.append('file', option.file)
    const res = await uploadContentFile(formData)

    const uploadedId = res?.fileId ?? res?.id
    const serverUrl = res?.filePathUrl ?? res?.url
    if (!uploadedId) {
      throw new Error('未获取到视频ID')
    }

    form.coverId = uploadedId

    if (serverUrl) {
      videoPreviewUrl.value = serverUrl
    } else {
      videoPreviewUrl.value = URL.createObjectURL(option.file)
    }

    const meta = await parseVideoMeta(option.file, URL.createObjectURL(option.file))
    form.duration = meta.duration
    form.resolution = meta.resolution
    form.format = meta.format
    form.size = meta.size

    ElMessage.success('视频上传成功，已自动解析视频信息')
    option.onSuccess && option.onSuccess(res)
  } catch (error) {
    ElMessage.error(error?.message || '视频上传失败')
    option.onError && option.onError(error)
  }
}

const loadEditData = async () => {
  if (!isEdit.value) return
  const id = Number(route.query.id)
  if (!id) return

  const res = await getContentList({ page: 1, pageSize: 9999 })
  const target = (res?.list || []).find(item => item.id === id)
  if (!target) {
    ElMessage.warning('未找到要编辑的内容数据')
    return
  }

  form.id = target.id
  form.title = target.title || ''
  form.type = target.type ?? 1
  form.categoryId = target.categoryId ?? null
  form.description = target.description || ''
  form.fileId = target.fileId ?? null
  form.difficultyId = target.difficultyId ?? null
  form.tagId = target.tagId ?? null
  form.politicId = target.politicId ?? null
  form.status = target.status ?? 1
  form.content = target.content || ''
  form.author = target.author || ''
  form.source = target.source || ''
  form.duration = target.duration ?? null
  form.coverId = target.coverId ?? null
  form.resolution = target.resolution || ''
  form.format = target.format || ''
  form.size = target.size ?? null
  coverPreviewUrl.value = target.fileImage || ''
  videoPreviewUrl.value = target.type === 2 ? (target.coverUrl || '') : ''
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()

    if (form.type === 1 && (!form.content || !form.author)) {
      ElMessage.warning('文章类型请填写文章内容和作者')
      return
    }

    if (form.type === 2 && (!form.fileId || !form.coverId || !form.duration || !form.resolution || !form.format || !form.size)) {
      ElMessage.warning('视频类型请上传视频和封面，并完善视频信息')
      return
    }

    submitting.value = true

    const payload = {
      id: form.id,
      title: form.title,
      type: form.type,
      categoryId: form.categoryId,
      description: form.description,
      fileId: form.fileId,
      difficultyId: form.difficultyId,
      tagId: form.tagId,
      politicId: form.politicId,
      status: form.status,
      content: form.type === 1 ? form.content : undefined,
      author: form.type === 1 ? form.author : undefined,
      source: form.type === 1 ? form.source : undefined,
      duration: form.type === 2 ? form.duration : undefined,
      coverId: form.type === 2 ? form.coverId : undefined,
      resolution: form.type === 2 ? form.resolution : undefined,
      format: form.type === 2 ? form.format : undefined,
      size: form.type === 2 ? form.size : undefined
    }

    if (isEdit.value) {
      await updateContent(payload)
      ElMessage.success('更新成功')
    } else {
      delete payload.id
      await addContent(payload)
      ElMessage.success('创建成功')
    }

    router.push('/content/list')
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  try {
    await loadOptions()
    await loadEditData()
  } catch (error) {
    console.error(error)
  }
})
</script>

<style scoped>
.content-add-container { padding: 0; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 32px; margin-bottom: 8px; }
.page-subtitle { color: var(--text-secondary); font-size: 14px; }

.form-card {
  background: white;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(230, 57, 70, 0.08);
  border: 1px solid var(--border-light);
}

.form-section {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 18px 18px 4px;
  margin-bottom: 18px;
  background: linear-gradient(180deg, #fff 0%, #fffafa 100%);
}

.section-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-left: 10px;
  border-left: 4px solid var(--primary-color);
}

.section-grid.two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.cover-upload-wrap {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.cover-uploader :deep(.el-upload) {
  width: 260px;
  height: 146px;
  border-radius: 10px;
  border: 2px dashed #dcdfe6;
  overflow: hidden;
  transition: all 0.3s;
}

.cover-uploader :deep(.el-upload:hover) {
  border-color: var(--primary-color);
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  gap: 8px;
}

.cover-icon { font-size: 28px; }
.cover-image { width: 100%; height: 100%; object-fit: cover; }

.cover-tips {
  color: #909399;
  font-size: 12px;
  line-height: 1.8;
}

.video-upload-area {
  width: 100%;
}

.video-upload-btn {
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(230, 57, 70, 0.22);
}

.video-upload-btn:hover {
  transform: translateY(-1px);
}

.video-preview {
  width: 100%;
  max-height: 320px;
  border-radius: 10px;
  margin: 10px 0 12px;
  background: #000;
}


.editor-wrap {
  width: 100%;
}

.editor-toolbar-extra {
  margin-bottom: 8px;
  display: flex;
  justify-content: flex-end;
}

.rich-editor {
  min-height: 280px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
}

.rich-editor :deep(.ql-toolbar.ql-snow) {
  border: none;
  border-bottom: 1px solid #ebeef5;
  background: #fff;
}

.rich-editor :deep(.ql-container.ql-snow) {
  border: none;
  min-height: 220px;
  font-size: 14px;
}

.preview-container {
  min-height: 260px;
  max-height: 60vh;
  overflow: auto;
  font-size: 15px;
  color: #303133;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fff;
}

.preview-container.ql-editor {
  white-space: pre-wrap;
  line-height: 1.8;
}

.preview-container.ql-editor :deep(.ql-align-center) {
  text-align: center;
}

.preview-container.ql-editor :deep(.ql-align-right) {
  text-align: right;
}

.preview-container.ql-editor :deep(.ql-align-justify) {
  text-align: justify;
}

.preview-container :deep(p) {
  margin: 0 0 1em;
}

.preview-container :deep(img) {
  max-width: 100%;
  height: auto;
}

.form-actions { margin-top: 10px; }

@media (max-width: 992px) {
  .section-grid.two-col { grid-template-columns: 1fr; }
  .cover-upload-wrap { flex-direction: column; }
}
</style>
