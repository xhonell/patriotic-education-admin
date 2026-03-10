<template>
  <div class="recommend-system-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">推荐配置</h1>
      <p class="page-subtitle">管理推荐算法与权重配置</p>
    </div>

    <el-row :gutter="24">
      <el-col :xs="24" :lg="14">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">推荐配置列表</h3>
            <div class="header-actions">
              <el-button type="primary" @click="handleAdd">
                <el-icon><Plus /></el-icon>
                新增配置
              </el-button>
              <el-button @click="handleRefresh">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </div>

          <el-table :data="configList" stripe style="width: 100%" v-loading="loading" border>
            <el-table-column prop="id" label="ID" width="70" align="center" />
            <el-table-column label="算法/状态" width="150" align="center">
              <template #default="{ row }">
                <div class="table-badges">
                  <el-tag type="info">{{ row.algorithmTypeName || algorithmLabel(row.algorithmType) }}</el-tag>
                  <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                    {{ row.status === 1 ? '启用' : '禁用' }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="规则" min-width="200">
              <template #default="{ row }">
                <div class="rule-cell">
                  <div class="rule-name">{{ row.ruleName || '-' }}</div>
                  <div class="rule-desc">{{ row.ruleDesc || '-' }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="参数" min-width="200" align="center">
              <template #default="{ row }">
                <div class="param-grid">
                  <span>推荐数 {{ row.recommendCount }}</span>
                  <span>多/新/热 {{ row.diversityWeight }}/{{ row.freshnessWeight }}/{{ row.hotWeight }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="适配" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="row.ageAdapt ? 'success' : 'info'" size="small">年龄</el-tag>
                <el-tag :type="row.politicalAdapt ? 'success' : 'info'" size="small" style="margin-left: 6px">政治</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170" align="center">
              <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template #default="{ row }">
                <el-button type="warning" text @click="handleEdit(row)">编辑</el-button>
                <el-button type="danger" text @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <el-col :xs="24" :lg="10">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">当前生效配置</h3>
            <el-button text @click="loadActiveConfig">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>

          <div v-if="activeConfig" class="active-config">
            <div class="active-header">
              <div>
                <div class="active-title">{{ activeConfig.ruleName || '默认规则' }}</div>
                <div class="active-subtitle">{{ activeConfig.ruleDesc || '暂无描述' }}</div>
              </div>
              <el-tag :type="activeConfig.status === 1 ? 'success' : 'info'">
                {{ activeConfig.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </div>

            <div class="active-grid">
              <div class="active-item">
                <span class="label">算法类型</span>
                <span class="value">{{ activeConfig.algorithmTypeName || algorithmLabel(activeConfig.algorithmType) }}</span>
              </div>
              <div class="active-item">
                <span class="label">推荐数量</span>
                <span class="value">{{ activeConfig.recommendCount }}</span>
              </div>
              <div class="active-item">
                <span class="label">多样性权重</span>
                <span class="value">{{ activeConfig.diversityWeight }}</span>
              </div>
              <div class="active-item">
                <span class="label">新鲜度权重</span>
                <span class="value">{{ activeConfig.freshnessWeight }}</span>
              </div>
              <div class="active-item">
                <span class="label">热度权重</span>
                <span class="value">{{ activeConfig.hotWeight }}</span>
              </div>
              <div class="active-item">
                <span class="label">年龄适配</span>
                <span class="value">{{ activeConfig.ageAdapt ? '开启' : '关闭' }}</span>
              </div>
              <div class="active-item">
                <span class="label">政治面貌适配</span>
                <span class="value">{{ activeConfig.politicalAdapt ? '开启' : '关闭' }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-text">暂无生效配置</div>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="680px" center destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="config-form">
        <div class="form-grid">
          <el-form-item label="推荐算法" prop="algorithmType">
            <el-select v-model="form.algorithmType" placeholder="请选择算法">
              <el-option :value="1" label="热门推荐" />
              <el-option :value="2" label="最新推荐" />
              <el-option :value="3" label="混合推荐" />
              <el-option :value="4" label="协同过滤" />
            </el-select>
          </el-form-item>
          <el-form-item label="推荐数量" prop="recommendCount">
            <el-input-number v-model="form.recommendCount" :min="1" :max="100" />
          </el-form-item>
          <el-form-item label="多样性权重" prop="diversityWeight">
            <el-slider v-model="form.diversityWeight" :min="0" :max="100" show-input />
          </el-form-item>
          <el-form-item label="新鲜度权重" prop="freshnessWeight">
            <el-slider v-model="form.freshnessWeight" :min="0" :max="100" show-input />
          </el-form-item>
          <el-form-item label="热度权重" prop="hotWeight">
            <el-slider v-model="form.hotWeight" :min="0" :max="100" show-input />
          </el-form-item>
          <el-form-item label="年龄适配" prop="ageAdapt">
            <el-switch v-model="form.ageAdapt" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="政治面貌适配" prop="politicalAdapt">
            <el-switch v-model="form.politicalAdapt" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="规则名称" prop="ruleName" class="span-two">
            <el-input v-model="form.ruleName" placeholder="请输入规则名称" />
          </el-form-item>
          <el-form-item label="规则描述" prop="ruleDesc" class="span-two">
            <el-input v-model="form.ruleDesc" type="textarea" :rows="3" placeholder="请输入规则描述" />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import {
  addRecommendConfig,
  deleteRecommendConfig,
  getActiveRecommendConfig,
  getRecommendConfigList,
  updateRecommendConfig
} from '@/api/recommend-config'

const loading = ref(false)
const configList = ref([])
const activeConfig = ref(null)
const dialogVisible = ref(false)
const dialogTitle = ref('新增配置')
const formRef = ref(null)

const form = reactive({
  id: null,
  algorithmType: 1,
  recommendCount: 20,
  diversityWeight: 50,
  freshnessWeight: 50,
  hotWeight: 50,
  ageAdapt: 1,
  politicalAdapt: 1,
  ruleName: '',
  ruleDesc: '',
  status: 1
})

const rules = {
  algorithmType: [{ required: true, message: '请选择算法类型', trigger: 'change' }],
  recommendCount: [{ required: true, message: '请输入推荐数量', trigger: 'change' }],
  diversityWeight: [{ required: true, message: '请输入多样性权重', trigger: 'change' }],
  freshnessWeight: [{ required: true, message: '请输入新鲜度权重', trigger: 'change' }],
  hotWeight: [{ required: true, message: '请输入热度权重', trigger: 'change' }],
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }]
}

const algorithmLabel = (value) => {
  switch (value) {
    case 1:
      return '热门推荐'
    case 2:
      return '最新推荐'
    case 3:
      return '混合推荐'
    case 4:
      return '协同过滤'
    default:
      return '-'
  }
}

const loadList = async () => {
  loading.value = true
  try {
    const res = await getRecommendConfigList({ page: 1, pageSize: 999 })
    configList.value = res?.list || []
  } catch (error) {
    console.error(error)
    configList.value = []
  } finally {
    loading.value = false
  }
}

const loadActiveConfig = async () => {
  try {
    activeConfig.value = await getActiveRecommendConfig()
  } catch (error) {
    console.error(error)
    activeConfig.value = null
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增配置'
  form.id = null
  form.algorithmType = 1
  form.recommendCount = 20
  form.diversityWeight = 50
  form.freshnessWeight = 50
  form.hotWeight = 50
  form.ageAdapt = 1
  form.politicalAdapt = 1
  form.ruleName = ''
  form.ruleDesc = ''
  form.status = 1
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑配置'
  form.id = row.id
  form.algorithmType = row.algorithmType
  form.recommendCount = row.recommendCount
  form.diversityWeight = row.diversityWeight
  form.freshnessWeight = row.freshnessWeight
  form.hotWeight = row.hotWeight
  form.ageAdapt = row.ageAdapt
  form.politicalAdapt = row.politicalAdapt
  form.ruleName = row.ruleName
  form.ruleDesc = row.ruleDesc
  form.status = row.status
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()

  try {
    if (form.id) {
      await updateRecommendConfig({ ...form })
      ElMessage.success('更新成功')
    } else {
      await addRecommendConfig({ ...form })
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadList()
    loadActiveConfig()
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除配置ID ${row.id} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteRecommendConfig(row.id)
      ElMessage.success('删除成功')
      loadList()
      loadActiveConfig()
    } catch (error) {
      console.error(error)
    }
  })
}

const handleRefresh = () => {
  loadList()
  loadActiveConfig()
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
  handleRefresh()
})
</script>

<style scoped>
.recommend-system-container {
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
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(230, 57, 70, 0.08);
  border: 1px solid var(--border-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-light);
}

.header-actions {
  display: flex;
  gap: 10px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  position: relative;
  padding-left: 12px;
}

.card-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #e63946 0%, #f9ca24 100%);
  border-radius: 2px;
}

.active-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.active-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
  border: 1px solid var(--border-light);
}

.active-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.active-subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.active-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.active-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff6f6;
  border: 1px solid var(--border-light);
}

.active-item .label {
  color: var(--text-secondary);
  font-size: 13px;
}

.active-item .value {
  font-weight: 600;
  color: #303133;
}

.table-badges {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.rule-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rule-name {
  font-weight: 600;
  color: #303133;
}

.rule-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

.param-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #606266;
}

.config-form {
  padding: 6px 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
}

.span-two {
  grid-column: span 2;
}

.config-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.config-form :deep(.el-slider) {
  width: 100%;
}

.empty-text {
  text-align: center;
  color: var(--text-secondary);
  padding: 40px 0;
}

@media (max-width: 992px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .span-two {
    grid-column: span 1;
  }

  .active-grid {
    grid-template-columns: 1fr;
  }
}
</style>
