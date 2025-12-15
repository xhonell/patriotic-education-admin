<template>
  <div class="permission-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title gradient-text">权限管理</h1>
      <p class="page-subtitle">管理系统菜单和权限配置</p>
    </div>

    <!-- 搜索工具栏 -->
    <div class="toolbar card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入权限名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select 
            v-model="searchForm.type" 
            placeholder="请选择类型" 
            clearable
            style="width: 120px"
          >
            <el-option label="菜单" :value="1" />
            <el-option label="按钮" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select 
            v-model="searchForm.status" 
            placeholder="请选择状态" 
            clearable
            style="width: 120px"
          >
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
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
            新增权限
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格（懒加载树形表格） -->
    <div class="card">
      <el-table
        :data="permissionList"
        v-loading="loading"
        style="width: 100%"
        stripe
        row-key="id"
        :lazy="true"
        :load="loadChildren"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="权限名称" min-width="200" align="left">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'primary' : 'warning'" size="large">
              <el-icon v-if="row.type === 1"><Menu /></el-icon>
              <el-icon v-else><Operation /></el-icon>
              {{ row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="权限标识" min-width="180" align="center" />
        <el-table-column label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'primary' : 'warning'">
              {{ row.type === 1 ? '菜单' : '按钮' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status"
              @change="handleStatusChange(row, $event)"
              :loading="row.statusLoading"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-tooltip content="新增子项" placement="top" v-if="row.type === 1">
                <el-button 
                  type="success" 
                  :icon="Plus" 
                  circle 
                  size="small"
                  @click="handleAddChild(row)"
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
          <div class="decoration-icon">🔐</div>
          <div class="decoration-line"></div>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="permission-form"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入权限名称"
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

          <el-form-item label="权限标识" prop="code">
            <el-input
              v-model="form.code"
              placeholder="如：system:user:view"
              size="large"
              maxlength="100"
              show-word-limit
              clearable
            >
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="权限类型" prop="type">
            <el-radio-group v-model="form.type" size="large">
              <el-radio :label="1" border>
                <el-icon><Menu /></el-icon>
                菜单（可有子级）
              </el-radio>
              <el-radio :label="2" border>
                <el-icon><Operation /></el-icon>
                按钮（无子级）
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="路由路径" prop="path" v-if="form.type === 1">
            <el-input
              v-model="form.path"
              placeholder="如：/system/user"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><Link /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="父级权限" prop="parentId">
            <el-cascader
              v-model="parentIdArray"
              :options="parentOptions"
              :props="cascaderProps"
              placeholder="选择父级权限（不选则为顶级）"
              size="large"
              clearable
              filterable
              :disabled="isAddChild"
              @change="handleParentChange"
              style="width: 100%"
              v-loading="parentLoading"
            >
              <template #prefix>
                <el-icon><Fold /></el-icon>
              </template>
            </el-cascader>
            <div class="form-tip" v-if="isAddChild">
              <el-icon><InfoFilled /></el-icon>
              <span>当前为 "{{ parentName }}" 的子权限</span>
            </div>
            <div class="form-tip" v-if="form.id">
              <el-icon><InfoFilled /></el-icon>
              <span>修改父级权限可能影响菜单层级结构，请谨慎操作</span>
            </div>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="form.sort"
              :min="0"
              :max="9999"
              placeholder="数字越小越靠前"
              size="large"
              style="width: 100%"
              controls-position="right"
            />
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status" size="large" class="status-radio">
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
  Search, Refresh, Plus, Edit, Delete, Menu, Operation,
  EditPen, Key, Link, Fold, InfoFilled, Select, CircleClose, Close, Check
} from '@element-plus/icons-vue'
import {
  getPermissionList,
  addPermission,
  updatePermission,
  updatePermissionStatus,
  deletePermission,
  getPermissionSelectTree
} from '@/api/permission'

// 搜索表单
const searchForm = reactive({
  name: '',
  type: null,
  status: null
})

// 数据列表
const permissionList = ref([])
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增权限')
const formRef = ref(null)
const isAddChild = ref(false)
const parentName = ref('')
const form = reactive({
  id: null,
  name: '',
  code: '',
  type: 1,
  path: '',
  parentId: 0,
  status: true,
  sort: 0
})

// 父级权限级联选择器
const parentIdArray = ref([])
const parentOptions = ref([])
const parentLoading = ref(false)

// 级联选择器配置（使用静态数据）
const cascaderProps = {
  value: 'id',
  label: 'name',
  children: 'childrenPermission',
  checkStrictly: true,
  emitPath: true
}

// 加载父级权限树（用于级联选择器）
const loadParentOptions = async () => {
  try {
    const tree = await getPermissionSelectTree()
    parentOptions.value = tree || []
  } catch (error) {
    console.error('加载父级权限树失败：', error)
    ElMessage.error('加载父级权限失败')
    parentOptions.value = []
  }
}

// 从树状数据中查找节点路径（递归查找）
const findNodePath = (tree, targetId, currentPath = []) => {
  if (!tree || tree.length === 0) return null
  
  for (const node of tree) {
    // 找到目标节点，返回当前路径
    if (node.id === targetId) {
      return [...currentPath, node.id]
    }
    
    // 如果有子节点，递归查找
    if (node.childrenPermission && node.childrenPermission.length > 0) {
      const found = findNodePath(
        node.childrenPermission, 
        targetId, 
        [...currentPath, node.id]
      )
      if (found) return found
    }
  }
  
  return null
}

// 设置父级路径（用于编辑时回显）
const setParentPath = (parentId) => {
  if (!parentId || parentId === 0) {
    parentIdArray.value = []
    return
  }
  
  // 从已加载的树状数据中查找路径
  const path = findNodePath(parentOptions.value, parentId)
  if (path) {
    parentIdArray.value = path
  } else {
    parentIdArray.value = []
    console.warn(`未找到 id=${parentId} 的路径，可能是该节点已被禁用`)
  }
}

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入权限标识', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择权限类型', trigger: 'change' }
  ],
  path: [
    { max: 200, message: '路径最多 200 个字符', trigger: 'blur' }
  ],
  parentId: [
    { required: true, message: '请输入父级ID', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ]
}

// 加载顶级权限列表
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      parentId: 0 // 只加载顶级菜单
    }
    
    // 添加搜索条件
    if (searchForm.name) {
      params.name = searchForm.name
    }
    if (searchForm.type !== null && searchForm.type !== '') {
      params.type = searchForm.type
    }
    if (searchForm.status !== null && searchForm.status !== '') {
      params.status = searchForm.status
    }
    
    const res = await getPermissionList(params)
    
    if (res && Array.isArray(res)) {
      // 设置 hasChildren 属性，只有菜单类型（type=1）才可能有子项
      // 按钮/接口类型（type=2）不会有子项
      permissionList.value = res.map(item => ({
        ...item,
        hasChildren: item.type === 1 // 菜单可能有子级，按钮不会有
      }))
    } else {
      permissionList.value = []
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 懒加载子节点
const loadChildren = async (row, treeNode, resolve) => {
  try {
    const params = {
      parentId: row.id
    }
    
    const res = await getPermissionList(params)
    
    if (res && Array.isArray(res)) {
      // 设置子节点的 hasChildren 属性
      // 只有菜单类型（type=1）才显示展开图标
      const children = res.map(item => ({
        ...item,
        hasChildren: item.type === 1 // 菜单可能有子级，按钮不会有
      }))
      resolve(children)
    } else {
      resolve([])
    }
  } catch (error) {
    console.error(error)
    resolve([])
  }
}

// 搜索
const handleSearch = () => {
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.type = null
  searchForm.status = null
  loadData()
}

// 级联选择器值改变
const handleParentChange = (value) => {
  if (value && value.length > 0) {
    // 取数组的最后一个值作为 parentId
    form.parentId = value[value.length - 1]
  } else {
    // 清空则为顶级
    form.parentId = 0
  }
}

// 新增
const handleAdd = async () => {
  dialogTitle.value = '新增权限'
  dialogVisible.value = true
  isAddChild.value = false
  parentName.value = ''
  resetForm()
  // 加载父级权限树
  await loadParentOptions()
}

// 新增子权限
const handleAddChild = async (row) => {
  dialogTitle.value = '新增子权限'
  dialogVisible.value = true
  isAddChild.value = true
  parentName.value = row.name
  resetForm()
  form.parentId = row.id
  // 加载父级权限树
  await loadParentOptions()
  // 设置父级路径（用于回显）
  setParentPath(row.id)
}

// 编辑
const handleEdit = async (row) => {
  dialogTitle.value = '编辑权限'
  dialogVisible.value = true
  isAddChild.value = false
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.type = row.type
  form.path = row.path || ''
  form.parentId = row.parentId
  form.status = row.status
  form.sort = row.sort || 0
  
  // 加载父级权限树
  await loadParentOptions()
  // 设置父级路径用于级联选择器回显
  setParentPath(row.parentId)
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.name = ''
  form.code = ''
  form.type = 1
  form.path = ''
  form.parentId = 0
  form.status = true
  form.sort = 0
  parentIdArray.value = []
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
        code: form.code,
        type: form.type,
        path: form.path,
        parentId: form.parentId,
        status: form.status,
        sort: form.sort
      }
      
      if (form.id) {
        // 编辑
        await updatePermission(submitData)
        ElMessage.success('更新成功')
      } else {
        // 新增
        delete submitData.id
        await addPermission(submitData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (error) {
      console.error(error)
    }
  })
}

