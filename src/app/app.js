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
import { getAllSwaggerPaths, getAllSwaggerSchemas, getSwaggerInfo } from '../../docs/index.js';

// 路由
import router from '../routes/index.js';

// 日志工具
import logger from '../utils/logger.js';

// Koa应用实例
let app = null;

/**
 * 设置中间件
 */
const setupMiddlewares = () => {
  // 安全中间件 - 配置CSP以允许Swagger UI
  app.use(helmet({
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
  app.use(compress());

  // CORS
  app.use(cors({
    origin: corsConfig.allowedOrigins,
    credentials: corsConfig.credentials,
    allowMethods: corsConfig.methods,
    allowHeaders: corsConfig.headers
  }));

  // 请求体解析
  app.use(bodyParser({
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
  app.use(mount(staticFiles.url, staticServe(staticFiles.path, {
    maxAge: staticFiles.maxAge
  })));

  // 自定义中间件
  app.use(responseTime());
  app.use(requestLogger());
  app.use(jsonParser());
  app.use(rateLimit());
  app.use(validate());
};

/**
 * 设置Swagger
 */
const setupSwagger = () => {
  // 获取Swagger配置
  const swaggerConfig = getSwaggerConfig();

  // 设置基础信息
  const swaggerInfo = getSwaggerInfo();
  swaggerConfig.setInfo(swaggerInfo);

  // 添加所有接口路径和schema
  const allPaths = getAllSwaggerPaths();
  const allSchemas = getAllSwaggerSchemas();
  swaggerConfig.addSpec({
    paths: allPaths,
    components: {
      schemas: allSchemas
    }
  });

  // Swagger文档已加载

  // 添加Swagger JSON端点
  app.use(swaggerConfig.getJsonMiddleware());

  // 添加Swagger UI
  app.use(swaggerConfig.getMiddleware('/api-docs'));

  // Swagger文档已配置，访问地址: http://localhost:3000/api-docs
};

/**
 * 设置路由
 */
const setupRoutes = () => {
  app.use(router.routes());
  app.use(router.allowedMethods());
};

/**
 * 设置错误处理
 */
const setupErrorHandling = () => {
  app.use(errorHandler());
};

/**
 * 启动应用
 * @param {number} port - 端口号
 * @returns {Promise<Object>} Koa应用实例
 */
export const start = async (port = 3000) => {
  try {
    // 创建Koa应用实例
    app = new Koa();

    // 设置中间件
    setupMiddlewares();
    setupSwagger();
    setupRoutes();
    setupErrorHandling();

    // 启动应用
    await app.listen(port);
    // 应用启动成功
    return app;
  } catch (error) {
    logger.error('应用启动失败:', error);
    throw error;
  }
};

/**
 * 获取应用实例
 * @returns {Object} Koa应用实例
 */
export const getApp = () => {
  return app;
};

/**
 * 创建应用实例
 * @returns {Object} 应用对象
 */
export const createApp = () => {
  // 创建Koa应用实例
  app = new Koa();

  // 设置中间件
  setupMiddlewares();
  setupSwagger();
  setupRoutes();
  setupErrorHandling();

  return {
    app,
    start: (port = 3000) => start(port),
    getApp: () => app
  };
};

// 默认导出
export default createApp;
