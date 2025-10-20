# 安装和部署指南

## 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

## 安装步骤

### 1. 克隆或下载项目

如果从 Git 仓库克隆：
```bash
git clone <repository-url>
cd patriotic-education-admin
```

### 2. 安装依赖

使用 npm：
```bash
npm install
```

或使用 yarn：
```bash
yarn install
```

### 3. 开发模式运行

```bash
npm run dev
```

项目将在 http://localhost:3000 启动

### 4. 构建生产版本

```bash
npm run build
```

构建后的文件将在 `dist` 目录中

### 5. 预览生产版本

```bash
npm run preview
```

## 常见问题

### 1. 依赖安装失败

如果遇到依赖安装问题，可以尝试：

```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 2. 端口被占用

如果 3000 端口被占用，可以修改 `vite.config.js` 中的端口配置：

```javascript
export default defineConfig({
  server: {
    port: 3001, // 改为其他端口
    open: true
  }
})
```

### 3. Element Plus 图标不显示

确保已正确安装 `@element-plus/icons-vue`：

```bash
npm install @element-plus/icons-vue
```

## 部署到生产环境

### 使用 Nginx

1. 构建项目：
```bash
npm run build
```

2. 将 `dist` 目录下的文件复制到 Nginx 的 html 目录

3. 配置 Nginx：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 使用 Apache

1. 构建项目
2. 将 `dist` 目录下的文件复制到 Apache 的 htdocs 目录
3. 创建 `.htaccess` 文件：

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 环境变量配置

创建 `.env` 文件配置环境变量：

```env
# API 基础地址
VITE_API_BASE_URL=http://your-api-url

# 应用标题
VITE_APP_TITLE=青少年爱国教育平台

# 其他配置...
```

## 开发建议

1. 使用 VSCode 编辑器，安装推荐的插件：
   - Volar (Vue 3)
   - ESLint
   - Prettier

2. 代码提交前运行构建测试：
   ```bash
   npm run build
   ```

3. 保持依赖包更新：
   ```bash
   npm update
   ```

## 技术支持

如有问题，请联系：
- 邮箱: support@patriotic-edu.cn
- 电话: 400-888-8888