// 状态切换
const handleStatusChange = async (row, newStatus) => {
  row.statusLoading = true
  try {
    await updatePermissionStatus(row.id, newStatus)
    row.status = newStatus
    ElMessage.success(`已${newStatus ? '启用' : '禁用'}`)
  } catch (error) {
    console.error(error)
    loadData()
  } finally {
    row.statusLoading = false
  }
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除权限"${row.name}"吗？删除后其子权限也会被删除！`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deletePermission(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      console.error(error)
    }
  }).catch(() => {
    // 取消删除
  })
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
.permission-container {
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

/* 成功按钮 */
.action-buttons .el-button--success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border: none;
}

.action-buttons .el-button--success:hover {
  background: linear-gradient(135deg, #38ef7d 0%, #11998e 100%);
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

/* 标签样式 */
:deep(.el-tag) {
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 12px;
}

:deep(.el-tag .el-icon) {
  margin-right: 4px;
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

.permission-form {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

:deep(.permission-form .el-form-item__label) {
  font-weight: 600;
  color: #303133;
}

:deep(.permission-form .el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

:deep(.permission-form .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

:deep(.permission-form .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

/* 表单提示 */
.form-tip {
  margin-top: 8px;
  padding: 8px 12px;
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
  color: #1976d2;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 状态单选组 */
.status-radio {
  width: 100%;
}

:deep(.status-radio .el-radio) {
  margin-right: 15px;
  padding: 12px 20px;
  transition: all 0.3s;
}

:deep(.status-radio .el-radio.is-bordered.is-checked) {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(230, 57, 70, 0.1) 0%, rgba(230, 57, 70, 0.05) 100%);
}

:deep(.status-radio .el-radio__label) {
  display: flex;
  align-items: center;
  gap: 8px;
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

