# PageHelper 分页结构说明 📄

## 📊 后端返回的数据结构

### 完整响应格式
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 1,              // 总记录数
    "list": [...],           // 当前页数据列表
    "pageNum": 1,            // 当前页码
    "pageSize": 10,          // 每页大小
    "size": 1,               // 当前页实际数据条数
    "startRow": 0,           // 起始行号
    "endRow": 0,             // 结束行号
    "pages": 1,              // 总页数
    "prePage": 0,            // 上一页页码
    "nextPage": 0,           // 下一页页码
    "isFirstPage": true,     // 是否第一页
    "isLastPage": true,      // 是否最后一页
    "hasPreviousPage": false, // 是否有上一页
    "hasNextPage": false,    // 是否有下一页
    "navigatePages": 8,      // 导航页码数
    "navigatepageNums": [1], // 导航页码列表
    "navigateFirstPage": 1,  // 导航首页
    "navigateLastPage": 1    // 导航尾页
  }
}
```

## 🔑 核心字段说明

### 必用字段

| 字段 | 类型 | 说明 | 用途 |
|------|------|------|------|
| `list` | Array | 当前页数据列表 | 显示表格数据 |
| `total` | Number | 总记录数 | 分页组件显示总数 |
| `pageNum` | Number | 当前页码 | 确认当前页 |
| `pageSize` | Number | 每页大小 | 确认每页显示数量 |
| `pages` | Number | 总页数 | 分页导航 |

### 辅助字段

| 字段 | 类型 | 说明 | 使用场景 |
|------|------|------|----------|
| `hasNextPage` | Boolean | 是否有下一页 | 禁用"下一页"按钮 |
| `hasPreviousPage` | Boolean | 是否有上一页 | 禁用"上一页"按钮 |
| `isFirstPage` | Boolean | 是否第一页 | 首页判断 |
| `isLastPage` | Boolean | 是否最后一页 | 末页判断 |
| `navigatepageNums` | Array | 导航页码 | 自定义分页器 |

## 💻 前端处理

### 1. 数据提取
```javascript
const data = await getUserList(params)

// 提取列表数据
userList.value = data.list

// 提取总数
pagination.total = data.total
```

### 2. 完整示例
```javascript
const loadUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    
    const data = await getUserList(params)
    
    // 后端返回 PageHelper 分页结构
    if (data && data.list) {
      userList.value = data.list
      pagination.total = data.total
      
      console.log('分页信息：', {
        当前页: data.pageNum,
        每页数量: data.pageSize,
        总记录数: data.total,
        总页数: data.pages,
        数据条数: data.list.length
      })
    } else {
      userList.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取用户列表失败：', error)
    ElMessage.error('获取用户列表失败，请稍后重试')
    userList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}
```

### 3. 分页组件配置
```vue
<el-pagination
  v-model:current-page="pagination.page"
  v-model:page-size="pagination.pageSize"
  :page-sizes="[10, 20, 50, 100]"
  :total="pagination.total"
  layout="total, sizes, prev, pager, next, jumper"
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
/>
```

## 🎯 实际响应示例

### 示例 1：第一页（有数据）
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 1,
    "list": [
      {
        "id": 4,
        "username": "xhonell",
        "email": "549847214@qq.com",
        "createTime": "2025-10-19T13:41:14",
        "updateTime": "2025-10-19T13:41:14",
        "role": 2,
        "avatarId": null,
        "phone": null,
        "status": false,
        "avatarUrl": null
      }
    ],
    "pageNum": 1,
    "pageSize": 1,
    "pages": 1,
    "size": 1,
    "isFirstPage": true,
    "isLastPage": true,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### 示例 2：中间页（多数据）
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 100,
    "list": [
      { "id": 21, "username": "user21", ... },
      { "id": 22, "username": "user22", ... },
      // ... 共 10 条
    ],
    "pageNum": 3,
    "pageSize": 10,
    "pages": 10,
    "size": 10,
    "isFirstPage": false,
    "isLastPage": false,
    "hasNextPage": true,
    "hasPreviousPage": true,
    "prePage": 2,
    "nextPage": 4,
    "navigatepageNums": [1, 2, 3, 4, 5, 6, 7, 8]
  }
}
```

### 示例 3：空数据
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 0,
    "list": [],
    "pageNum": 1,
    "pageSize": 10,
    "pages": 0,
    "size": 0,
    "isFirstPage": true,
    "isLastPage": true,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

## 🔧 后端配置

### PageHelper 使用
```java
// Controller
@GetMapping("/list")
public Result<PageInfo<RedisUser>> list(UserListRequest request) {
    return Result.success(userService.selectList(request));
}

// Service
public PageInfo<RedisUser> selectList(UserListRequest request) {
    // 开启分页
    PageUtils.startPage(request.getPage(), request.getPageSize());
    
    // 查询数据
    List<RedisUser> list = userMapper.selectList(request);
    
    // 包装为 PageInfo
    return new PageInfo<>(list);
}
```

