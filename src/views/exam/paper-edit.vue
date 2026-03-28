<template>
  <div class="exam-paper-edit-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">{{ isEdit ? '编辑试卷' : '新增试卷' }}</h1>
      <p class="page-subtitle">配置试卷基础信息与题目列表</p>
    </div>

    <div class="card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="试卷名称" prop="title">
          <el-input v-model="form.title" maxlength="100" show-word-limit placeholder="请输入试卷名称" />
        </el-form-item>

        <el-form-item label="试卷描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
            placeholder="请输入试卷描述"
          />
        </el-form-item>

        <div class="row">
          <el-form-item label="考试时长" prop="duration" class="half-item">
            <el-input-number v-model="form.duration" :min="1" :max="600" style="width: 100%" />
          </el-form-item>
          <el-form-item label="及格分" prop="passScore" class="half-item">
            <el-input-number v-model="form.passScore" :min="0" :max="1000" style="width: 100%" />
          </el-form-item>
        </div>

        <div class="question-header">
          <span>题目列表</span>
          <el-button type="primary" text @click="addQuestion">新增题目</el-button>
        </div>

        <el-table :data="form.questions" border style="width: 100%">
          <el-table-column label="题号" type="index" width="60" align="center" />
          <el-table-column label="类型" width="120" align="center">
            <template #default="{ row }">
              <el-select v-model="row.type" style="width: 100%">
                <el-option label="单选题" :value="1" />
                <el-option label="多选题" :value="2" />
                <el-option label="判断题" :value="3" />
                <el-option label="填空题" :value="4" />
                <el-option label="简答题" :value="5" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="题目内容" min-width="280">
            <template #default="{ row }">
              <el-input v-model="row.content" type="textarea" :rows="2" placeholder="请输入题目内容" />
            </template>
          </el-table-column>
          <el-table-column label="分值" width="100" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row.score" :min="1" :max="100" />
            </template>
          </el-table-column>
          <el-table-column label="排序" width="100" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row.sortOrder" :min="1" :max="999" />
            </template>
          </el-table-column>
          <el-table-column label="参考答案" min-width="180">
            <template #default="{ row }">
              <el-input v-model="row.answer" placeholder="可选，题目参考答案" />
            </template>
          </el-table-column>
          <el-table-column label="题目解析" min-width="200">
            <template #default="{ row }">
              <el-input v-model="row.analysis" placeholder="可选，题目解析" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170" align="center">
            <template #default="{ $index }">
              <el-button type="primary" text @click="openOptionDialog($index)">选项</el-button>
              <el-button type="danger" text @click="removeQuestion($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="actions">
          <el-button type="primary" :loading="submitting" @click="handleSubmit">保存试卷</el-button>
          <el-button @click="router.back()">取消</el-button>
        </div>
      </el-form>
    </div>

    <el-dialog v-model="optionDialogVisible" title="配置题目选项" width="760px">
      <div class="option-toolbar">
        <el-button type="primary" text @click="addOption">新增选项</el-button>
      </div>
      <el-table :data="currentOptions" border style="width: 100%">
        <el-table-column label="标识" width="100" align="center">
          <template #default="{ row }">
            <el-select v-model="row.optionLabel" style="width: 80px">
              <el-option label="A" value="A" />
              <el-option label="B" value="B" />
              <el-option label="C" value="C" />
              <el-option label="D" value="D" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="选项内容" min-width="280">
          <template #default="{ row }">
            <el-input v-model="row.content" placeholder="请输入选项内容" />
          </template>
        </el-table-column>
        <el-table-column label="正确答案" width="120" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.isCorrect" />
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template #default="{ row }">
            <el-input-number v-model="row.sortOrder" :min="1" :max="99" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ $index }">
            <el-button type="danger" text @click="removeOption($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="optionDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getExamPaperDetail, saveExamPaper } from '@/api/exam-paper'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)
const optionDialogVisible = ref(false)
const currentQuestionIndex = ref(-1)

const paperId = computed(() => Number(route.query.id || 0))
const isEdit = computed(() => !!paperId.value)

const form = reactive({
  id: null,
  title: '',
  description: '',
  duration: 60,
  passScore: 60,
  questions: []
})

