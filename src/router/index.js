import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '数据统计', icon: 'DataAnalysis' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: { title: '用户管理', icon: 'User' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/list.vue'),
        meta: { title: '用户列表', icon: 'UserFilled' }
      },
      {
        path: 'statistics',
        name: 'UserStatistics',
        component: () => import('@/views/user/statistics.vue'),
        meta: { title: '用户统计', icon: 'TrendCharts' }
      }
    ]
  },
  {
    path: '/content',
    component: Layout,
    redirect: '/content/list',
    meta: { title: '内容管理', icon: 'Document' },
    children: [
      {
        path: 'list',
        name: 'ContentList',
        component: () => import('@/views/content/list.vue'),
        meta: { title: '内容列表', icon: 'DocumentCopy' }
      },
      {
        path: 'category',
        name: 'ContentCategory',
        component: () => import('@/views/content/category.vue'),
        meta: { title: '内容分类', icon: 'Folder' }
      },
      {
        path: 'banner',
        name: 'BannerManagement',
        component: () => import('@/views/content/banner.vue'),
        meta: { title: '轮播图管理', icon: 'Picture' }
      },
      {
        path: 'add',
        name: 'ContentAdd',
        component: () => import('@/views/content/add.vue'),
        meta: { title: '添加内容', icon: 'Plus' }
      }
    ]
  },
  {
    path: '/recommend',
    component: Layout,
    redirect: '/recommend/system',
    meta: { title: '推荐系统', icon: 'MagicStick' },
    children: [
      {
        path: 'system',
        name: 'RecommendSystem',
        component: () => import('@/views/recommend/system.vue'),
        meta: { title: '推荐配置', icon: 'Setting' }
      },
      {
        path: 'analysis',
        name: 'RecommendAnalysis',
        component: () => import('@/views/recommend/analysis.vue'),
        meta: { title: '推荐分析', icon: 'DataLine' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/settings',
    meta: { title: '系统管理', icon: 'Tools' },
    children: [
      {
        path: 'settings',
        name: 'SystemSettings',
        component: () => import('@/views/system/settings.vue'),
        meta: { title: '系统设置', icon: 'Setting' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router

