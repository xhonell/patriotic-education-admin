<template>
  <div class="no-permission-container">
    <div class="no-permission-card">
      <div class="icon-wrapper">
        <span class="icon-text">403</span>
      </div>
      <h1 class="title">无权限访问</h1>
      <p class="subtitle">当前账号暂无访问该资源的权限，如需开通请联系系统管理员。</p>
      <div class="actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.no-permission-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-permission-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px 60px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 520px;
}

.icon-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 40px;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(255, 152, 0, 0.3);
}

.title {
  font-size: 28px;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
}

.actions .el-button + .el-button {
  margin-left: 12px;
}
</style>


