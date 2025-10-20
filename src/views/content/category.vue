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

      <el-table :data="categoryList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图标" width="80">
          <template #default="{ row }">
            <div :style="{ color: row.color, fontSize: '24px' }">
              {{ row.icon }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="count" label="内容数量" width="100" sortable />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="warning" text @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" text @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'ContentCategory',
  setup() {
    const categoryList = ref([
      {
        id: 1,
        icon: '📜',
        name: '历史故事',
        description: '讲述中国历史发展的重要事件和故事',
        count: 3245,
        sort: 1,
        status: 1,
        color: '#e63946'
      },
      {
        id: 2,
        icon: '🦸',
        name: '英雄事迹',
        description: '记录革命先烈和时代英雄的感人事迹',
        count: 2567,
        sort: 2,
        status: 1,
        color: '#f9ca24'
      },
      {
        id: 3,
        icon: '🏮',
        name: '文化传承',
        description: '传承和发扬中华优秀传统文化',
        count: 1890,
        sort: 3,
        status: 1,
        color: '#4facfe'
      },
      {
        id: 4,
        icon: '🚀',
        name: '科技成就',
        description: '展示新中国科技发展的辉煌成就',
        count: 1234,
        sort: 4,
        status: 1,
        color: '#43e97b'
      },
      {
        id: 5,
        icon: '🎖️',
        name: '爱国精神',
        description: '培养青少年的爱国情怀和民族自豪感',
        count: 1006,
        sort: 5,
        status: 1,
        color: '#f093fb'
      }
    ])

    const handleAdd = () => {
      ElMessage.info('新增分类功能开发中')
    }

    const handleEdit = (row) => {
      ElMessage.info(`编辑分类：${row.name}`)
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除分类 ${row.name} 吗？删除后该分类下的所有内容将被移至其他分类。`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        ElMessage.success('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    return {
      categoryList,
      handleAdd,
      handleEdit,
      handleDelete
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
  margin-bottom: 20px;
}
</style>

