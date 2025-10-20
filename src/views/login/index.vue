<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <!-- 祥云 -->
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
      
      <!-- 凤凰装饰 - 党建风格增强版 -->
      <div class="phoenix-left">
        <svg width="350" height="500" viewBox="0 0 350 500" xmlns="http://www.w3.org/2000/svg">
          <!-- 凤凰身体 -->
          <ellipse cx="175" cy="180" rx="70" ry="100" fill="#d32f2f" opacity="0.85"/>
          <!-- 凤凰头 -->
          <circle cx="175" cy="100" r="45" fill="#d32f2f" opacity="0.9"/>
          <!-- 凤凰冠 - 金色 -->
          <path d="M155 65 Q165 25 175 10 Q185 25 195 65" stroke="#ffd700" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M145 75 Q155 40 170 25" stroke="#ffd700" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M205 75 Q195 40 180 25" stroke="#ffd700" stroke-width="5" fill="none" stroke-linecap="round"/>
          <!-- 眼睛 -->
          <circle cx="160" cy="95" r="8" fill="#1a1a1a"/>
          <circle cx="190" cy="95" r="8" fill="#1a1a1a"/>
          <circle cx="162" cy="92" r="3" fill="white"/>
          <circle cx="192" cy="92" r="3" fill="white"/>
          <!-- 翅膀 - 左侧 -->
          <path d="M105 180 Q45 140 15 165 Q-15 190 -5 235 Q5 280 50 255 Q95 230 105 210" 
                fill="#b71c1c" opacity="0.8"/>
          <path d="M95 190 Q40 155 10 175 Q-20 195 -10 235" 
                stroke="#d32f2f" stroke-width="4" fill="none"/>
          <!-- 翅膀 - 右侧 -->
          <path d="M245 180 Q305 140 335 165 Q365 190 355 235 Q345 280 300 255 Q255 230 245 210" 
                fill="#b71c1c" opacity="0.8"/>
          <path d="M255 190 Q310 155 340 175 Q370 195 360 235" 
                stroke="#d32f2f" stroke-width="4" fill="none"/>
          <!-- 尾羽 - 左侧 -->
          <path d="M155 280 Q135 340 115 410 Q110 450 105 485" 
                stroke="#d32f2f" stroke-width="8" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M145 280 Q120 335 95 400 Q85 440 75 475" 
                stroke="#b71c1c" stroke-width="7" fill="none" opacity="0.8" stroke-linecap="round"/>
          <!-- 尾羽 - 中间（金色） -->
          <path d="M175 280 Q175 350 175 430 Q175 470 175 495" 
                stroke="#ffd700" stroke-width="10" fill="none" opacity="0.95" stroke-linecap="round"/>
          <path d="M175 280 Q170 350 165 430" 
                stroke="#ffb300" stroke-width="8" fill="none" opacity="0.9" stroke-linecap="round"/>
          <!-- 尾羽 - 右侧 -->
          <path d="M195 280 Q215 340 235 410 Q240 450 245 485" 
                stroke="#d32f2f" stroke-width="8" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M205 280 Q230 335 255 400 Q265 440 275 475" 
                stroke="#b71c1c" stroke-width="7" fill="none" opacity="0.8" stroke-linecap="round"/>
          <!-- 尾羽装饰 -->
          <circle cx="175" cy="340" r="12" fill="#ffd700" opacity="0.9"/>
          <circle cx="155" cy="380" r="9" fill="#d32f2f" opacity="0.85"/>
          <circle cx="195" cy="380" r="9" fill="#d32f2f" opacity="0.85"/>
          <circle cx="175" cy="420" r="10" fill="#ffd700" opacity="0.85"/>
          <circle cx="115" cy="450" r="7" fill="#b71c1c" opacity="0.8"/>
          <circle cx="235" cy="450" r="7" fill="#b71c1c" opacity="0.8"/>
        </svg>
      </div>
      
      <div class="phoenix-right">
        <svg width="350" height="500" viewBox="0 0 350 500" xmlns="http://www.w3.org/2000/svg">
          <!-- 对称凤凰 - 党建风格 -->
          <ellipse cx="175" cy="180" rx="70" ry="100" fill="#d32f2f" opacity="0.85"/>
          <circle cx="175" cy="100" r="45" fill="#d32f2f" opacity="0.9"/>
          <path d="M155 65 Q165 25 175 10 Q185 25 195 65" stroke="#ffd700" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M145 75 Q155 40 170 25" stroke="#ffd700" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M205 75 Q195 40 180 25" stroke="#ffd700" stroke-width="5" fill="none" stroke-linecap="round"/>
          <circle cx="160" cy="95" r="8" fill="#1a1a1a"/>
          <circle cx="190" cy="95" r="8" fill="#1a1a1a"/>
          <circle cx="162" cy="92" r="3" fill="white"/>
          <circle cx="192" cy="92" r="3" fill="white"/>
          <path d="M105 180 Q45 140 15 165 Q-15 190 -5 235 Q5 280 50 255 Q95 230 105 210" 
                fill="#b71c1c" opacity="0.8"/>
          <path d="M95 190 Q40 155 10 175 Q-20 195 -10 235" 
                stroke="#d32f2f" stroke-width="4" fill="none"/>
          <path d="M245 180 Q305 140 335 165 Q365 190 355 235 Q345 280 300 255 Q255 230 245 210" 
                fill="#b71c1c" opacity="0.8"/>
          <path d="M255 190 Q310 155 340 175 Q370 195 360 235" 
                stroke="#d32f2f" stroke-width="4" fill="none"/>
          <path d="M155 280 Q135 340 115 410 Q110 450 105 485" 
                stroke="#d32f2f" stroke-width="8" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M145 280 Q120 335 95 400 Q85 440 75 475" 
                stroke="#b71c1c" stroke-width="7" fill="none" opacity="0.8" stroke-linecap="round"/>
          <path d="M175 280 Q175 350 175 430 Q175 470 175 495" 
                stroke="#ffd700" stroke-width="10" fill="none" opacity="0.95" stroke-linecap="round"/>
          <path d="M175 280 Q180 350 185 430" 
                stroke="#ffb300" stroke-width="8" fill="none" opacity="0.9" stroke-linecap="round"/>
          <path d="M195 280 Q215 340 235 410 Q240 450 245 485" 
                stroke="#d32f2f" stroke-width="8" fill="none" opacity="0.85" stroke-linecap="round"/>
          <path d="M205 280 Q230 335 255 400 Q265 440 275 475" 
                stroke="#b71c1c" stroke-width="7" fill="none" opacity="0.8" stroke-linecap="round"/>
          <circle cx="175" cy="340" r="12" fill="#ffd700" opacity="0.9"/>
          <circle cx="155" cy="380" r="9" fill="#d32f2f" opacity="0.85"/>
          <circle cx="195" cy="380" r="9" fill="#d32f2f" opacity="0.85"/>
          <circle cx="175" cy="420" r="10" fill="#ffd700" opacity="0.85"/>
          <circle cx="115" cy="450" r="7" fill="#b71c1c" opacity="0.8"/>
          <circle cx="235" cy="450" r="7" fill="#b71c1c" opacity="0.8"/>
        </svg>
      </div>
    </div>

    <!-- 登录框 -->
    <div class="login-box">
      <div class="login-header">
        <div class="flag-icon">🇨🇳</div>
        <h1 class="login-title">青少年爱国教育平台</h1>
        <p class="login-subtitle">管理系统登录</p>
        <div class="title-decoration">
          <span class="decoration-line"></span>
          <span class="decoration-star">★</span>
          <span class="decoration-line"></span>
        </div>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="请输入邮箱"
            size="large"
            type="email"
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p class="slogan">爱国教育，从心开始 🇨🇳</p>
        <p class="copyright">© 2025 青少年爱国教育平台 版权所有</p>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="corner-decoration corner-top-left"></div>
    <div class="corner-decoration corner-top-right"></div>
    <div class="corner-decoration corner-bottom-left"></div>
    <div class="corner-decoration corner-bottom-right"></div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, getUserInfo } from '@/api/login'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const loginFormRef = ref(null)
    const loading = ref(false)

    const loginForm = reactive({
      email: '',
      password: '',
      remember: false
    })

    // 简单的密码加密/解密（使用 Base64）
    const encryptPassword = (password) => {
      try {
        return btoa(encodeURIComponent(password))
      } catch (e) {
        return password
      }
    }

    const decryptPassword = (encrypted) => {
      try {
        return decodeURIComponent(atob(encrypted))
      } catch (e) {
        return encrypted
      }
    }

    // 页面加载时读取保存的账号密码
    const loadSavedCredentials = () => {
      const savedEmail = localStorage.getItem('savedEmail')
      const savedPassword = localStorage.getItem('savedPassword')
      
      if (savedEmail && savedPassword) {
        loginForm.email = savedEmail
        loginForm.password = decryptPassword(savedPassword)
        loginForm.remember = true
      }
    }

    const loginRules = {
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' }
      ]
    }

    const handleLogin = async () => {
      if (!loginFormRef.value) return

      try {
        await loginFormRef.value.validate()
        loading.value = true

        // 调用登录接口
        const token = await login({
          email: loginForm.email,
          password: loginForm.password
        })

        // 保存 token
        localStorage.setItem('token', token)

        // 记住密码功能
        if (loginForm.remember) {
          localStorage.setItem('savedEmail', loginForm.email)
          localStorage.setItem('savedPassword', encryptPassword(loginForm.password))
        } else {
          localStorage.removeItem('savedEmail')
          localStorage.removeItem('savedPassword')
        }

        // 获取用户信息
        try {
          const userInfo = await getUserInfo()
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
        } catch (error) {
          console.warn('获取用户信息失败：', error)
        }

        ElMessage.success('登录成功！')
        router.push('/')
      } catch (error) {
        console.error('登录失败：', error)
      } finally {
        loading.value = false
      }
    }

    // 页面挂载时加载保存的凭据
    onMounted(() => {
      loadSavedCredentials()
    })

    return {
      loginFormRef,
      loginForm,
      loginRules,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #ffebee 0%, #fef5f5 50%, #ffebee 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 祥云动画 */
.cloud {
  position: absolute;
  width: 200px;
  height: 100px;
  background: url("data:image/svg+xml,%3Csvg width='200' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 60 Q20 40 40 20 Q60 0 80 20 Q100 10 120 20 Q140 0 160 20 Q180 40 160 60 Q180 80 160 90 Q140 100 120 90 Q100 95 80 90 Q60 100 40 90 Q20 80 40 60 Z' fill='%23ffffff' opacity='0.6'/%3E%3C/svg%3E") no-repeat center;
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.cloud-1 {
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.cloud-2 {
  top: 70%;
  right: 10%;
  animation-delay: 7s;
}

.cloud-3 {
  top: 30%;
  right: 5%;
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-30px) translateX(20px);
  }
}

/* 凤凰装饰 - 党建风格增强 */
.phoenix-left {
  position: absolute;
  left: 3%;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.2;
  animation: phoenixFloat 8s infinite ease-in-out;
  filter: drop-shadow(0 0 20px rgba(211, 47, 47, 0.3));
}

.phoenix-right {
  position: absolute;
  right: 3%;
  top: 50%;
  transform: translateY(-50%) scaleX(-1);
  opacity: 0.2;
  animation: phoenixFloat 8s infinite ease-in-out reverse;
  filter: drop-shadow(0 0 20px rgba(211, 47, 47, 0.3));
}

@keyframes phoenixFloat {
  0%, 100% {
    transform: translateY(-50%) scale(1);
  }
  50% {
    transform: translateY(-55%) scale(1.05);
  }
}

/* 登录框 */
.login-box {
  width: 450px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 50px 40px;
  box-shadow: 0 20px 60px rgba(230, 57, 70, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(230, 57, 70, 0.1);
  position: relative;
  z-index: 10;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.flag-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: wave 3s infinite ease-in-out;
}

@keyframes wave {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 50%, #d32f2f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(211, 47, 47, 0.2);
}

.login-subtitle {
  font-size: 14px;
  color: #636e72;
  margin-bottom: 20px;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.decoration-line {
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d32f2f, transparent);
}

.decoration-star {
  color: #ffd700;
  font-size: 20px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

/* 表单样式 */
.login-form {
  margin-top: 30px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 12px 15px;
  box-shadow: 0 2px 8px rgba(230, 57, 70, 0.05);
  border: 1px solid #ffd7d7;
  transition: all 0.3s;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: #e63946;
  box-shadow: 0 4px 12px rgba(230, 57, 70, 0.1);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #e63946;
  box-shadow: 0 0 0 4px rgba(230, 57, 70, 0.1);
}

.login-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  border: none;
  box-shadow: 0 8px 20px rgba(211, 47, 47, 0.4);
  transition: all 0.3s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(211, 47, 47, 0.5);
  background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
}

.login-button:active {
  transform: translateY(0);
}

/* 登录底部 */
.login-footer {
  margin-top: 30px;
  text-align: center;
}

.slogan {
  font-size: 14px;
  color: #d32f2f;
  font-weight: 600;
  margin-bottom: 10px;
  text-shadow: 0 1px 3px rgba(211, 47, 47, 0.2);
}

.copyright {
  font-size: 12px;
  color: #b2bec3;
}

/* 角落装饰 - 党建风格 */
.corner-decoration {
  position: absolute;
  width: 150px;
  height: 150px;
  background-image: url("data:image/svg+xml,%3Csvg width='150' height='150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q30 0 30 30 L30 150 L0 150 Z' fill='%23d32f2f' opacity='0.15'/%3E%3Cpath d='M10 10 L10 40 Q10 50 20 50 L50 50' stroke='%23ffd700' stroke-width='3' fill='none' opacity='0.7'/%3E%3Ccircle cx='15' cy='15' r='3' fill='%23ffd700' opacity='0.8'/%3E%3C/svg%3E");
  pointer-events: none;
}

.corner-top-left {
  top: 0;
  left: 0;
}

.corner-top-right {
  top: 0;
  right: 0;
  transform: rotate(90deg);
}

.corner-bottom-left {
  bottom: 0;
  left: 0;
  transform: rotate(-90deg);
}

.corner-bottom-right {
  bottom: 0;
  right: 0;
  transform: rotate(180deg);
}
</style>

