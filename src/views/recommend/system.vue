<template>
  <div class="recommend-system-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">推荐配置</h1>
      <p class="page-subtitle">配置个性化推荐系统参数</p>
    </div>

    <el-row :gutter="24">
      <el-col :xs="24" :lg="12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">推荐算法配置</h3>
          </div>
          
          <el-form :model="algorithmForm" label-width="140px">
            <el-form-item label="推荐算法">
              <el-select v-model="algorithmForm.algorithm" placeholder="选择推荐算法">
                <el-option label="协同过滤" value="cf" />
                <el-option label="内容推荐" value="content" />
                <el-option label="混合推荐" value="hybrid" />
                <el-option label="深度学习" value="dl" />
              </el-select>
            </el-form-item>

            <el-form-item label="推荐数量">
              <el-slider v-model="algorithmForm.count" :min="5" :max="50" show-input />
            </el-form-item>

            <el-form-item label="多样性权重">
              <el-slider v-model="algorithmForm.diversity" :min="0" :max="100" show-input />
            </el-form-item>

            <el-form-item label="新鲜度权重">
              <el-slider v-model="algorithmForm.freshness" :min="0" :max="100" show-input />
            </el-form-item>

            <el-form-item label="热度权重">
              <el-slider v-model="algorithmForm.popularity" :min="0" :max="100" show-input />
            </el-form-item>

            <el-form-item label="年龄适配">
              <el-switch v-model="algorithmForm.ageMatch" />
              <span style="margin-left: 10px; color: #636e72;">
                根据用户年龄推荐合适内容
              </span>
            </el-form-item>

            <el-form-item label="地域适配">
              <el-switch v-model="algorithmForm.regionMatch" />
              <span style="margin-left: 10px; color: #636e72;">
                推荐本地相关的历史文化内容
              </span>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSaveAlgorithm">
                <el-icon><Check /></el-icon>
                保存配置
              </el-button>
              <el-button @click="handleTestAlgorithm">
                <el-icon><Refresh /></el-icon>
                测试推荐
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>

      <el-col :xs="24" :lg="12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">推荐效果监控</h3>
          </div>
          
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-label">点击率 (CTR)</div>
              <div class="metric-value">12.5%</div>
              <div class="metric-trend up">
                <el-icon><CaretTop /></el-icon>
                <span>+2.3%</span>
              </div>
            </div>

            <div class="metric-item">
              <div class="metric-label">平均停留时长</div>
              <div class="metric-value">5.8分钟</div>
              <div class="metric-trend up">
                <el-icon><CaretTop /></el-icon>
                <span>+1.2分钟</span>
              </div>
            </div>

            <div class="metric-item">
              <div class="metric-label">推荐准确率</div>
              <div class="metric-value">92.5%</div>
              <div class="metric-trend up">
                <el-icon><CaretTop /></el-icon>
                <span>+3.1%</span>
              </div>
            </div>

            <div class="metric-item">
              <div class="metric-label">用户满意度</div>
              <div class="metric-value">4.7/5.0</div>
              <div class="metric-trend up">
                <el-icon><CaretTop /></el-icon>
                <span>+0.3</span>
              </div>
            </div>
          </div>

          <div ref="performanceChartRef" class="chart-container"></div>
        </div>
      </el-col>
    </el-row>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">推荐规则管理</h3>
        <el-button type="primary" @click="handleAddRule">
          <el-icon><Plus /></el-icon>
          添加规则
        </el-button>
      </div>

      <el-table :data="ruleList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="规则名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="priority" label="优先级" width="100" sortable />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="warning" text @click="handleEditRule(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" text @click="handleDeleteRule(row)">
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
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

export default {
  name: 'RecommendSystem',
  setup() {
    const performanceChartRef = ref(null)
    let performanceChart = null

    const algorithmForm = reactive({
      algorithm: 'hybrid',
      count: 20,
      diversity: 70,
      freshness: 60,
      popularity: 50,
      ageMatch: true,
      regionMatch: true
    })

    const ruleList = ref([
      {
        id: 1,
        name: '年龄匹配规则',
        description: '根据用户年龄推荐适合的内容',
        priority: 10,
        status: 1
      },
      {
        id: 2,
        name: '学习进度规则',
        description: '根据用户学习进度推荐下一步内容',
        priority: 9,
        status: 1
      },
      {
        id: 3,
        name: '兴趣偏好规则',
        description: '基于用户历史行为推荐相似内容',
        priority: 8,
        status: 1
      },
      {
        id: 4,
        name: '热门内容规则',
        description: '推荐当前热门和高质量内容',
        priority: 7,
        status: 1
      }
    ])

    const initPerformanceChart = () => {
      if (!performanceChartRef.value) return

      performanceChart = echarts.init(performanceChartRef.value)
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['点击率', '准确率']
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: '点击率',
            type: 'line',
            smooth: true,
            data: [8.5, 9.2, 10.1, 10.8, 11.5, 12.5],
            lineStyle: {
              color: '#e63946',
              width: 3
            },
            itemStyle: {
              color: '#e63946'
            }
          },
          {
            name: '准确率',
            type: 'line',
            smooth: true,
            data: [85.3, 87.1, 88.9, 90.2, 91.4, 92.5],
            lineStyle: {
              color: '#f9ca24',
              width: 3
            },
            itemStyle: {
              color: '#f9ca24'
            }
          }
        ]
      }

      performanceChart.setOption(option)
    }

    const handleSaveAlgorithm = () => {
      ElMessage.success('推荐算法配置已保存')
    }

    const handleTestAlgorithm = () => {
      ElMessage.info('正在测试推荐算法...')
      setTimeout(() => {
        ElMessage.success('推荐测试完成，效果良好')
      }, 2000)
    }

    const handleAddRule = () => {
      ElMessage.info('添加规则功能开发中')
    }

    const handleEditRule = (row) => {
      ElMessage.info(`编辑规则：${row.name}`)
    }

    const handleDeleteRule = (row) => {
      ElMessage.success(`删除规则：${row.name}`)
    }

    const handleResize = () => {
      performanceChart?.resize()
    }

    onMounted(() => {
      setTimeout(() => {
        initPerformanceChart()
        window.addEventListener('resize', handleResize)
      }, 100)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      performanceChart?.dispose()
    })

    return {
      performanceChartRef,
      algorithmForm,
      ruleList,
      handleSaveAlgorithm,
      handleTestAlgorithm,
      handleAddRule,
      handleEditRule,
      handleDeleteRule
    }
  }
}
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.metric-item {
  padding: 20px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid var(--border-light);
}

.metric-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}

.metric-trend.up {
  color: #43e97b;
}

.chart-container {
  width: 100%;
  height: 300px;
}
</style>

