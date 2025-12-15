<template>
  <div class="role-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title gradient-text">角色管理</h1>
      <p class="page-subtitle">管理系统角色及权限分配</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="toolbar card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="角色名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入角色名称"
            clearable
            @keyup.enter="handleSearch"
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
            新增角色
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 角色表格 -->
    <div class="card">

      <el-table
        :data="roleList"
        v-loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="80" />
        
        <el-table-column prop="name" label="角色名称" min-width="120" show-overflow-tooltip />
        
        <el-table-column prop="description" label="角色描述" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="description-text">{{ row.description || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              @change="handleStatusChange(row, $event)"
              :loading="row.statusLoading"
            />
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column prop="updateTime" label="更新时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.updateTime) }}
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
          :current-page="pagination.pageNum"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="角色详情"
      width="700px"
      class="view-dialog"
    >
      <div class="view-content" v-loading="viewLoading">
        <!-- 角色基本信息 -->
        <div class="info-section">
          <div class="section-title">
            <el-icon><User /></el-icon>
            <span>基本信息</span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">角色名称：</span>
              <span class="value">{{ viewData.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态：</span>
              <el-tag :type="viewData.status ? 'success' : 'info'" size="small">
                {{ viewData.status ? '已启用' : '已禁用' }}
              </el-tag>
            </div>
            <div class="info-item full-width">
              <span class="label">角色描述：</span>
              <span class="value">{{ viewData.description || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建时间：</span>
              <span class="value">{{ formatDateTime(viewData.createTime) }}</span>
            </div>
            <div class="info-item">
              <span class="label">更新时间：</span>
              <span class="value">{{ formatDateTime(viewData.updateTime) }}</span>
            </div>
          </div>
        </div>

        <!-- 权限信息 -->
        <div class="permission-section">
          <div class="section-title">
            <el-icon><Lock /></el-icon>
            <span>已分配权限</span>
          </div>
          <div class="permission-tree-view" v-if="viewData.permissions && viewData.permissions.length > 0">
            <el-tree
              :data="viewData.permissions"
              :props="viewTreeProps"
              node-key="id"
              default-expand-all
              class="view-tree"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <el-icon v-if="data.type === 1" class="node-icon menu-icon">
                    <Menu />
                  </el-icon>
                  <el-icon v-else class="node-icon button-icon">
                    <Operation />
                  </el-icon>
                  <span class="node-label">{{ node.label }}</span>
                  <el-tag 
                    :type="data.type === 1 ? 'primary' : 'warning'" 
                    size="small" 
                    class="node-type-tag"
                  >
                    {{ data.type === 1 ? '菜单' : '按钮' }}
                  </el-tag>
                  <el-tag 
                    v-if="data.code"
                    type="info" 
                    size="small" 
                    class="node-code-tag"
                  >
                    {{ data.code }}
                  </el-tag>
                </span>
              </template>
            </el-tree>
          </div>
          <el-empty 
            v-else 
            description="暂未分配任何权限" 
            :image-size="80"
          />
        </div>
      </div>

      <template #footer>
        <el-button type="primary" @click="viewDialogVisible = false" size="large">
          <el-icon><Close /></el-icon>
          关闭
        </el-button>
      </template>
    </el-dialog>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="750px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入角色名称"
            maxlength="50"
            show-word-limit
            size="large"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入角色描述"
            maxlength="200"
            show-word-limit
            :rows="4"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status" size="large">
            <el-radio :label="true" border>
              <el-icon><Select /></el-icon>
              启用
            </el-radio>
            <el-radio :label="false" border>
              <el-icon><Close /></el-icon>
              禁用
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="权限分配" prop="permissionIds">
          <div class="permission-tree-container" v-loading="permissionLoading">
            <el-tree
              ref="permissionTreeRef"
              :data="permissionTree"
              :props="treeProps"
              node-key="id"
              show-checkbox
              :default-expand-all="!form.id"
              :check-strictly="false"
            >
              <template #default="{ node, data }">
                <span class="tree-node">
                  <el-icon v-if="data.type === 1" class="node-icon menu-icon">
                    <Menu />
                  </el-icon>
                  <el-icon v-else class="node-icon button-icon">
                    <Operation />
                  </el-icon>
                  <span class="node-label">{{ node.label }}</span>
                  <el-tag 
                    :type="data.type === 1 ? 'primary' : 'warning'" 
                    size="small" 
                    class="node-tag"
                  >
                    {{ data.type === 1 ? '菜单' : '按钮' }}
                  </el-tag>
                </span>
              </template>
            </el-tree>
            <div v-if="permissionTree.length === 0 && !permissionLoading" class="empty-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>暂无可分配的权限</span>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false" size="large">
          取消
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading" size="large">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  User,
  Select,
  Close,
  Menu,
  Operation,
  InfoFilled,
  View,
  Lock
} from '@element-plus/icons-vue'
import {
  getRoleList,
  addRole,
  updateRole,
  updateRoleStatus,
  deleteRole,
  getRoleDetail
} from '@/api/role'
import { getPermissionSelectTree } from '@/api/permission'

// 搜索表单
const searchForm = reactive({
  name: '',
  status: null
})

// 表格数据
const roleList = ref([])
const loading = ref(false)

// 分页
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)

// 查看详情对话框
const viewDialogVisible = ref(false)
const viewLoading = ref(false)
const viewData = reactive({
  id: null,
  name: '',
  description: '',
  status: true,
  createTime: '',
  updateTime: '',
  permissions: []
})

// 表单
const formRef = ref()
const form = reactive({
  id: null,
  name: '',
  description: '',
  status: true,
  permissionIds: []
})

// 权限树
const permissionTree = ref([])
const permissionTreeRef = ref()
const permissionLoading = ref(false)

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 50, message: '角色名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '角色描述不能超过 200 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 树形控件配置
const treeProps = {
  label: 'name',
  children: 'childrenPermission'
}

// 查看详情树形控件配置
const viewTreeProps = {
  label: 'name',
  children: 'childrenPermission'
}

// 格式化时间
const formatDateTime = (datetime) => {
  if (!datetime) return '-'
  return datetime.replace('T', ' ')
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    
    const res = await getRoleList(params)
    
    if (res && res.list) {
      roleList.value = res.list.map(item => ({
        ...item,
        statusLoading: false
      }))
      pagination.total = res.total
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.pageNum = 1
  loadData()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.status = null
  pagination.pageNum = 1
  loadData()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageNum = 1
  loadData()
}

// 页码改变
const handlePageChange = (page) => {
  pagination.pageNum = page
  loadData()
}

// 加载权限树
const loadPermissionTree = async () => {
  permissionLoading.value = true
  try {
    const res = await getPermissionSelectTree()
    permissionTree.value = res || []
  } catch (error) {
    console.error(error)
    permissionTree.value = []
  } finally {
    permissionLoading.value = false
  }
}

// 新增
const handleAdd = async () => {
  dialogTitle.value = '新增角色'
  resetForm()
  dialogVisible.value = true
  await loadPermissionTree()
}

// 查看
const handleView = async (row) => {
  viewDialogVisible.value = true
  viewLoading.value = true
  
  try {
    const res = await getRoleDetail(row.id)
    
    if (res) {
      Object.assign(viewData, {
        id: res.id,
        name: res.name,
        description: res.description,
        status: res.status,
        createTime: res.createTime,
        updateTime: res.updateTime,
        permissions: res.permissions || []
      })
      
      console.log('角色详情加载成功：', viewData)
    }
  } catch (error) {
    console.error('获取角色详情失败：', error)
    viewDialogVisible.value = false
  } finally {
    viewLoading.value = false
  }
}

// 编辑
const handleEdit = async (row) => {
  dialogTitle.value = '编辑角色'
  
  // 先填充基本信息
  Object.assign(form, {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    permissionIds: []
  })
  
  dialogVisible.value = true
  
  // 加载权限树
  await loadPermissionTree()
  
  // 获取角色详情以获取完整的权限ID列表
  try {
    const res = await getRoleDetail(row.id)
    if (res && res.permissions) {
      // 从权限树中提取所有权限ID（包括父节点）
      const extractPermissionIds = (permissions) => {
        const ids = []
        const traverse = (items) => {
          items.forEach(item => {
            ids.push(item.id)
            if (item.childrenPermission && item.childrenPermission.length > 0) {
              traverse(item.childrenPermission)
            }
          })
        }
        traverse(permissions)
        return ids
      }
      
      form.permissionIds = extractPermissionIds(res.permissions)
      
      console.log('编辑角色权限回显：', {
        roleId: row.id,
        roleName: row.name,
        permissionIds: form.permissionIds
      })
      
      // 设置已选中的权限
      if (permissionTreeRef.value && form.permissionIds.length > 0) {
        // 延迟设置，确保树已渲染
        setTimeout(() => {
          permissionTreeRef.value.setCheckedKeys(form.permissionIds)
        }, 150)
      }
    }
  } catch (error) {
    console.error('获取角色权限失败：', error)
    // 即使获取失败，仍然可以编辑基本信息
  }
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色"${row.name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteRole(row.id)
    ElMessage.success('删除成功')
    
    // 如果当前页只有一条数据且不是第一页，则返回上一页
    if (roleList.value.length === 1 && pagination.pageNum > 1) {
      pagination.pageNum--
    }
    
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

// 状态切换
const handleStatusChange = async (row, newStatus) => {
  row.statusLoading = true
  try {
    await updateRoleStatus(row.id, newStatus)
    row.status = newStatus
    ElMessage.success(`已${newStatus ? '启用' : '禁用'}`)
  } catch (error) {
    console.error(error)
    // 恢复原状态
    loadData()
  } finally {
    row.statusLoading = false
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    // 获取选中的权限ID（包括半选中的父节点）
    const checkedKeys = permissionTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
    form.permissionIds = [...checkedKeys, ...halfCheckedKeys]
    
    submitLoading.value = true
    
    const apiFunc = form.id ? updateRole : addRole
    await apiFunc(form)
    
    ElMessage.success(form.id ? '更新成功' : '新增成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    if (error !== false) {
      console.error(error)
    }
  } finally {
    submitLoading.value = false
  }
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.name = ''
  form.description = ''
  form.status = true
  form.permissionIds = []
  formRef.value?.clearValidate()
  
  // 清空树的选中状态
  if (permissionTreeRef.value) {
    permissionTreeRef.value.setCheckedKeys([])
  }
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
}

// 页面加载
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.role-container {
  padding: 0;
}

/* 页面头部 */
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

/* 工具栏 */
.toolbar {
  margin-bottom: 24px;
}

.search-form {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

/* 描述文本 */
.description-text {
  color: #606266;
  line-height: 1.5;
}

/* 分页样式 */
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

/* 单选按钮组样式 */
:deep(.el-radio.is-bordered) {
  padding: 12px 20px;
  border-radius: 6px;
  margin-right: 12px;
}

:deep(.el-radio.is-bordered.is-checked) {
  border-color: var(--primary-color);
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

/* 权限树样式 */
.permission-tree-container {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 12px;
  max-height: 400px;
  overflow-y: auto;
  background-color: #fafafa;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 4px 0;
}

.node-icon {
  font-size: 16px;
}

.menu-icon {
  color: #409eff;
}

.button-icon {
  color: #e6a23c;
}

.node-label {
  flex: 1;
  font-size: 14px;
  color: #303133;
}

.node-tag {
  margin-left: auto;
}

.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 0;
  color: #909399;
  font-size: 14px;
}

.empty-tip .el-icon {
  font-size: 18px;
}

/* 树形控件样式优化 */
:deep(.el-tree) {
  background-color: transparent;
}

:deep(.el-tree-node__content) {
  padding: 6px 0;
  border-radius: 4px;
}

:deep(.el-tree-node__content:hover) {
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

:deep(.el-checkbox) {
  display: flex;
  align-items: center;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

/* 对话框样式 */
:deep(.el-dialog) {
  max-width: 800px;
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

:deep(.el-dialog__body) {
  padding: 24px;
}

/* 查看详情对话框样式 */
.view-dialog {
  border-radius: 16px;
}

:deep(.view-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 24px;
  border-bottom: none;
}

:deep(.view-dialog .el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.view-dialog .el-dialog__close) {
  color: white;
  font-size: 20px;
}

:deep(.view-dialog .el-dialog__close:hover) {
  color: #ffd700;
}

:deep(.view-dialog .el-dialog__body) {
  padding: 0;
  background: #f5f7fa;
}

:deep(.view-dialog .el-dialog__footer) {
  padding: 16px 24px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

/* 查看内容 */
.view-content {
  padding: 24px;
}

/* 信息部分 */
.info-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;
}

.section-title .el-icon {
  font-size: 18px;
  color: var(--primary-color);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item.full-width {
  grid-column: 1 / -1;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.info-item .label {
  font-weight: 600;
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}

.info-item .value {
  color: #303133;
  font-size: 14px;
  word-break: break-all;
}

/* 权限部分 */
.permission-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.permission-tree-view {
  max-height: 400px;
  overflow-y: auto;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

/* 树节点样式 */
.view-tree {
  background: transparent;
}

:deep(.view-tree .el-tree-node__content) {
  padding: 8px 0;
  border-radius: 6px;
  margin-bottom: 4px;
}

:deep(.view-tree .el-tree-node__content:hover) {
  background-color: rgba(102, 126, 234, 0.1);
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 4px 8px;
}

.node-icon {
  font-size: 16px;
}

.menu-icon {
  color: #409eff;
}

.button-icon {
  color: #e6a23c;
}

.node-label {
  flex: 1;
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.node-type-tag {
  margin-left: auto;
}

.node-code-tag {
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

/* 空状态 */
:deep(.el-empty) {
  padding: 40px 0;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .search-form .el-form-item {
    margin-bottom: 12px;
  }

  .permission-tree-container {
    max-height: 300px;
  }

  :deep(.el-dialog) {
    width: 95% !important;
    max-width: 95%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .permission-tree-view {
    max-height: 300px;
  }
}
</style>

