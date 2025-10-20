# 开发指南

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问系统
打开浏览器访问：http://localhost:3000

## ⚡ 热重载配置

项目已配置**自动热重载**，修改文件后会自动更新！

### Vite 配置 (vite.config.js)
```javascript
server: {
  port: 3000,
  open: true,           // 自动打开浏览器
  host: true,           // 监听所有地址
  hmr: true,            // 热模块替换
  watch: {
    usePolling: true,   // 使用轮询模式
    interval: 100       // 轮询间隔 100ms
  }
}
```

### 自动更新的文件类型
- ✅ `.vue` 文件（组件）
- ✅ `.js` 文件（脚本）
- ✅ `.css` 文件（样式）
- ✅ `.svg` 文件（图标）
- ✅ `.json` 文件（配置）

### 实时预览
修改任何文件后：
1. **保存文件** (Ctrl+S / Cmd+S)
2. **自动编译** (Vite 检测到变化)
3. **浏览器更新** (HMR 注入变更)
4. **保持状态** (无需刷新页面)

## 🎨 楷体字体配置

### 全局字体
```css
font-family: "KaiTi", "楷体", "STKaiti", "华文楷体", serif;
```

### 应用范围
- 所有文本内容
- 标题和正文
- 按钮和菜单
- 表单输入框

详细说明见：[FONT_GUIDE.md](./FONT_GUIDE.md)

## 📁 项目结构

```
src/
├── App.vue              # 根组件
├── main.js              # 入口文件
├── layout/              # 布局组件
│   └── index.vue        # 主布局
├── router/              # 路由配置
│   └── index.js         # 路由定义
├── styles/              # 全局样式
│   └── main.css         # 主样式（楷体配置）
└── views/               # 页面组件
    ├── login/           # 登录页
    ├── dashboard/       # 数据统计
    ├── user/            # 用户管理
    ├── content/         # 内容管理
    ├── recommend/       # 推荐系统
    └── system/          # 系统管理
```

## 🛠️ 常用命令

### 开发
```bash
# 启动开发服务器（自动热重载）
npm run dev

# 启动并指定端口
npm run dev -- --port 3001
```

### 构建
```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### Windows 快捷脚本
```bash
# 安装依赖
双击 install.bat

# 启动开发
双击 start.bat

# 构建项目
双击 build.bat
```

## 💻 VSCode 配置

### 推荐插件
- **Volar** - Vue 3 语法支持
- **Prettier** - 代码格式化
- **ESLint** - 代码检查

### 自动保存
已配置 `.vscode/settings.json`：
```json
{
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000
}
```

### 楷体编辑器
```json
{
  "editor.fontFamily": "KaiTi, 楷体, Consolas"
}
```

## 🎯 开发流程

### 1. 修改代码
在 VSCode 中编辑文件：
- 组件：`src/views/xxx/xxx.vue`
- 样式：`src/styles/main.css`
- 路由：`src/router/index.js`

### 2. 自动保存
- 配置了自动保存（1秒后）
- 或手动保存：Ctrl+S / Cmd+S

### 3. 实时预览
- Vite 检测到文件变化
- 自动编译更新
- 浏览器实时刷新
- **无需手动操作！**

### 4. 查看效果
浏览器会立即显示更新后的效果

## 🐛 调试技巧

### 浏览器开发工具
```
Chrome/Edge: F12 或 Ctrl+Shift+I
Firefox: F12
Safari: Cmd+Option+I
```

### Vue DevTools
安装 Vue DevTools 浏览器插件：
- 查看组件树
- 检查状态数据
- 调试路由
- 性能分析

### 控制台调试
```javascript
// 组件中添加日志
console.log('数据：', data)
console.table(tableData)
console.error('错误：', error)
```

## 🎨 样式开发

### 修改主题色
编辑 `src/styles/main.css`：
```css
:root {
  --primary-color: #d32f2f;    /* 党旗红 */
  --secondary-color: #ffd700;   /* 金黄色 */
}
```

### 添加全局样式
在 `src/styles/main.css` 底部添加

### 组件局部样式
在 `.vue` 文件中：
```vue
<style scoped>
.my-class {
  font-family: KaiTi;
  color: #d32f2f;
}
</style>
```

## 📦 添加新页面

### 1. 创建组件
```bash
src/views/newpage/index.vue
```

### 2. 配置路由
编辑 `src/router/index.js`：
```javascript
{
  path: '/newpage',
  component: Layout,
  children: [{
    path: '',
    name: 'NewPage',
    component: () => import('@/views/newpage/index.vue'),
    meta: { title: '新页面', icon: 'Document' }
  }]
}
```

### 3. 自动生效
保存后立即在浏览器中看到效果！

## ⚠️ 常见问题

### 热重载不工作？
1. 检查端口是否被占用
2. 重启开发服务器：Ctrl+C 然后 `npm run dev`
3. 清除浏览器缓存：Ctrl+Shift+Delete

### 样式不更新？
1. 检查 CSS 语法是否正确
2. 清除浏览器缓存
3. 硬刷新：Ctrl+F5

### 字体不显示楷体？
1. 确认系统已安装楷体字体
2. Windows: 查看 C:\Windows\Fonts\
3. Mac: 查看 /Library/Fonts/
4. 查看 [FONT_GUIDE.md](./FONT_GUIDE.md)

## 🚀 性能优化

### 开发环境
- ✅ Vite 快速冷启动（< 1秒）
- ✅ 热模块替换（< 100ms）
- ✅ 按需编译
- ✅ 源码映射

### 生产环境
```bash
npm run build
```
- 代码分割
- Tree-shaking
- 压缩优化
- 资源哈希

## 📚 相关文档

- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://cn.vitejs.dev/)
- [Element Plus 文档](https://element-plus.org/zh-CN/)
- [楷体配置](./FONT_GUIDE.md)
- [功能特性](./FEATURES.md)

## 💡 开发建议

### 代码规范
- 使用 Composition API
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case
- 样式使用 scoped

### 提交规范
```bash
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复bug"
git commit -m "style: 样式调整"
git commit -m "docs: 更新文档"
```

---

**享受开发，实时预览！** 🚀

有任何问题，请查看其他文档或联系技术支持。

