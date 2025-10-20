import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/api/login'
import { ElMessage } from 'element-plus'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
  }),

  getters: {
    // 是否已登录
    isLoggedIn: (state) => !!state.token,
    // 用户名
    username: (state) => state.userInfo.username || '',
    // 用户角色
    roles: (state) => state.userInfo.roles || []
  },

  actions: {
    // 登录
    async login(loginData) {
      try {
        const token = await login(loginData)
        this.token = token
        localStorage.setItem('token', token)
        
        // 获取用户信息
        await this.getUserInfo()
        
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        const userInfo = await getUserInfo()
        this.userInfo = userInfo
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        return Promise.resolve(userInfo)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 退出登录
    async logout() {
      try {
        await logout()
      } catch (error) {
        console.error('退出登录失败：', error)
      } finally {
        this.token = ''
        this.userInfo = {}
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/login')
        ElMessage.success('退出登录成功')
      }
    },

    // 清除用户信息（token 过期时使用）
    clearUserInfo() {
      this.token = ''
      this.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})

