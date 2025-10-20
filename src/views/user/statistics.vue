<template>
  <div class="user-statistics-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">用户统计</h1>
      <p class="page-subtitle">分析用户行为和趋势</p>
    </div>

    <!-- 统计图表 -->
    <el-row :gutter="24">
      <el-col :xs="24" :lg="12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">年龄分布</h3>
          </div>
          <div ref="ageChartRef" class="chart-container"></div>
        </div>
      </el-col>

      <el-col :xs="24" :lg="12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">地区分布</h3>
          </div>
          <div ref="regionChartRef" class="chart-container"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="24">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">用户增长趋势</h3>
          </div>
          <div ref="growthChartRef" class="chart-container" style="height: 400px;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'UserStatistics',
  setup() {
    const ageChartRef = ref(null)
    const regionChartRef = ref(null)
    const growthChartRef = ref(null)
    let ageChart = null
    let regionChart = null
    let growthChart = null

    const initAgeChart = () => {
      if (!ageChartRef.value) return
      ageChart = echarts.init(ageChartRef.value)
      
      const option = {
        tooltip: {
          trigger: 'item'
        },
        color: ['#e63946', '#f9ca24', '#4facfe', '#43e97b'],
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: [
              { value: 3245, name: '10-12岁' },
              { value: 4567, name: '13-15岁' },
              { value: 3890, name: '16-18岁' },
              { value: 756, name: '其他' }
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
      
      ageChart.setOption(option)
    }

    const initRegionChart = () => {
      if (!regionChartRef.value) return
      regionChart = echarts.init(regionChartRef.value)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '武汉']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [2340, 2145, 1890, 1756, 1234, 1123, 989, 876],
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#e63946' },
                { offset: 1, color: '#f9ca24' }
              ])
            },
            barWidth: '40%'
          }
        ]
      }
      
      regionChart.setOption(option)
    }

    const initGrowthChart = () => {
      if (!growthChartRef.value) return
      growthChart = echarts.init(growthChartRef.value)
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增用户', '累计用户']
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: [
          {
            type: 'value',
            name: '新增用户'
          },
          {
            type: 'value',
            name: '累计用户'
          }
        ],
        series: [
          {
            name: '新增用户',
            type: 'bar',
            data: [320, 432, 501, 634, 790, 890, 1020, 1100, 1234, 1320, 1456, 1590],
            itemStyle: {
              color: '#e63946'
            }
          },
          {
            name: '累计用户',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            data: [320, 752, 1253, 1887, 2677, 3567, 4587, 5687, 6921, 8241, 9697, 11287],
            itemStyle: {
              color: '#f9ca24'
            },
            lineStyle: {
              width: 3
            }
          }
        ]
      }
      
      growthChart.setOption(option)
    }

    const handleResize = () => {
      ageChart?.resize()
      regionChart?.resize()
      growthChart?.resize()
    }

    onMounted(() => {
      setTimeout(() => {
        initAgeChart()
        initRegionChart()
        initGrowthChart()
        window.addEventListener('resize', handleResize)
      }, 100)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      ageChart?.dispose()
      regionChart?.dispose()
      growthChart?.dispose()
    })

    return {
      ageChartRef,
      regionChartRef,
      growthChartRef
    }
  }
}
</script>

<style scoped>
.user-statistics-container {
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

