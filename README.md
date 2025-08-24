# Koa 项目 - 用户管理 API

基于 Koa.js 构建的简洁用户管理 API 服务，提供完整的用户 CRUD 操作和 Swagger 文档。

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或者使用 pnpm
pnpm install
```

### 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务启动后，访问以下地址：

- **首页**: http://localhost:3000/
- **API 文档**: http://localhost:3000/docs
- **Swagger UI**: http://localhost:3000/api-docs
- **API 规范**: http://localhost:3000/swagger.json
- **健康检查**: http://localhost:3000/health

## 📚 API 文档

### 用户管理 API

项目提供完整的用户 CRUD 操作：

- **GET** `/api/users` - 获取用户列表（支持分页）
- **POST** `/api/users` - 创建新用户
- **GET** `/api/users/:id` - 根据ID获取用户详情
- **PUT** `/api/users/:id` - 更新用户信息
- **DELETE** `/api/users/:id` - 删除用户

### Swagger UI 访问

1. **直接访问**: http://localhost:3000/public/swagger-ui.html
2. **重定向访问**: http://localhost:3000/docs
3. **中间件访问**: http://localhost:3000/api-docs

## 🛠️ 技术栈

- **框架**: Koa.js
- **路由**: @koa/router
- **安全**: koa-helmet, CORS
- **验证**: Joi
- **日志**: Winston
- **文档**: Swagger UI
- **静态文件**: koa-static

## 📁 项目结构

```
koa-project/
├── docs/                 # Swagger 文档配置
├── public/              # 静态文件
│   ├── index.html       # 首页
│   └── swagger-ui.html  # API 文档页面
├── src/
│   ├── app/            # 应用配置
│   ├── config/         # 配置文件
│   ├── controllers/    # 控制器
│   ├── middlewares/    # 中间件
│   ├── routes/         # 路由
│   ├── services/       # 服务层
│   └── utils/          # 工具函数
├── main.js             # 应用入口
├── test-users.js       # 用户API测试
└── package.json        # 项目配置
```

## 🔧 开发

### 测试用户 API

运行测试脚本验证用户 CRUD 功能：

```bash
node test-users.js
```

### 添加新的 API 接口

1. 在 `docs/` 目录下创建对应的 Swagger 配置文件
2. 在 `src/routes/` 目录下添加路由文件
3. 在 `src/controllers/` 目录下添加控制器
4. 更新 `docs/index.js` 导入新的路径配置

## 🚨 故障排除

### 常见问题

1. **Swagger UI 无法加载**

   - 检查网络连接
   - 确认 `/swagger.json` 端点可访问
   - 查看浏览器控制台错误信息

2. **API 文档为空**

   - 确认 Swagger 路径配置正确
   - 检查 `docs/` 目录下的配置文件
   - 验证路由是否正确注册

3. **静态文件无法访问**
   - 确认 `public/` 目录存在
   - 检查静态文件中间件配置
   - 验证文件权限

## 📝 更新日志

### v1.1.0 (最新)

- ✅ 精简项目结构，只保留用户 CRUD 功能
- ✅ 移除批量操作和统计功能
- ✅ 简化启动信息和日志输出
- ✅ 优化代码结构，提高可维护性

### v1.0.0

- ✅ 修复 Swagger UI 加载问题
- ✅ 优化 CDN 链接稳定性
- ✅ 增强错误处理机制
- ✅ 改进用户体验
- ✅ 完善响应式设计

## �� 许可证

ISC License
