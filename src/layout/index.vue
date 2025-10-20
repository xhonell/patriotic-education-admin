<template>
  <div class="layout-container">
    <!-- 凤凰背景装饰 - 增强版 -->
    <div class="phoenix-decoration phoenix-left-large"></div>
    <div class="phoenix-decoration phoenix-right-large"></div>
    <div class="phoenix-center"></div>
    
    <el-container class="main-container">
      <!-- 侧边栏 -->
      <el-aside width="240px" class="sidebar">
        <div class="logo-container">
          <div class="logo-icon">🇨🇳</div>
          <h2 class="logo-title gradient-text">爱国教育平台</h2>
          <div class="logo-subtitle">管理系统</div>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :router="true"
          unique-opened
        >
          <template v-for="route in menuRoutes" :key="route.path">
            <!-- 有子菜单 -->
            <el-sub-menu v-if="route.children && route.children.length > 1" :index="route.path">
              <template #title>
                <el-icon><component :is="route.meta.icon" /></el-icon>
                <span>{{ route.meta.title }}</span>
              </template>
              <el-menu-item
                v-for="child in route.children"
                :key="child.path"
                :index="route.path + '/' + child.path"
              >
                <el-icon><component :is="child.meta.icon" /></el-icon>
                <span>{{ child.meta.title }}</span>
              </el-menu-item>
            </el-sub-menu>
            
            <!-- 单个菜单 -->
            <el-menu-item
              v-else-if="route.children && route.children.length === 1"
              :index="route.path + '/' + route.children[0].path"
            >
              <el-icon><component :is="route.children[0].meta.icon" /></el-icon>
              <span>{{ route.children[0].meta.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
        
        <!-- 中国结装饰 -->
        <div class="chinese-knot">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" fill="none" stroke="#e63946" stroke-width="3" opacity="0.6"/>
            <circle cx="50" cy="50" r="20" fill="none" stroke="#f9ca24" stroke-width="2" opacity="0.6"/>
            <circle cx="50" cy="50" r="10" fill="#e63946" opacity="0.6"/>
          </svg>
        </div>
      </el-aside>

      <el-container>
        <!-- 顶部栏 -->
        <el-header class="header">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="currentRoute">{{ currentRoute }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
          <div class="header-right">
            <div class="header-time">
              <el-icon><Clock /></el-icon>
              <span>{{ currentTime }}</span>
            </div>
            
            <el-dropdown @command="handleCommand">
              <div class="user-info">
                <el-avatar :size="36" :src="userAvatar" />
                <span class="username">{{ userDisplayName }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item disabled>
                    <div style="text-align: center; padding: 5px 0;">
                      <div style="font-size: 14px; color: #303133;">{{ userInfo.username || '未登录' }}</div>
                      <div style="font-size: 12px; color: #909399; margin-top: 2px;">{{ userInfo.email || '' }}</div>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item divided command="profile">
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon><Setting /></el-icon>
                    系统设置
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容区 -->
        <el-main class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'Layout',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const currentTime = ref('')
    let timer = null

    // 获取用户信息
    const userInfo = ref({})
    const getUserInfoFromStorage = () => {
      const userInfoStr = localStorage.getItem('userInfo')
      if (userInfoStr) {
        try {
          userInfo.value = JSON.parse(userInfoStr)
        } catch (error) {
          console.error('解析用户信息失败：', error)
        }
      }
    }

    // 用户头像
    const userAvatar = computed(() => {
      return userInfo.value.avatarUrl || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    })

    // 显示名称（优先用户名，否则邮箱前缀）
    const userDisplayName = computed(() => {
      if (userInfo.value.username) {
        return userInfo.value.username
      }
      if (userInfo.value.email) {
        return userInfo.value.email.split('@')[0]
      }
      return '管理员'
    })

    // 获取菜单路由
    const menuRoutes = computed(() => {
      return router.options.routes.filter(route => 
        route.path !== '/login' && route.meta?.title
      )
    })

    // 当前激活的菜单
    const activeMenu = computed(() => {
      return route.path
    })

    // 当前路由名称
    const currentRoute = computed(() => {
      return route.meta?.title || ''
    })

    // 更新时间
    const updateTime = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    // 处理下拉菜单命令
    const handleCommand = (command) => {
      if (command === 'logout') {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        ElMessage.success('退出登录成功')
        router.push('/login')
      } else if (command === 'profile') {
        ElMessage.info('个人中心功能开发中')
      } else if (command === 'settings') {
        router.push('/system/settings')
      }
    }

    onMounted(() => {
      getUserInfoFromStorage()
      updateTime()
      timer = setInterval(updateTime, 1000)
    })

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer)
      }
    })

    return {
      menuRoutes,
      activeMenu,
      currentRoute,
      currentTime,
      userInfo,
      userAvatar,
      userDisplayName,
      handleCommand
    }
  }
}
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #fef5f5 0%, #ffebee 50%, #fef5f5 100%);
}

/* 凤凰装饰背景 - 增强版 */
.phoenix-decoration {
  position: fixed;
  pointer-events: none;
  z-index: 0;
  opacity: 0.12;
}

