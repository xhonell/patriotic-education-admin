<template>
  <el-dialog
    :key="userData.id"
    v-model="dialogVisible"
    :title="`为 ${userData.username} 分配角色`"
    width="600px"
    @close="handleClose"
    :before-close="onBeforeClose"
    class="user-role-dialog"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :append-to-body="true"
    :show-close="true"
  >
    <div class="dialog-content" v-loading="loading">
      <!-- 用户信息展示 -->
      <div class="user-info-card">
        <div class="info-item">
          <span class="label">用户ID：</span>
          <span class="value">{{ userData.id }}</span>
        </div>
        <div class="info-item">
          <span class="label">用户名：</span>
          <span class="value">{{ userData.username }}</span>
        </div>
        <div class="info-item">
          <span class="label">邮箱：</span>
          <span class="value">{{ userData.email }}</span>
        </div>
      </div>

      <!-- 角色选择 -->
      <div class="role-selection">
        <div class="section-title">
          <el-icon><User /></el-icon>
          <span>选择角色</span>
        </div>

        <!-- 禁用提示 -->
        <el-alert 
          v-if="isNormalUser" 
          type="warning" 
          title="普通用户不可分配角色"
          description="该用户身份为普通用户，禁止进行角色分配操作。"
          show-icon 
          class="mb-12"
        />
        
        <!-- 当前角色列表 -->
        <div class="current-roles" v-if="currentRoles.length > 0">
          <div class="roles-label">当前角色：</div>
          <div class="role-tags">
            <el-tag
              v-for="role in currentRoles"
              :key="role.roleId"
              closable
              @close="handleRemoveRole(role.roleId)"
              type="success"
              class="role-tag"
            >
              {{ role.roleName }}
            </el-tag>
          </div>
        </div>

        <div v-else class="no-roles">
          <el-empty description="暂无角色" />
        </div>

        <!-- 角色选择器 -->
        <div class="role-selector">
          <el-select
            v-model="selectedRoleIds"
            multiple
            placeholder="选择要分配的角色"
            class="role-select"
            :disabled="isNormalUser"
            @change="handleRoleChange"
          >
            <el-option
              v-for="role in availableRoles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            >
              <div class="option-content">
                <span class="role-name">{{ role.name }}</span>
                <span class="role-description">{{ role.description }}</span>
              </div>
            </el-option>
          </el-select>
        </div>

        <!-- 角色详情表格 -->
        <div class="selected-roles-table" v-if="selectedRoleDetails.length > 0">
          <div class="table-title">已选择的角色：</div>
          <el-table
            :data="selectedRoleDetails"
            stripe
            style="width: 100%; margin-top: 10px"
            size="small"
          >
            <el-table-column prop="name" label="角色名称" min-width="100" />
            <el-table-column prop="description" label="描述" min-width="150" show-overflow-tooltip />
            <el-table-column label="状态" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status ? 'success' : 'info'" size="small">
                  {{ row.status ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading" :disabled="isNormalUser">
          确定分配
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { getUserRoles, assignRoles } from '@/api/user-role'
import { getRoleList } from '@/api/role'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  userData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'success'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const loading = ref(false)
const submitLoading = ref(false)
const currentRoles = ref([])
const selectedRoleIds = ref([])
const allRoles = ref([])

// 是否为普通用户（禁止分配角色）
const isNormalUser = computed(() => {
  const u = props.userData || {}
  return u.role === 1 || u.userRole === 1 || u.identity === '普通用户'
})

// 计算可用的角色（排除已分配的角色）
const availableRoles = computed(() => {
  // 不再过滤，保留全部角色用于正确回显（selectedRoleIds 中的值需要在选项中存在）
  return allRoles.value
})

// 获取已选择角色的详情
const selectedRoleDetails = computed(() => {
  return allRoles.value.filter(role => selectedRoleIds.value.includes(role.id))
})

// 监听 visible 属性
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    loadData()
  }
})

