<template>
  <div class="dashboard-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">数据统计</h1>
      <p class="page-subtitle">实时监控平台运营数据</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="24" class="stats-row">
      <el-col :xs="24" :sm="12" :lg="6" v-for="(item, index) in statsCards" :key="index">
        <div class="stat-card" :class="'stat-card-' + index">
          <div class="stat-icon" :style="{ background: item.gradient }">
            <el-icon :size="32"><component :is="item.icon" /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
            <div class="stat-trend" :class="item.trend > 0 ? 'up' : 'down'">
              <el-icon v-if="item.trend > 0"><CaretTop /></el-icon>
              <el-icon v-else><CaretBottom /></el-icon>
              <span>{{ Math.abs(item.trend) }}%</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="24" class="charts-row">
      <el-col :xs="24" :lg="16">
        <div class="card chart-card">
          <div class="card-header">
            <h3 class="card-title">用户访问趋势</h3>
            <el-radio-group v-model="timeRange" size="small">
              <el-radio-button label="week">近7天</el-radio-button>
              <el-radio-button label="month">近30天</el-radio-button>
              <el-radio-button label="year">近1年</el-radio-button>
            </el-radio-group>
          </div>
          <div ref="visitChartRef" class="chart-container"></div>
        </div>
      </el-col>

      <el-col :xs="24" :lg="8">
        <div class="card chart-card">
          <div class="card-header">
            <h3 class="card-title">内容分类占比</h3>
          </div>
          <div ref="categoryChartRef" class="chart-container" style="height: 300px;"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-row :gutter="24">
      <el-col :xs="24" :lg="12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">热门内容排行</h3>
            <el-button type="primary" text>查看更多</el-button>
          </div>
          <el-table :data="hotContent" stripe style="width: 100%">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="title" label="内容标题" />
            <el-table-column prop="views" label="浏览量" width="100" />
            <el-table-column label="趋势" width="80">
              <template #default="{ row }">
                <el-tag :type="row.trend > 0 ? 'success' : 'danger'" size="small">
                  {{ row.trend > 0 ? '↑' : '↓' }} {{ Math.abs(row.trend) }}%
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

      <el-col :xs="24" :lg="12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">最新用户</h3>
            <el-button type="primary" text>查看更多</el-button>
          </div>
          <el-table :data="newUsers" stripe style="width: 100%">
            <el-table-column prop="name" label="用户名" />
            <el-table-column prop="age" label="年龄" width="80" />
            <el-table-column prop="region" label="地区" width="100" />
            <el-table-column prop="time" label="注册时间" />
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'Dashboard',
  setup() {
    const visitChartRef = ref(null)
    const categoryChartRef = ref(null)
    const timeRange = ref('week')
    let visitChart = null
    let categoryChart = null

    const statsCards = reactive([
      {
        label: '总用户数',
        value: '12,458',
        trend: 15.6,
        icon: 'User',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        label: '今日访问',
        value: '3,267',
        trend: 8.2,
        icon: 'View',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      {
        label: '内容总数',
        value: '8,942',
        trend: 12.4,
        icon: 'Document',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      },
      {
        label: '推荐准确率',
        value: '92.5%',
        trend: 3.1,
        icon: 'TrendCharts',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
      }
    ])

    const hotContent = ref([
      { title: '新中国成立的伟大历程', views: 15234, trend: 12 },
      { title: '中华民族复兴之路', views: 13890, trend: 8 },
      { title: '红色革命故事集', views: 12456, trend: 15 },
      { title: '改革开放四十年', views: 11234, trend: -3 },
      { title: '抗日战争英雄事迹', views: 10567, trend: 6 }
    ])

    const newUsers = ref([
      { name: '张小明', age: 14, region: '北京', time: '2小时前' },
      { name: '李红', age: 15, region: '上海', time: '3小时前' },
      { name: '王刚', age: 13, region: '广州', time: '5小时前' },
      { name: '刘洋', age: 16, region: '深圳', time: '6小时前' },
      { name: '陈晨', age: 14, region: '杭州', time: '8小时前' }
    ])

    const initVisitChart = () => {
      if (!visitChartRef.value) return

      visitChart = echarts.init(visitChartRef.value)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#e63946'
            }
          }
        },
        legend: {
          data: ['访问量', '独立访客']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '访问量',
            type: 'line',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(230, 57, 70, 0.3)' },
                  { offset: 1, color: 'rgba(230, 57, 70, 0.05)' }
                ]
              }
            },
            lineStyle: {
              color: '#e63946',
              width: 3
            },
            itemStyle: {
              color: '#e63946'
            },
            data: [1200, 1500, 1800, 2200, 2800, 3100, 3267]
          },
          {
            name: '独立访客',
            type: 'line',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(249, 202, 36, 0.3)' },
                  { offset: 1, color: 'rgba(249, 202, 36, 0.05)' }
                ]
              }
            },
            lineStyle: {
              color: '#f9ca24',
              width: 3
            },
            itemStyle: {
              color: '#f9ca24'
            },
            data: [800, 1000, 1200, 1500, 1800, 2000, 2156]
          }
        ]
      }

      visitChart.setOption(option)
    }

    const initCategoryChart = () => {
      if (!categoryChartRef.value) return

      categoryChart = echarts.init(categoryChartRef.value)
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '10%',
          top: 'center'
        },
        color: ['#e63946', '#f9ca24', '#4facfe', '#43e97b', '#f093fb'],
        series: [
          {
            name: '内容分类',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 3245, name: '历史故事' },
              { value: 2567, name: '英雄事迹' },
              { value: 1890, name: '文化传承' },
              { value: 1234, name: '科技成就' },
              { value: 1006, name: '其他' }
            ]
          }
        ]
      }

      categoryChart.setOption(option)
    }

    const handleResize = () => {
      visitChart?.resize()
      categoryChart?.resize()
    }

    onMounted(() => {
      setTimeout(() => {
        initVisitChart()
        initCategoryChart()
        window.addEventListener('resize', handleResize)
      }, 100)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      visitChart?.dispose()
      categoryChart?.dispose()
    })

    return {
      visitChartRef,
      categoryChartRef,
      timeRange,
      statsCards,
      hotContent,
      newUsers
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 0;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  margin-bottom: 8px;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

/* 统计卡片 */
.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 12px rgba(230, 57, 70, 0.08);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  height: 120px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(230, 57, 70, 0.15);
}

.stat-icon {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}

.stat-trend.up {
  color: #43e97b;
}

.stat-trend.down {
  color: #f5576c;
}

/* 图表区域 */
.charts-row {
  margin-bottom: 24px;
}

.chart-card {
  height: 100%;
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

.chart-container {
  width: 100%;
  height: 350px;
}

/* 响应式 */
@media (max-width: 768px) {
  .stat-card {
    height: auto;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
  }

  .stat-value {
    font-size: 24px;
  }

  .chart-container {
    height: 280px;
  }
}
</style>

