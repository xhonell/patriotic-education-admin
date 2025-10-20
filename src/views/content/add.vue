<template>
  <div class="content-add-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">{{ isEdit ? '编辑内容' : '新增内容' }}</h1>
      <p class="page-subtitle">创建爱国教育内容</p>
    </div>

    <div class="card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="内容标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入内容标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="内容分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="历史故事" value="history" />
            <el-option label="英雄事迹" value="hero" />
            <el-option label="文化传承" value="culture" />
            <el-option label="科技成就" value="tech" />
            <el-option label="爱国精神" value="patriotic" />
          </el-select>
        </el-form-item>

        <el-form-item label="封面图片" prop="cover">
          <el-upload
            class="cover-uploader"
            action="#"
            :show-file-list="false"
            :on-change="handleCoverChange"
            accept="image/*"
          >
            <img v-if="form.cover" :src="form.cover" class="cover-image" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：800 x 450，支持jpg、png格式</div>
        </el-form-item>

        <el-form-item label="内容简介" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="4"
            placeholder="请输入内容简介"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="内容详情" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="12"
            placeholder="请输入内容详情"
          />
        </el-form-item>

        <el-form-item label="标签">
          <el-tag
            v-for="tag in form.tags"
            :key="tag"
            closable
            @close="handleTagClose(tag)"
            style="margin-right: 10px;"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="tagInputVisible"
            ref="tagInputRef"
            v-model="tagInputValue"
            size="small"
            style="width: 100px;"
            @blur="handleTagConfirm"
            @keyup.enter="handleTagConfirm"
          />
          <el-button v-else size="small" @click="showTagInput">
            <el-icon><Plus /></el-icon>
            添加标签
          </el-button>
        </el-form-item>

        <el-form-item label="推荐等级" prop="recommendLevel">
          <el-rate v-model="form.recommendLevel" :max="5" />
          <span style="margin-left: 10px; color: #636e72;">
            {{ form.recommendLevel }}星推荐
          </span>
        </el-form-item>

        <el-form-item label="适用年龄" prop="ageRange">
          <el-checkbox-group v-model="form.ageRange">
            <el-checkbox label="10-12岁" />
            <el-checkbox label="13-15岁" />
            <el-checkbox label="16-18岁" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="发布状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">保存草稿</el-radio>
            <el-radio :label="1">立即发布</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            <el-icon><Check /></el-icon>
            提交
          </el-button>
          <el-button @click="handleCancel">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'ContentAdd',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const formRef = ref(null)
    const tagInputRef = ref(null)
    const tagInputVisible = ref(false)
    const tagInputValue = ref('')
    const isEdit = ref(!!route.query.id)

    const form = reactive({
      title: '',
      category: '',
      cover: '',
      summary: '',
      content: '',
      tags: ['爱国教育', '青少年'],
      recommendLevel: 4,
      ageRange: ['13-15岁'],
      status: 1
    })

    const rules = {
      title: [
        { required: true, message: '请输入内容标题', trigger: 'blur' }
      ],
      category: [
        { required: true, message: '请选择内容分类', trigger: 'change' }
      ],
      summary: [
        { required: true, message: '请输入内容简介', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '请输入内容详情', trigger: 'blur' }
      ]
    }

    const handleCoverChange = (file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        form.cover = e.target.result
      }
      reader.readAsDataURL(file.raw)
    }

    const handleTagClose = (tag) => {
      form.tags = form.tags.filter(t => t !== tag)
    }

    const showTagInput = () => {
      tagInputVisible.value = true
      nextTick(() => {
        tagInputRef.value.focus()
      })
    }

    const handleTagConfirm = () => {
      if (tagInputValue.value) {
        form.tags.push(tagInputValue.value)
        tagInputValue.value = ''
      }
      tagInputVisible.value = false
    }

    const handleSubmit = async () => {
      if (!formRef.value) return

      try {
        await formRef.value.validate()
        ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
        router.push('/content/list')
      } catch (error) {
        console.log('表单验证失败', error)
      }
    }

    const handleCancel = () => {
      router.back()
    }

    return {
      formRef,
      tagInputRef,
      tagInputVisible,
      tagInputValue,
      isEdit,
      form,
      rules,
      handleCoverChange,
      handleTagClose,
      showTagInput,
      handleTagConfirm,
      handleSubmit,
      handleCancel
    }
  }
}
</script>

<style scoped>
.content-add-container {
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
  padding: 40px;
  box-shadow: 0 2px 12px rgba(230, 57, 70, 0.08);
  border: 1px solid var(--border-light);
}

.cover-uploader {
  display: inline-block;
}

.cover-uploader :deep(.el-upload) {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  width: 400px;
  height: 225px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-uploader :deep(.el-upload:hover) {
  border-color: var(--primary-color);
}

.cover-uploader-icon {
  font-size: 48px;
  color: var(--text-secondary);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>