### PageUtils 工具类
```java
public class PageUtils {
    public static void startPage(Integer pageNum, Integer pageSize) {
        if (pageNum != null && pageSize != null) {
            PageHelper.startPage(pageNum, pageSize);
        }
    }
}
```

## 📝 字段详解

### 分页计算字段

#### total（总记录数）
- 数据库中符合条件的总记录数
- 用于计算总页数
- 显示在分页组件中

#### pages（总页数）
```
计算公式：pages = Math.ceil(total / pageSize)
示例：total=100, pageSize=10 → pages=10
```

#### pageNum（当前页码）
- 从 1 开始
- 对应请求参数中的 page

#### size（当前页实际数据条数）
- 通常等于 pageSize
- 最后一页可能小于 pageSize
```
示例：total=25, pageSize=10
- 第1页：size=10
- 第2页：size=10
- 第3页：size=5
```

### 行号字段

#### startRow（起始行号）
```
计算公式：startRow = (pageNum - 1) * pageSize
示例：pageNum=3, pageSize=10 → startRow=20
```

#### endRow（结束行号）
```
计算公式：endRow = startRow + size - 1
示例：startRow=20, size=10 → endRow=29
```

### 导航字段

#### navigatePages（导航页码数）
- 默认为 8
- 可配置：`PageHelper.startPage(pageNum, pageSize, navigatePages)`

#### navigatepageNums（导航页码列表）
```
示例：当前第5页，总共10页，navigatePages=8
navigatepageNums = [2, 3, 4, 5, 6, 7, 8, 9]
```

## ⚠️ 注意事项

### 1. 空数据处理
```javascript
if (data && data.list) {
  userList.value = data.list
  pagination.total = data.total
} else {
  userList.value = []
  pagination.total = 0
}
```

### 2. 错误处理
```javascript
catch (error) {
  console.error('获取用户列表失败：', error)
  ElMessage.error('获取用户列表失败，请稍后重试')
  userList.value = []
  pagination.total = 0
}
```

### 3. 页码校验
```javascript
// 删除数据后，如果当前页为空且不是第一页，回到上一页
if (userList.value.length === 0 && pagination.page > 1) {
  pagination.page--
  loadUserList()
}
```

### 4. 请求参数
```javascript
const params = {
  page: pagination.page,      // 后端：pageNum
  pageSize: pagination.pageSize, // 后端：pageSize
  username: searchForm.username,
  email: searchForm.email,
  role: searchForm.role
}
```

## 🎨 前端分页状态

### 分页对象定义
```javascript
const pagination = reactive({
  page: 1,        // 当前页码
  pageSize: 10,   // 每页数量
  total: 0        // 总记录数（从后端获取）
})
```

### 分页事件处理
```javascript
// 页码改变
const handleCurrentChange = (page) => {
  pagination.page = page
  loadUserList()
}

// 每页数量改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1  // 重置到第一页
  loadUserList()
}
```

## 🔍 调试技巧

### 1. 打印分页信息
```javascript
console.log('分页信息：', {
  当前页: data.pageNum,
  每页数量: data.pageSize,
  总记录数: data.total,
  总页数: data.pages,
  数据条数: data.list.length,
  是否第一页: data.isFirstPage,
  是否最后一页: data.isLastPage
})
```

### 2. 检查请求参数
```javascript
console.log('请求参数：', params)
// { page: 1, pageSize: 10, username: '', email: '', role: null }
```

### 3. 检查响应数据
```javascript
console.log('响应数据：', data)
```

## 📊 完整流程

```
用户操作 → 改变页码/每页数量
    ↓
前端构建请求参数 { page, pageSize, ... }
    ↓
发送 GET 请求到 /user/list
    ↓
后端 PageHelper.startPage(page, pageSize)
    ↓
后端执行 SQL 查询
    ↓
后端包装为 PageInfo 返回
    ↓
前端提取 data.list 和 data.total
    ↓
更新表格数据和分页组件
    ↓
显示给用户
```

## ✅ 集成检查清单

- [x] 提取 `data.list` 作为表格数据
- [x] 提取 `data.total` 作为总记录数
- [x] 分页组件绑定 `pagination.page`
- [x] 分页组件绑定 `pagination.pageSize`
- [x] 分页组件设置 `:total="pagination.total"`
- [x] 页码改变事件处理
- [x] 每页数量改变事件处理
- [x] 空数据处理
- [x] 错误处理
- [x] 加载状态显示

---

**PageHelper 分页结构已完美对接！** 🎉