// 监听 dialogVisible 变化
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 并行加载用户角色和所有角色
    const [rolesRes, allRolesRes] = await Promise.all([
      getUserRoles(props.userData.id),
      getRoleList({ page: 1, pageSize: 1000 })
    ])

    // 用户当前角色（后端返回 data: []）
    currentRoles.value = Array.isArray(rolesRes) ? rolesRes : []

    // 兼容多种分页结构：{ list: [] } | { records: [] } | 直接数组
    const roleArr = Array.isArray(allRolesRes)
      ? allRolesRes
      : (allRolesRes?.list || allRolesRes?.records || [])
    allRoles.value = Array.isArray(roleArr) ? roleArr : []

    // 预勾选当前已分配的角色，保证回显
    // 若后端返回的当前角色在可选列表中不存在，则补充到可选项，避免选中项丢失
    const assignedIds = currentRoles.value.map(r => r.roleId)
    const missingOptions = currentRoles.value
      .filter(r => !allRoles.value.some(opt => opt.id === r.roleId))
      .map(r => ({ id: r.roleId, name: r.roleName, description: r.roleDescription, status: r.roleStatus }))
    if (missingOptions.length > 0) {
      allRoles.value = [...allRoles.value, ...missingOptions]
    }
    selectedRoleIds.value = assignedIds
  } catch (error) {
    ElMessage.error('加载数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 处理角色变化
const handleRoleChange = () => {
  // 自动更新，computed 会处理
}

// 移除单个角色
const handleRemoveRole = async (roleId) => {
  try {
    // 从当前角色中移除
    currentRoles.value = currentRoles.value.filter(role => role.roleId !== roleId)
    // 同步移除下拉选中的对应项，确保提交只以 selectedRoleIds 为准
    selectedRoleIds.value = selectedRoleIds.value.filter(id => id !== roleId)
    ElMessage.success('角色已移除')
  } catch (error) {
    ElMessage.error('移除角色失败')
  }
}

// 提交分配
const handleSubmit = async () => {
  // 以 selectedRoleIds 作为最终角色集合来源（已包含初始回显，可手动增删）
  if (selectedRoleIds.value.length === 0) {
    // 允许清空所有角色，如需强制至少一个，可还原提示
    // ElMessage.warning('请至少选择一个角色')
    // return
  }

  submitLoading.value = true
  try {
    const uniqueRoleIds = [...new Set(selectedRoleIds.value)]

    await assignRoles({
      userId: props.userData.id,
      roleIds: uniqueRoleIds
    })

    ElMessage.success('角色分配成功')
    emit('success')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('角色分配失败')
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  selectedRoleIds.value = []
  currentRoles.value = []
}

// before-close 钩子，确保可取消关闭
const onBeforeClose = (done) => {
  if (submitLoading.value) return // 提交中禁止关闭
  handleClose()
  done && done()
}
</script>

<style scoped lang="css">
.user-role-dialog {
  --el-dialog-border-radius: 8px;
}

.dialog-content {
  padding: 20px 0;
}

.user-info-card {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  border-left: 4px solid #e63946;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #333;
  min-width: 80px;
}

.value {
  color: #666;
  flex: 1;
}

.role-selection {
  margin-top: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.section-title :deep(.el-icon) {
  margin-right: 8px;
  color: #e63946;
}

.current-roles {
  margin-bottom: 20px;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.roles-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.role-tag {
  font-size: 13px;
}

.no-roles {
  padding: 20px 0;
}

.role-selector {
  margin-bottom: 20px;
}

.role-select {
  width: 100%;
}

.role-select :deep(.el-input__wrapper) {
  border-radius: 6px;
}

.option-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.role-name {
  font-weight: 600;
  color: #333;
}

.role-description {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.selected-roles-table {
  margin-top: 20px;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-info-card {
    padding: 12px;
  }

  .info-item {
    font-size: 13px;
  }

  .label {
    min-width: 70px;
  }
}
</style>

