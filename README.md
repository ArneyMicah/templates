# Koa Project API

基于 Koa.js 构建的现代化 Web API 服务，提供完整的 RESTful API 接口和交互式文档。

## 🚀 项目特性

- **现代化架构**: 基于 Koa.js 和 ES6+ 模块化设计
- **完整文档**: 集成 Swagger/OpenAPI 3.0 规范
- **安全防护**: 内置 CORS、Helmet、限流等安全中间件
- **错误处理**: 统一的错误处理和日志记录
- **开发友好**: 详细的日志输出和调试信息

## 📦 项目结构

```
koa-project/
├── main.js                 # 应用入口文件
├── package.json            # 项目配置和依赖
├── public/                 # 静态文件目录
│   ├── swagger.html        # Swagger UI 界面
│   ├── test.html           # API 测试页面
│   └── index.html          # 项目主页
├── src/                    # 源代码目录
│   ├── app/                # 应用核心
│   │   ├── app.js          # Koa 应用配置
│   │   └── server.js       # 服务器管理
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器层（使用装饰器）
│   ├── middlewares/        # 中间件
│   ├── routes/             # 路由定义
│   ├── services/           # 业务逻辑层
│   ├── utils/              # 工具函数
│   └── constants/          # 常量定义
├── tests/                  # 测试目录
│   ├── setup.js            # 测试设置
│   ├── unit/               # 单元测试
│   └── integration/        # 集成测试
│       ├── user-crud.test.js    # 用户CRUD测试
│       ├── swagger.test.js      # Swagger文档测试
│       └── csp.test.js          # CSP配置测试
├── logs/                   # 日志文件
├── README.md               # 项目说明
├── USER_CRUD_README.md     # 用户CRUD文档
├── PROJECT_STRUCTURE.md    # 项目结构说明
├── OPTIMIZATION_SUMMARY.md # 优化总结
└── CONSOLE_CLEANUP_SUMMARY.md # 控制台清理总结
```

## 🛠️ 安装和运行

### 环境要求

- Node.js >= 16.0.0
- npm 或 pnpm

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

### 测试

```bash
# 运行所有Jest测试
npm test

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage

# 集成测试
npm run test:integration    # 用户CRUD测试
npm run test:swagger        # Swagger文档测试
npm run test:csp           # CSP配置测试
```

## 📚 API 文档

### Swagger 文档访问

项目集成了完整的 Swagger/OpenAPI 3.0 文档系统：

- **Swagger UI**: http://localhost:3003/public/swagger.html
- **API 规范**: http://localhost:3003/docs/swagger.json
- **文档信息**: http://localhost:3003/docs/info

### 主要接口

#### 健康检查

- `GET /health` - 系统健康检查
- `GET /info` - 系统详细信息
- `GET /api` - API 基本信息

#### Swagger 文档

- `GET /docs/swagger` - Swagger 文档主页
- `GET /docs/swagger.json` - OpenAPI 规范
- `GET /docs/ui` - UI 配置信息
- `GET /docs/info` - 文档元信息

## 🔧 项目优化

### 已完成的优化

1. **项目结构优化**

   - 将测试文件整理到 `tests/` 目录
   - 创建了 `tests/integration/` 目录用于集成测试
   - 删除了冗余的 `src/utils/swagger.js` 文件（使用装饰器）

2. **控制台打印清理**

   - 删除了大量不必要的调试打印信息
   - 保留了重要的错误日志（使用 winston logger）
   - 提高了生产环境的性能和日志清晰度

3. **Swagger 文档优化**

   - 使用 `koa-swagger-decorator` 装饰器自动生成文档
   - 删除了手动配置的 swagger.js 文件
   - 简化了 API 文档维护

4. **代码质量提升**

   - 添加了详细的中文注释
   - 优化了代码可读性和维护性
   - 完善了错误处理机制

5. **测试体系完善**
   - 新增了专门的集成测试命令
   - 测试文件命名更规范
   - 项目文档更完善

### 技术栈

- **框架**: Koa.js 3.x
- **路由**: @koa/router
- **中间件**:
  - koa-helmet (安全头)
  - koa-cors (跨域处理)
  - koa-compress (响应压缩)
  - koa-static (静态文件)
  - koa-bodyparser (请求体解析)
- **日志**: Winston
- **文档**: Swagger/OpenAPI 3.0

## 🚨 问题解决

### Swagger 文档 404 问题

**问题原因**:

1. 缺少静态文件中间件配置
2. 路由配置不完整
3. 安全策略阻止了静态文件访问

**解决方案**:

1. 在 `src/app/app.js` 中添加了 `koa-static` 中间件
2. 配置了正确的静态文件路径
3. 优化了 Helmet 安全策略，允许 Swagger UI 资源加载
4. 完善了 Swagger 路由的错误处理

### 访问地址

启动服务后，可以通过以下地址访问：

- **Swagger 文档**: http://localhost:3003/public/swagger.html
- **API 测试页面**: http://localhost:3003/public/test.html
- **健康检查**: http://localhost:3003/health
- **系统信息**: http://localhost:3003/info

## 🔍 开发调试

### 日志输出

项目配置了详细的日志输出，包括：

- 服务器启动信息
- 路由加载状态
- 中间件配置过程
- 请求处理日志

### 环境变量

支持通过环境变量配置：

```bash
NODE_ENV=development  # 运行环境
APP_PORT=3003        # 服务端口
ALLOWED_ORIGINS=*    # 允许的跨域来源
```

## 📝 开发指南

### 添加新路由

1. 在 `src/routes/` 目录下创建新的路由文件
2. 导出路由实例
3. 路由会自动被加载和注册

### 添加新中间件

1. 在 `src/middlewares/` 目录下创建中间件
2. 在 `src/app/app.js` 中注册中间件

### 使用装饰器生成 API 文档

1. 在控制器中使用 `koa-swagger-decorator` 装饰器
2. 装饰器会自动生成 Swagger 文档
3. 无需手动维护 swagger 配置文件

```javascript
@request('get', '/users')
@summary('获取用户列表')
@tag
@query({
    page: { type: 'number', required: false, description: '页码', default: 1 },
    limit: { type: 'number', required: false, description: '每页数量', default: 10 }
})
@responses({
    200: {
        description: '用户列表获取成功',
        schema: { /* 响应模式 */ }
    }
})
static async getUsers(ctx) {
    // 控制器逻辑
}
```

## 📚 项目文档

项目包含以下详细文档：

- **README.md** - 项目主要说明文档
- **USER_CRUD_README.md** - 用户 CRUD 功能详细文档
- **PROJECT_STRUCTURE.md** - 项目结构详细说明
- **OPTIMIZATION_SUMMARY.md** - 项目优化总结
- **CONSOLE_CLEANUP_SUMMARY.md** - 控制台打印清理总结

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱: dev@example.com
- 项目地址: [GitHub Repository]

---

**注意**: 这是一个开发环境的配置，生产环境部署时请根据实际情况调整配置参数。
