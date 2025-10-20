<template>
  <div class="recommend-analysis-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">推荐分析</h1>
      <p class="page-subtitle">分析推荐系统的效果和用户行为</p>
    </div>

    <el-row :gutter="24">
      <el-col :span="24">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">推荐效果趋势</h3>
            <el-radio-group v-model="timeRange" size="small">
              <el-radio-button label="week">近7天</el-radio-button>
              <el-radio-button label="month">近30天</el-radio-button>
              <el-radio-button label="year">近1年</el-radio-button>
            </el-radio-group>
          </div>
          <div ref="trendChartRef" class="chart-container" style="height: 400px;"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :xs="24" :lg="12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">用户反馈分布</h3>
          </div>
          <div ref="feedbackChartRef" class="chart-container"></div>
        </div>
      </el-col>

      <el-col :xs="24" :lg="12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">推荐内容类型分析</h3>
          </div>
          <div ref="categoryChartRef" class="chart-container"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'RecommendAnalysis',
  setup() {
    const trendChartRef = ref(null)
    const feedbackChartRef = ref(null)
    const categoryChartRef = ref(null)
    const timeRange = ref('week')
    let trendChart = null
    let feedbackChart = null
    let categoryChart = null

    const initTrendChart = () => {
      if (!trendChartRef.value) return
      trendChart = echarts.init(trendChartRef.value)
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['曝光量', '点击量', '完成率']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '曝光量',
            type: 'line',
            smooth: true,
            data: [8200, 9100, 10500, 12300, 14800, 16200, 17500],
            lineStyle: { color: '#4facfe', width: 3 },
            itemStyle: { color: '#4facfe' }
          },
          {
            name: '点击量',
            type: 'line',
            smooth: true,
            data: [1020, 1150, 1340, 1580, 1920, 2090, 2280],
            lineStyle: { color: '#e63946', width: 3 },
            itemStyle: { color: '#e63946' }
          },
          {
            name: '完成率',
            type: 'line',
            smooth: true,
            data: [680, 780, 910, 1080, 1320, 1450, 1590],
            lineStyle: { color: '#f9ca24', width: 3 },
            itemStyle: { color: '#f9ca24' }
          }
        ]
      }
      
      trendChart.setOption(option)
    }

    const initFeedbackChart = () => {
      if (!feedbackChartRef.value) return
      feedbackChart = echarts.init(feedbackChartRef.value)
      
      const option = {
        tooltip: {
          trigger: 'item'
        },
        color: ['#43e97b', '#4facfe', '#f9ca24', '#e63946', '#f093fb'],
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: [
              { value: 4567, name: '非常满意' },
              { value: 3245, name: '满意' },
              { value: 1890, name: '一般' },
              { value: 456, name: '不满意' },
              { value: 123, name: '非常不满意' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      
      feedbackChart.setOption(option)
    }

    const initCategoryChart = () => {
      if (!categoryChartRef.value) return
      categoryChart = echarts.init(categoryChartRef.value)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['其他', '科技成就', '文化传承', '英雄事迹', '历史故事']
        },
        series: [
          {
            type: 'bar',
            data: [1006, 1234, 1890, 2567, 3245],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#e63946' },
                { offset: 1, color: '#f9ca24' }
              ])
            },
            barWidth: '50%'
          }
        ]
      }
      
      categoryChart.setOption(option)
    }

    const handleResize = () => {
      trendChart?.resize()
      feedbackChart?.resize()
      categoryChart?.resize()
    }

    onMounted(() => {
      setTimeout(() => {
        initTrendChart()
        initFeedbackChart()
        initCategoryChart()
        window.addEventListener('resize', handleResize)
      }, 100)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      trendChart?.dispose()
      feedbackChart?.dispose()
      categoryChart?.dispose()
    })

    return {
      trendChartRef,
      feedbackChartRef,
      categoryChartRef,
      timeRange
    }
  }
}
</script>

<style scoped>
.recommend-analysis-container {
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

.chart-container {
  width: 100%;
  height: 350px;
}
</style>

