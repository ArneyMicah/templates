// src/app/app.js
import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import staticServe from 'koa-static';
import mount from 'koa-mount';
import path from 'path';
import { fileURLToPath } from 'url';

// 自定义中间件
import { errorHandler } from '../middlewares/error-handler.js';
import { requestLogger } from '../middlewares/request-logger.js';
import { responseTime } from '../middlewares/response-time.js';
import { rateLimit } from '../middlewares/rate-limit.js';
import { validate } from '../middlewares/validate.js';

// 路由
import router from '../routes/index.js';

// 用户路由
import userRouter from '../routes/user-traditional.js';

// 日志工具
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {
  constructor() {
    this.app = new Koa();

    // 配置中间件
    this.setupMiddlewares();

    // 配置路由
    this.setupRoutes();

    // 配置错误处理
    this.setupErrorHandling();
  }

  setupMiddlewares() {
    // 安全中间件 - 配置CSP以允许Swagger UI
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", "https://unpkg.com"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
    }));

    // 压缩响应
    this.app.use(compress());

    // CORS
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
      credentials: true
    }));

    // 请求体解析
    this.app.use(bodyParser({
      enableTypes: ['json', 'form'],
      jsonLimit: '10mb',
      formLimit: '10mb'
    }));

    // 静态文件（挂载 /public 前缀）
    const publicPath = path.join(__dirname, "../../public");
    this.app.use(mount('/public', staticServe(publicPath)));

    // 自定义中间件（确保返回函数）
    this.app.use(responseTime());
    this.app.use(requestLogger());
    this.app.use(rateLimit());
    this.app.use(validate());
  }

  setupRoutes() {
    // 配置用户路由
    this.app.use(userRouter.routes());
    this.app.use(userRouter.allowedMethods());

    // 配置普通路由
    this.app.use(router.routes());
    this.app.use(router.allowedMethods());
  }

  setupErrorHandling() {
    // 错误处理中间件放到最后
    this.app.use(errorHandler());
  }

  async start(port = 3003) {
    try {
      await this.app.listen(port);
      logger.info(`应用启动成功，监听端口: ${port}`);
      return this.app;
    } catch (error) {
      logger.error('应用启动失败:', error);
      console.error('❌ 应用启动失败:', error.message);
      throw error;
    }
  }

  getApp() {
    return this.app;
  }
}

export default App;