const rules = {
  title: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入考试时长', trigger: 'change' }],
  passScore: [{ required: true, message: '请输入及格分', trigger: 'change' }]
}

const currentOptions = computed(() => {
  if (currentQuestionIndex.value < 0) return []
  return form.questions[currentQuestionIndex.value]?.options || []
})

const createQuestion = (index = 0) => ({
  id: null,
  type: 1,
  content: '',
  score: 5,
  sortOrder: index + 1,
  answer: '',
  analysis: '',
  options: []
})

const createOption = (index = 0) => ({
  id: null,
  content: '',
  optionLabel: '',
  isCorrect: false,
  sortOrder: index + 1
})

const addQuestion = () => {
  form.questions.push(createQuestion(form.questions.length))
}

const removeQuestion = (index) => {
  form.questions.splice(index, 1)
  if (currentQuestionIndex.value === index) {
    optionDialogVisible.value = false
    currentQuestionIndex.value = -1
  }
}

const openOptionDialog = (index) => {
  currentQuestionIndex.value = index
  optionDialogVisible.value = true
}

const addOption = () => {
  if (currentQuestionIndex.value < 0) return
  const options = form.questions[currentQuestionIndex.value].options
  options.push(createOption(options.length))
}

const removeOption = (index) => {
  if (currentQuestionIndex.value < 0) return
  form.questions[currentQuestionIndex.value].options.splice(index, 1)
}

const loadEditDetail = async () => {
  if (!isEdit.value) return
  const detail = await getExamPaperDetail(paperId.value)
  form.id = detail?.id || null
  form.title = detail?.title || ''
  form.description = detail?.description || ''
  form.duration = detail?.duration || 60
  form.passScore = detail?.passScore || 60
  form.questions = (detail?.questions || []).map((q, index) => ({
    id: q.id || null,
    type: q.type || 1,
    content: q.content || q.title || '',
    score: q.score || 5,
    sortOrder: q.sortOrder || index + 1,
    answer: q.answer || '',
    analysis: q.analysis || '',
    options: (q.options || []).map((opt, optIndex) => ({
      id: opt.id || null,
      content: opt.content || '',
      optionLabel: opt.optionLabel || '',
      isCorrect: !!opt.isCorrect,
      sortOrder: opt.sortOrder || optIndex + 1
    }))
  }))
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()

    if (!form.questions.length) {
      ElMessage.warning('请至少添加一道题目')
      return
    }

    if (form.questions.some(q => !q.type || !q.content || !q.score)) {
      ElMessage.warning('请完善题目类型、内容和分值')
      return
    }

    if (form.questions.some(q => [1, 2].includes(q.type) && (!q.options || !q.options.length))) {
      ElMessage.warning('单选题/多选题至少需要一个选项')
      return
    }

    if (form.questions.some(q => (q.options || []).some(opt => !opt.content || !opt.optionLabel))) {
      ElMessage.warning('请完善选项内容和标识')
      return
    }

    submitting.value = true
    const payload = {
      id: form.id || undefined,
      title: form.title,
      description: form.description,
      duration: form.duration,
      passScore: form.passScore,
      questions: form.questions.map((q, index) => ({
        id: q.id || undefined,
        type: q.type,
        content: q.content,
        score: q.score,
        sortOrder: q.sortOrder || index + 1,
        answer: q.answer,
        analysis: q.analysis,
        options: (q.options || []).map((opt, optIndex) => ({
          id: opt.id || undefined,
          content: opt.content,
          optionLabel: opt.optionLabel,
          isCorrect: !!opt.isCorrect,
          sortOrder: opt.sortOrder || optIndex + 1
        }))
      }))
    }

    await saveExamPaper(payload)
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    router.push('/exam/paper')
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    await loadEditDetail()
    if (!form.questions.length) addQuestion()
  } catch (error) {
    console.error(error)
  }
})
</script>

<style scoped>
.exam-paper-edit-container { padding: 0; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 32px; margin-bottom: 8px; }
.page-subtitle { color: var(--text-secondary); font-size: 14px; }
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(230, 57, 70, 0.08);
  border: 1px solid var(--border-light);
}
.row { display: flex; gap: 16px; }
.half-item { flex: 1; }
.question-header {
  margin: 8px 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
.option-toolbar { margin-bottom: 8px; }
.actions { margin-top: 20px; }
</style>
