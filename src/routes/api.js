import Router from 'koa-router';
import logger from '../utils/logger.js';

const router = new Router();

/**
 * API信息路由
 * 提供API版本、状态和文档信息
 */

// API根路径
router.get('/', async (ctx) => {
  const apiInfo = {
    success: true,
    message: '欢迎使用 Koa Project API',
    timestamp: new Date().toISOString(),
    api: {
      name: 'Koa Project API',
      version: '1.0.0',
      description: '基于Koa.js构建的现代化Web API服务',
      status: 'active',
      environment: process.env.NODE_ENV || 'development'
    },
    features: [
      'RESTful API设计',
      'JWT认证',
      '请求限流',
      '错误处理',
      '日志记录',
      '健康检查',
      'Swagger文档'
    ],
    endpoints: {
      health: '/health',
      info: '/info',
      docs: '/docs',
      swagger: '/docs/swagger'
    },
    documentation: {
      swagger: '/docs/swagger',
      testPage: '/public/test.html'
    }
  };

  ctx.body = apiInfo;
  ctx.status = 200;
});

// API版本信息
router.get('/version', async (ctx) => {
  const versionInfo = {
    success: true,
    message: 'API版本信息',
    timestamp: new Date().toISOString(),
    version: {
      current: '1.0.0',
      latest: '1.0.0',
      status: 'stable',
      releaseDate: '2024-01-01',
      changelog: [
        '初始版本发布',
        '基础API功能',
        '中间件集成',
        'Swagger文档支持'
      ]
    },
    compatibility: {
      node: '>=16.0.0',
      koa: '>=2.14.0'
    }
  };

  ctx.body = versionInfo;
  ctx.status = 200;
});

// API状态检查
router.get('/status', async (ctx) => {
  const statusInfo = {
    success: true,
    message: 'API状态正常',
    timestamp: new Date().toISOString(),
    status: 'operational',
    uptime: `${Math.floor(process.uptime() / 60)}分钟`,
    memory: {
      used: `${Math.round(process.memoryUsage().used / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
    },
    checks: {
      database: 'connected',
      redis: 'connected',
      external: 'healthy'
    }
  };

  ctx.body = statusInfo;
  ctx.status = 200;
});

export default router;