.phoenix-left-large {
  top: 10%;
  left: -50px;
  width: 400px;
  height: 500px;
  background-image: url("data:image/svg+xml,%3Csvg width='400' height='500' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='translate(50,0)'%3E%3Cellipse cx='200' cy='200' rx='60' ry='90' fill='%23d32f2f' opacity='0.8'/%3E%3Ccircle cx='200' cy='140' r='40' fill='%23d32f2f' opacity='0.9'/%3E%3Cpath d='M180 110 Q185 70 200 50 Q215 70 220 110' stroke='%23ffd700' stroke-width='5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M170 120 Q175 85 190 70' stroke='%23ffd700' stroke-width='4' fill='none'/%3E%3Cpath d='M230 120 Q225 85 210 70' stroke='%23ffd700' stroke-width='4' fill='none'/%3E%3Cpath d='M140 200 Q80 160 40 180 Q0 200 10 240 Q20 280 60 260 Q100 240 140 240' fill='%23b71c1c' opacity='0.7'/%3E%3Cpath d='M260 200 Q320 160 360 180 Q400 200 390 240 Q380 280 340 260 Q300 240 260 240' fill='%23b71c1c' opacity='0.7'/%3E%3Cpath d='M200 290 L180 380 L170 450 L160 490' stroke='%23d32f2f' stroke-width='8' fill='none' opacity='0.8'/%3E%3Cpath d='M200 290 L200 390 L200 480 L200 500' stroke='%23ffd700' stroke-width='9' fill='none' opacity='0.9'/%3E%3Cpath d='M200 290 L220 380 L230 450 L240 490' stroke='%23d32f2f' stroke-width='8' fill='none' opacity='0.8'/%3E%3Ccircle cx='200' cy='350' r='10' fill='%23ffd700'/%3E%3Ccircle cx='180' cy='400' r='8' fill='%23d32f2f'/%3E%3Ccircle cx='220' cy='400' r='8' fill='%23d32f2f'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: no-repeat;
  animation: phoenixFloat 6s infinite ease-in-out;
}

.phoenix-right-large {
  top: 10%;
  right: -50px;
  width: 400px;
  height: 500px;
  background-image: url("data:image/svg+xml,%3Csvg width='400' height='500' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='translate(50,0) scale(-1,1) translate(-400,0)'%3E%3Cellipse cx='200' cy='200' rx='60' ry='90' fill='%23d32f2f' opacity='0.8'/%3E%3Ccircle cx='200' cy='140' r='40' fill='%23d32f2f' opacity='0.9'/%3E%3Cpath d='M180 110 Q185 70 200 50 Q215 70 220 110' stroke='%23ffd700' stroke-width='5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M170 120 Q175 85 190 70' stroke='%23ffd700' stroke-width='4' fill='none'/%3E%3Cpath d='M230 120 Q225 85 210 70' stroke='%23ffd700' stroke-width='4' fill='none'/%3E%3Cpath d='M140 200 Q80 160 40 180 Q0 200 10 240 Q20 280 60 260 Q100 240 140 240' fill='%23b71c1c' opacity='0.7'/%3E%3Cpath d='M260 200 Q320 160 360 180 Q400 200 390 240 Q380 280 340 260 Q300 240 260 240' fill='%23b71c1c' opacity='0.7'/%3E%3Cpath d='M200 290 L180 380 L170 450 L160 490' stroke='%23d32f2f' stroke-width='8' fill='none' opacity='0.8'/%3E%3Cpath d='M200 290 L200 390 L200 480 L200 500' stroke='%23ffd700' stroke-width='9' fill='none' opacity='0.9'/%3E%3Cpath d='M200 290 L220 380 L230 450 L240 490' stroke='%23d32f2f' stroke-width='8' fill='none' opacity='0.8'/%3E%3Ccircle cx='200' cy='350' r='10' fill='%23ffd700'/%3E%3Ccircle cx='180' cy='400' r='8' fill='%23d32f2f'/%3E%3Ccircle cx='220' cy='400' r='8' fill='%23d32f2f'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: no-repeat;
  animation: phoenixFloat 6s infinite ease-in-out reverse;
}

.phoenix-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 600px;
  background-image: url("data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.05'%3E%3Cellipse cx='400' cy='300' rx='120' ry='150' fill='%23d32f2f'/%3E%3Ccircle cx='400' cy='200' r='70' fill='%23d32f2f'/%3E%3Cpath d='M350 140 Q370 80 400 50 Q430 80 450 140' stroke='%23ffd700' stroke-width='10' fill='none'/%3E%3Cpath d='M400 450 L380 520 L370 570' stroke='%23d32f2f' stroke-width='15'/%3E%3Cpath d='M400 450 L400 530 L400 590' stroke='%23ffd700' stroke-width='16'/%3E%3Cpath d='M400 450 L420 520 L430 570' stroke='%23d32f2f' stroke-width='15'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 0;
  animation: phoenixPulse 8s infinite ease-in-out;
}

@keyframes phoenixFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
}

@keyframes phoenixPulse {
  0%, 100% {
    opacity: 0.05;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.08;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.main-container {
  height: 100%;
  position: relative;
  z-index: 1;
}

/* 侧边栏 */
.sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #fff8f8 100%);
  box-shadow: 2px 0 12px rgba(230, 57, 70, 0.08);
  border-right: 1px solid var(--border-light);
  overflow-y: auto;
  position: relative;
}

.logo-container {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 2px solid var(--border-light);
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.logo-title {
  font-size: 20px;
  margin: 10px 0 5px;
}

.logo-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 2px;
}

.sidebar-menu {
  border: none;
  background: transparent;
}

.chinese-knot {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.4;
}

/* 顶部栏 */
.header {
  background: white;
  box-shadow: 0 2px 8px rgba(230, 57, 70, 0.06);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 30px;
}

.header-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: all 0.3s;
}

.user-info:hover {
  background: var(--bg-color);
}

.username {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

/* 主内容区 */
.main-content {
  padding: 24px;
  background: transparent;
  overflow-y: auto;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>

