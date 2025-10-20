<template>
  <div class="system-settings-container">
    <div class="page-header">
      <h1 class="page-title gradient-text">系统设置</h1>
      <p class="page-subtitle">配置系统基本参数</p>
    </div>

    <el-tabs v-model="activeTab" class="settings-tabs">
      <el-tab-pane label="基本设置" name="basic">
        <div class="card">
          <el-form :model="basicForm" label-width="140px">
            <el-form-item label="系统名称">
              <el-input v-model="basicForm.systemName" placeholder="请输入系统名称" />
            </el-form-item>

            <el-form-item label="系统Logo">
              <el-upload
                class="logo-uploader"
                action="#"
                :show-file-list="false"
                accept="image/*"
              >
                <img v-if="basicForm.logo" :src="basicForm.logo" class="logo-image" />
                <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>

            <el-form-item label="联系邮箱">
              <el-input v-model="basicForm.email" placeholder="请输入联系邮箱" />
            </el-form-item>

            <el-form-item label="客服电话">
              <el-input v-model="basicForm.phone" placeholder="请输入客服电话" />
            </el-form-item>

            <el-form-item label="系统描述">
              <el-input
                v-model="basicForm.description"
                type="textarea"
                :rows="4"
                placeholder="请输入系统描述"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSaveBasic">
                <el-icon><Check /></el-icon>
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="安全设置" name="security">
        <div class="card">
          <el-form :model="securityForm" label-width="140px">
            <el-form-item label="登录过期时间">
              <el-input-number v-model="securityForm.sessionTimeout" :min="30" :max="1440" />
              <span style="margin-left: 10px;">分钟</span>
            </el-form-item>

            <el-form-item label="密码最小长度">
              <el-input-number v-model="securityForm.passwordMinLength" :min="6" :max="20" />
              <span style="margin-left: 10px;">位</span>
            </el-form-item>

            <el-form-item label="密码复杂度">
              <el-checkbox-group v-model="securityForm.passwordComplexity">
                <el-checkbox label="uppercase">大写字母</el-checkbox>
                <el-checkbox label="lowercase">小写字母</el-checkbox>
                <el-checkbox label="number">数字</el-checkbox>
                <el-checkbox label="special">特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="登录失败锁定">
              <el-switch v-model="securityForm.loginLockEnabled" />
              <span style="margin-left: 10px; color: #636e72;">
                连续失败5次后锁定账号30分钟
              </span>
            </el-form-item>

            <el-form-item label="IP白名单">
              <el-switch v-model="securityForm.ipWhitelistEnabled" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSaveSecurity">
                <el-icon><Check /></el-icon>
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="通知设置" name="notification">
        <div class="card">
          <el-form :model="notificationForm" label-width="140px">
            <el-form-item label="邮件通知">
              <el-switch v-model="notificationForm.emailEnabled" />
            </el-form-item>

            <el-form-item label="短信通知">
              <el-switch v-model="notificationForm.smsEnabled" />
            </el-form-item>

            <el-form-item label="系统消息">
              <el-switch v-model="notificationForm.systemMessageEnabled" />
            </el-form-item>

            <el-form-item label="通知类型">
              <el-checkbox-group v-model="notificationForm.notificationTypes">
                <el-checkbox label="user">用户注册</el-checkbox>
                <el-checkbox label="content">内容发布</el-checkbox>
                <el-checkbox label="report">每日报表</el-checkbox>
                <el-checkbox label="security">安全告警</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSaveNotification">
                <el-icon><Check /></el-icon>
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="关于系统" name="about">
        <div class="card about-card">
          <div class="about-header">
            <div class="about-logo">🇨🇳</div>
            <h2 class="about-title gradient-text">青少年爱国教育平台</h2>
            <p class="about-version">管理系统 v1.0.0</p>
          </div>

          <el-divider />

          <div class="about-content">
            <div class="about-item">
              <div class="about-label">系统简介</div>
              <div class="about-value">
                基于个性化推荐的青少年爱国教育平台，致力于通过现代化的技术手段，
                为青少年提供优质的爱国主义教育内容，培养民族自豪感和爱国情怀。
              </div>
            </div>

            <div class="about-item">
              <div class="about-label">技术栈</div>
              <div class="about-value">
                Vue 3 + JavaScript + Element Plus + ECharts + Vite
              </div>
            </div>

            <div class="about-item">
              <div class="about-label">版权信息</div>
              <div class="about-value">
                © 2025 青少年爱国教育平台 版权所有
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'SystemSettings',
  setup() {
    const activeTab = ref('basic')

    const basicForm = reactive({
      systemName: '青少年爱国教育平台',
      logo: '',
      email: 'support@patriotic-edu.cn',
      phone: '400-888-8888',
      description: '基于个性化推荐的青少年爱国教育平台'
    })

    const securityForm = reactive({
      sessionTimeout: 120,
      passwordMinLength: 8,
      passwordComplexity: ['uppercase', 'lowercase', 'number'],
      loginLockEnabled: true,
      ipWhitelistEnabled: false
    })

    const notificationForm = reactive({
      emailEnabled: true,
      smsEnabled: false,
      systemMessageEnabled: true,
      notificationTypes: ['user', 'content', 'security']
    })

    const handleSaveBasic = () => {
      ElMessage.success('基本设置保存成功')
    }

    const handleSaveSecurity = () => {
      ElMessage.success('安全设置保存成功')
    }

    const handleSaveNotification = () => {
      ElMessage.success('通知设置保存成功')
    }

    return {
      activeTab,
      basicForm,
      securityForm,
      notificationForm,
      handleSaveBasic,
      handleSaveSecurity,
      handleSaveNotification
    }
  }
}
</script>

<style scoped>
.system-settings-container {
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

.settings-tabs {
  margin-top: 20px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(230, 57, 70, 0.08);
  border: 1px solid var(--border-light);
}

.logo-uploader :deep(.el-upload) {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.logo-uploader :deep(.el-upload:hover) {
  border-color: var(--primary-color);
}

.logo-uploader-icon {
  font-size: 32px;
  color: var(--text-secondary);
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.about-card {
  text-align: center;
}

.about-header {
  padding: 20px 0;
}

.about-logo {
  font-size: 80px;
  margin-bottom: 20px;
}

.about-title {
  font-size: 28px;
  margin-bottom: 10px;
}

.about-version {
  font-size: 14px;
  color: var(--text-secondary);
}

.about-content {
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
}

.about-item {
  margin-bottom: 30px;
}

.about-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
  position: relative;
  padding-left: 12px;
}

.about-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: linear-gradient(180deg, #e63946 0%, #f9ca24 100%);
  border-radius: 2px;
}

.about-value {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
  padding-left: 12px;
}
</style>

