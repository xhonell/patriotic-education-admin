# API 接口对接指南

## 📡 接口配置

### 后端服务器地址
开发环境：`http://localhost:8080`

### 代理配置
已在 `vite.config.js` 中配置代理：
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

前端请求 `/api/login/login` 会被代理到 `http://localhost:8080/login/login`

## 🔐 登录接口

### 1. 用户登录

#### 接口信息
- **URL**: `/login/login`
- **方法**: `POST`
- **认证**: 不需要（@NoAuth）

#### 请求参数
```java
// LoginRequest.java
{
  "username": "admin",
  "password": "123456"
}
```

#### 响应格式
```java
// Result<String>
{
  "code": 200,
  "message": "success",
  "data": "eyJhbGciOiJIUzI1NiJ9..." // JWT Token
}
```

#### 前端调用
```javascript
import { login } from '@/api/login'

const token = await login({
  username: 'admin',
  password: '123456'
})

// 保存 token
localStorage.setItem('token', token)
```

### 2. 获取用户信息

#### 接口信息
- **URL**: `/login/info`
- **方法**: `GET`
- **认证**: 需要（需要 token）

#### 请求头
```
Authorization: Bearer {token}
```

#### 响应格式
```java
// Result<RedisUser>
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "avatar": "https://...",
    "roles": ["ADMIN"],
    // 其他用户信息...
  }
}
```

#### 前端调用
```javascript
import { getUserInfo } from '@/api/login'

const userInfo = await getUserInfo()
// token 会自动从 localStorage 读取并添加到请求头
```

## 🔧 前端实现

### 文件结构
```
src/
├── api/
│   └── login.js          # 登录相关接口
├── utils/
│   └── request.js        # axios 封装
└── store/
    └── user.js           # 用户状态管理（可选）
```

### 1. 接口定义 (src/api/login.js)
```javascript
import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/login/info',
    method: 'get'
  })
}
```

### 2. Axios 封装 (src/utils/request.js)

#### 请求拦截器
```javascript
service.interceptors.request.use(
  config => {
    // 自动添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  }
)
```

#### 响应拦截器
```javascript
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 处理错误码
    if (res.code !== 200) {
      ElMessage.error(res.message)
      
      // token 过期
      if (res.code === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      }
      
      return Promise.reject(new Error(res.message))
    }
    
    return res.data
  }
)
```

### 3. 登录逻辑 (src/views/login/index.vue)
```javascript
import { login, getUserInfo } from '@/api/login'

const handleLogin = async () => {
  try {
    // 1. 调用登录接口
    const token = await login({
      username: loginForm.username,
      password: loginForm.password
    })
    
    // 2. 保存 token
    localStorage.setItem('token', token)
    
    // 3. 获取用户信息
    const userInfo = await getUserInfo()
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
    // 4. 跳转首页
    router.push('/')
  } catch (error) {
    ElMessage.error('登录失败')
  }
}
```

## 🔑 Token 机制

### Token 格式
JWT (JSON Web Token)
```
Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY...
```

### Token 存储
```javascript
// 保存
localStorage.setItem('token', token)

// 读取
const token = localStorage.getItem('token')

// 删除
localStorage.removeItem('token')
```

### Token 使用
所有需要认证的接口自动添加 Authorization 请求头：
```
Authorization: Bearer {token}
```

## 🚨 错误处理

### 前端错误码处理
```javascript
switch (res.code) {
  case 401:
    // 未授权，token 过期
    localStorage.removeItem('token')
    router.push('/login')
    break
    
  case 403:
    // 无权限
    ElMessage.error('没有权限访问')
    break
    
  case 404:
    // 资源不存在
    ElMessage.error('请求的资源不存在')
    break
    
  case 500:
    // 服务器错误
    ElMessage.error('服务器错误')
    break
    
  default:
    ElMessage.error(res.message || '请求失败')
}
```

### HTTP 状态码处理
```javascript
if (error.response) {
  // 服务器返回错误状态码
  const status = error.response.status
  // 根据状态码处理...
} else if (error.request) {
  // 请求已发送，但没有收到响应
  ElMessage.error('网络错误，请检查网络连接')
} else {
  // 请求配置错误
  ElMessage.error('请求配置错误')
}
```

## 🔄 路由守卫

已在 `src/router/index.js` 配置：
```javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path !== '/login' && !token) {
    // 未登录，跳转登录页
    next('/login')
  } else if (to.path === '/login' && token) {
    // 已登录，跳转首页
    next('/')
  } else {
    next()
  }
})
```

## 🧪 接口测试

### 使用 Postman 测试

#### 1. 登录接口
```
POST http://localhost:8080/login/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

#### 2. 获取用户信息
```
GET http://localhost:8080/login/info
Authorization: Bearer {上一步获取的token}
```

### 使用浏览器控制台测试
```javascript
// 打开浏览器控制台（F12）
// 登录
fetch('/api/login/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: '123456' })
})
.then(res => res.json())
.then(console.log)

// 获取用户信息（需要先登录）
const token = localStorage.getItem('token')
fetch('/api/login/info', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(console.log)
```

## 📝 后端 Result 统一响应格式

### Java 实体类
```java
@Data
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage("success");
        result.setData(data);
        return result;
    }
    
    public static <T> Result<T> error(String message) {
        Result<T> result = new Result<>();
        result.setCode(500);
        result.setMessage(message);
        return result;
    }
}
```

### 响应示例
```json
{
  "code": 200,
  "message": "success",
  "data": "token_string_or_user_object"
}
```

## 🔧 环境配置

### 修改后端地址
编辑 `vite.config.js`：
```javascript
proxy: {
  '/api': {
    target: 'http://your-backend-server:port', // 修改这里
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

### 修改后保存，Vite 会自动重启

## 📚 相关文件

- `src/api/login.js` - 登录接口定义
- `src/utils/request.js` - Axios 封装
- `src/views/login/index.vue` - 登录页面
- `src/router/index.js` - 路由守卫
- `vite.config.js` - 代理配置

## 🎯 常见问题

### 1. 跨域问题
✅ 已通过 Vite 代理解决

### 2. Token 失效
✅ 自动检测 401 状态码，清除 token 并跳转登录页

### 3. 请求超时
✅ 已设置 15 秒超时时间

### 4. 网络错误
✅ 统一提示用户检查网络连接

---

**接口对接完成，开始开发吧！** 🚀

