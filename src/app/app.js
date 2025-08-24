// src/app/app.js
import Koa from 'koa';
import cors from '@koa/cors';
import { cors as corsConfig, staticFiles } from '../config/global.js';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import staticServe from 'koa-static';
import mount from 'koa-mount';

// 自定义中间件
import { errorHandler } from '../middlewares/error-handler.js';
import { requestLogger } from '../middlewares/request-logger.js';
import { responseTime } from '../middlewares/response-time.js';
import { rateLimit } from '../middlewares/rate-limit.js';
import { validate } from '../middlewares/validate.js';
import { jsonParser } from '../middlewares/json-parser.js';

// Swagger工具
import { getSwaggerConfig } from '../utils/swagger.js';
import { getAllSwaggerPaths, getSwaggerInfo } from '../../docs/index.js';

// 路由
import router from '../routes/index.js';

// 日志工具
import logger from '../utils/logger.js';

class App {
  constructor() {
    this.app = new Koa();
    this.setupMiddlewares();
    this.setupSwagger();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddlewares() {
    // 安全中间件 - 配置CSP以允许Swagger UI
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://cdnjs.cloudflare.com",
            "https://unpkg.com"
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://cdnjs.cloudflare.com",
            "https://unpkg.com",
            "https://fonts.googleapis.com"
          ],
          imgSrc: [
            "'self'",
            "data:",
            "https:"
          ],
          connectSrc: [
            "'self'"
          ],
          fontSrc: [
            "'self'",
            "https://cdnjs.cloudflare.com",
            "https://unpkg.com",
            "https://fonts.googleapis.com",
            "https://fonts.gstatic.com"
          ]
        }
      }
    }));

    // 压缩响应
    this.app.use(compress());

    // CORS
    this.app.use(cors({
      origin: corsConfig.allowedOrigins,
      credentials: corsConfig.credentials,
      allowMethods: corsConfig.methods,
      allowHeaders: corsConfig.headers
    }));

    // 请求体解析
    this.app.use(bodyParser({
      enableTypes: ['json', 'form'],
      jsonLimit: '10mb',
      formLimit: '10mb',
      onerror: (err, ctx) => {
        logger.error('请求体解析错误:', {
          error: err.message,
          path: ctx.path,
          method: ctx.method,
          contentType: ctx.get('Content-Type')
        });

        ctx.status = 400;
        ctx.body = {
          success: false,
          error: {
            message: '请求体格式错误',
            details: '请检查JSON格式是否正确'
          }
        };
      }
    }));

    // 静态文件
    this.app.use(mount(staticFiles.url, staticServe(staticFiles.path, {
      maxAge: staticFiles.maxAge
    })));

    // 自定义中间件
    this.app.use(responseTime());
    this.app.use(requestLogger());
    this.app.use(jsonParser());
    this.app.use(rateLimit());
    this.app.use(validate());
  }

  setupSwagger() {
    // 获取Swagger配置
    const swaggerConfig = getSwaggerConfig();

    // 设置基础信息
    const swaggerInfo = getSwaggerInfo();
    swaggerConfig.setInfo(swaggerInfo);

    // 添加所有接口路径
    const allPaths = getAllSwaggerPaths();
    swaggerConfig.addSpec({ paths: allPaths });

    logger.info('Swagger文档已加载，接口数量:', Object.keys(allPaths).length);

    // 添加Swagger JSON端点
    this.app.use(swaggerConfig.getJsonMiddleware());

    // 添加Swagger UI
    this.app.use(swaggerConfig.getMiddleware('/api-docs'));

    logger.info('Swagger文档已配置，访问地址: http://localhost:3000/api-docs');
  }

  setupRoutes() {
    this.app.use(router.routes());
    this.app.use(router.allowedMethods());
  }

  setupErrorHandling() {
    this.app.use(errorHandler());
  }

  async start(port = 3000) {
    try {
      await this.app.listen(port);
      logger.info(`应用启动成功，监听端口: ${port}`);
      return this.app;
    } catch (error) {
      logger.error('应用启动失败:', error);
      throw error;
    }
  }

  getApp() {
    return this.app;
  }
}

export default App;
