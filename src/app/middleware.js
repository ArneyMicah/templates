import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import compress from 'koa-compress';

import { errorHandler } from '../middlewares/error-handler.js';
import { requestLogger } from '../middlewares/request-logger.js';
import { responseTime } from '../middlewares/response-time.js';
import { rateLimit } from '../middlewares/rate-limit.js';
import { validate } from '../middlewares/validate.js';

export const setupMiddlewares = (app) => {
  // 安全中间件
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
  
  // 压缩响应
  app.use(compress({
    filter(content_type) {
      return /text|javascript|json|xml/i.test(content_type);
    },
    threshold: 2048,
    gzip: {
      flush: require('zlib').constants.Z_SYNC_FLUSH,
    },
    deflate: {
      flush: require('zlib').constants.Z_SYNC_FLUSH,
    },
    br: false,
  }));
  
  // CORS
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }));
  
  // 请求体解析
  app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb',
    strict: true,
    onerror: (err, ctx) => {
      ctx.throw(422, 'body parse error');
    },
  }));
  
  // 自定义中间件
  app.use(responseTime());
  app.use(requestLogger());
  app.use(rateLimit());
  app.use(validate());
};

export const setupErrorHandling = (app) => {
  app.use(errorHandler());
};



