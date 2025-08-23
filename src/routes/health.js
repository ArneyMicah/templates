import Router from 'koa-router';
import logger from '../utils/logger.js';

const router = new Router();

/**
 * 健康检查路由
 * 提供系统状态和健康信息
 */

// 根路径健康检查
router.get('/', async (ctx) => {
  console.log('🏥 收到健康检查请求');
  
  // 获取系统信息
  const systemInfo = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    pid: process.pid
  };
  
  // 构建健康检查响应
  const healthStatus = {
    success: true,
    message: '系统运行正常',
    timestamp: new Date().toISOString(),
    status: 'healthy',
    system: {
      uptime: `${Math.floor(systemInfo.uptime / 60)}分钟`,
      memory: {
        used: `${Math.round(systemInfo.memory.used / 1024 / 1024)}MB`,
        total: `${Math.round(systemInfo.memory.heapTotal / 1024 / 1024)}MB`,
        free: `${Math.round(systemInfo.memory.heapUsed / 1024 / 1024)}MB`
      },
      platform: systemInfo.platform,
      nodeVersion: systemInfo.nodeVersion,
      pid: systemInfo.pid
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };
  
  // 设置响应头
  ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  ctx.set('Pragma', 'no-cache');
  ctx.set('Expires', '0');
  
  // 返回健康状态
  ctx.body = healthStatus;
  ctx.status = 200;
  
  console.log('✅ 健康检查完成', {
    status: healthStatus.status,
    uptime: healthStatus.system.uptime,
    memory: healthStatus.system.memory.used
  });
});

// 详细系统信息
router.get('/info', async (ctx) => {
  console.log('📊 收到系统信息请求');
  
  const detailedInfo = {
    success: true,
    message: '系统详细信息',
    timestamp: new Date().toISOString(),
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      env: process.env.NODE_ENV || 'development'
    },
    process: {
      title: process.title,
      version: process.version,
      versions: process.versions,
      config: process.config,
      release: process.release
    }
  };
  
  ctx.body = detailedInfo;
  ctx.status = 200;
  
  console.log('✅ 系统信息查询完成');
});

// 轻量级健康检查（用于负载均衡器）
router.get('/ping', async (ctx) => {
  ctx.body = {
    success: true,
    message: 'pong',
    timestamp: new Date().toISOString()
  };
  ctx.status = 200;
});

export default router;


