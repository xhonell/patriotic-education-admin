# 楷体字体使用说明

## 📝 字体配置

项目已全局配置为**楷体**，营造传统文化氛围。

## 🎨 字体家族

```css
font-family: "KaiTi", "楷体", "STKaiti", "华文楷体", serif;
```

### 字体回退顺序：
1. **KaiTi** - Windows 系统楷体（英文名）
2. **楷体** - 中文名称
3. **STKaiti** - Mac 系统楷体
4. **华文楷体** - 备选楷体
5. **serif** - 系统默认衬线字体

## 💻 不同系统的楷体

### Windows 系统
- 系统自带楷体：`C:\Windows\Fonts\simkai.ttf`
- 字体名称：楷体 / KaiTi
- 无需额外安装

### Mac 系统  
- 系统自带楷体：华文楷体 (STKaiti)
- 路径：`/Library/Fonts/`
- 无需额外安装

### Linux 系统
如果系统没有楷体，可以安装：
```bash
# Ubuntu/Debian
sudo apt-get install fonts-arphic-ukai

# CentOS/RedHat
sudo yum install cjkuni-ukai-fonts
```

## ✨ 楷体特点

### 视觉特征
- **端庄秀丽**：笔画清晰，结构工整
- **传统文化**：体现中国传统书法美感
- **易读性好**：适合长文本阅读
- **庄重大气**：符合党建爱国风格

### 适用场景
✅ 政府机关网站
✅ 教育文化平台
✅ 党建学习系统
✅ 传统文化应用
✅ 正式公文系统

## 🎯 项目中的应用

### 全局字体
所有文本默认使用楷体：
- 页面标题
- 正文内容
- 按钮文字
- 表单输入
- 菜单导航

### 特殊处理
代码编辑器保留等宽字体：
```css
.code-editor {
  font-family: Consolas, Monaco, monospace;
}
```

## 🔧 自定义字体

如需修改字体，编辑 `src/styles/main.css`：

```css
html, body {
  font-family: "你的字体", "备用字体", serif;
}
```

## 📱 浏览器兼容性

| 浏览器 | 支持情况 |
|--------|----------|
| Chrome | ✅ 完美支持 |
| Firefox | ✅ 完美支持 |
| Safari | ✅ 完美支持 |
| Edge | ✅ 完美支持 |
| IE 11 | ⚠️ 基本支持 |

## 💡 开发提示

### VSCode 编辑器字体
已配置 `.vscode/settings.json`：
```json
{
  "editor.fontFamily": "KaiTi, 楷体, Consolas"
}
```

### 热重载
项目已启用：
- ✅ 热模块替换 (HMR)
- ✅ 文件监听轮询
- ✅ 自动刷新

修改任何文件后，浏览器会**自动更新**，无需手动刷新！

## 🎨 字体效果预览

### 标题效果
```
青少年爱国教育平台
```
- 笔画有力，端庄大气
- 适合标题和重要文字

### 正文效果
```
中华人民共和国成立于1949年10月1日，
标志着中国人民从此站起来了。
```
- 易读性好，适合长文本
- 保持传统文化韵味

## 🚀 性能优化

### 字体加载
- 使用系统内置字体，**无需网络加载**
- 首屏渲染速度快
- 不增加页面体积

### 渲染性能
- 浏览器原生支持
- 硬件加速渲染
- 流畅的显示效果

## 📚 相关资源

- [楷体历史](https://baike.baidu.com/item/楷体)
- [中文字体设计](https://www.typeland.com/)
- [字体渲染优化](https://web.dev/font-best-practices/)

---

**传承传统文化，展现国风之美** 🇨🇳

