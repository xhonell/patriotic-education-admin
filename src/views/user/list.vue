<template>
  <div class="user-list-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">用户列表</h1>
      <p class="page-subtitle">管理平台所有用户信息</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="toolbar card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input 
            v-model="searchForm.username" 
            placeholder="请输入用户名" 
            clearable 
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input 
            v-model="searchForm.email" 
            placeholder="请输入邮箱" 
            clearable 
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select 
            v-model="searchForm.role" 
            placeholder="选择角色" 
            clearable
            style="width: 150px"
          >
            <el-option label="普通用户" :value="1" />
            <el-option label="教师" :value="2" />
            <el-option label="系统管理员" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 用户表格 -->
    <div class="card">
      <el-table 
        :data="userList" 
        stripe 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="用户ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatarUrl || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="role" label="角色" width="110">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)" size="small">
              {{ getRoleName(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
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
              <el-tooltip content="编辑用户" placement="top">
                <el-button 
                  type="warning" 
                  :icon="Edit" 
                  circle 
                  size="small"
                  @click="handleEdit(row)"
                />
              </el-tooltip>
              <el-tooltip content="删除用户" placement="top">
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
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { getUserList, updateUserStatus, deleteUser } from '@/api/user'
import { getRoleName, formatTime } from '@/types/user'

export default {
  name: 'UserList',
  setup() {
    const loading = ref(false)
    
    const searchForm = reactive({
      username: '',
      email: '',
      role: null  // 使用 null 而不是空字符串，确保数字类型匹配
    })

    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })

    const userList = ref([])

    // 获取用户列表
    const loadUserList = async () => {
      loading.value = true
      try {
        const params = {
          page: pagination.page,
          pageSize: pagination.pageSize,
          ...searchForm
        }
        
        const data = await getUserList(params)
        
        // 后端返回 PageHelper 分页结构
        if (data && data.list) {
          userList.value = data.list
          pagination.total = data.total
          console.log('用户列表加载成功：', {
            当前页: data.pageNum,
            每页数量: data.pageSize,
            总记录数: data.total,
            总页数: data.pages,
            数据条数: data.list.length
          })
        } else {
          userList.value = []
          pagination.total = 0
        }
      } catch (error) {
        console.error('获取用户列表失败：', error)
        userList.value = []
        pagination.total = 0
      } finally {
        loading.value = false
      }
    }

    // 搜索
    const handleSearch = () => {
      pagination.page = 1
      loadUserList()
    }

    // 重置
    const handleReset = () => {
      searchForm.username = ''
      searchForm.email = ''
      searchForm.role = null  // 重置为 null
      pagination.page = 1
      loadUserList()
    }

    // 状态切换
    const handleStatusChange = async (row) => {
      try {
        await updateUserStatus({
          id: row.id,
          status: row.status
        })
        ElMessage.success(`用户 ${row.username} 状态已${row.status ? '启用' : '禁用'}`)
      } catch (error) {
        // 恢复原状态
        row.status = !row.status
        console.error('更新状态失败：', error)
        ElMessage.error('更新状态失败')
      }
    }

    // 查看用户
    const handleView = (row) => {
      ElMessage.info(`查看用户：${row.username}`)
    }

    // 编辑用户
    const handleEdit = (row) => {
      ElMessage.info(`编辑用户：${row.username}`)
    }

    // 删除用户
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除用户 ${row.username} 吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await deleteUser(row.id)
          ElMessage.success('删除成功')
          loadUserList()
        } catch (error) {
          console.error('删除失败：', error)
          ElMessage.error('删除失败')
        }
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    // 分页大小改变
    const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.page = 1
      loadUserList()
    }

    // 页码改变
    const handleCurrentChange = (page) => {
      pagination.page = page
      loadUserList()
    }

    // 获取角色标签类型
    const getRoleType = (role) => {
      const types = {
        1: 'info',     // 普通用户
        2: 'warning',  // 教师
        3: 'danger'    // 系统管理员
      }
      return types[role] || 'info'
    }

    // 页面加载时获取数据
    onMounted(() => {
      loadUserList()
    })

    return {
      loading,
      searchForm,
      pagination,
      userList,
      getRoleName,
      formatTime,
      getRoleType,
      loadUserList,
      handleSearch,
      handleReset,
      handleStatusChange,
      handleView,
      handleEdit,
      handleDelete,
      handleSizeChange,
      handleCurrentChange,
      // 图标
      View,
      Edit,
      Delete,
      Search,
      Refresh
    }
  }
}
</script>

<style scoped>
.user-list-container {
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

.search-form .el-button:not(.el-button--primary) {
  border: 2px solid var(--border-color);
}

.search-form .el-button:not(.el-button--primary):hover {
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

/* 头像样式优化 */
:deep(.el-avatar) {
  border: 2px solid var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.el-avatar:hover) {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(211, 47, 47, 0.3);
}

/* 状态开关样式 */
:deep(.el-switch) {
  --el-switch-on-color: var(--primary-color);
}

/* 角色标签样式 */
:deep(.el-tag) {
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 12px;
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
</style>

