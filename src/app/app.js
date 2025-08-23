import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import compress from 'koa-compress';

// 导入自定义中间件
import { errorHandler } from '../middlewares/error-handler.js';
import { requestLogger } from '../middlewares/request-logger.js';
import { responseTime } from '../middlewares/response-time.js';
import { rateLimit } from '../middlewares/rate-limit.js';
import { validate } from '../middlewares/validate.js';

// 导入路由和日志工具
import router from '../routes/index.js';
import logger from '../utils/logger.js';

/**
 * Koa应用主类
 * 负责配置中间件、路由和错误处理
 */
class App {
  constructor() {
    this.app = new Koa();
    console.log('🔧 正在初始化Koa应用...');

    // 设置应用配置
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();

    console.log('✅ Koa应用初始化完成');
  }

  /**
   * 配置中间件
   * 按顺序添加各种中间件
   */
  setupMiddlewares() {
    console.log('📦 正在配置中间件...');

    // 安全中间件 - 设置安全头
    this.app.use(helmet());
    console.log('   ✅ 安全中间件 (helmet) 已配置');

    // 压缩响应中间件 - 压缩响应数据
    this.app.use(compress());
    console.log('   ✅ 压缩中间件 (compress) 已配置');

    // CORS中间件 - 处理跨域请求
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
      credentials: true
    }));
    console.log('   ✅ CORS中间件已配置');

    // 请求体解析中间件 - 解析JSON和表单数据
    this.app.use(bodyParser({
      enableTypes: ['json', 'form'],
      jsonLimit: '10mb',
      formLimit: '10mb'
    }));
    console.log('   ✅ 请求体解析中间件已配置');

    // 自定义中间件
    this.app.use(responseTime());    // 响应时间记录
    this.app.use(requestLogger());   // 请求日志记录
    this.app.use(rateLimit());      // 限流控制
    this.app.use(validate());       // 请求验证
    console.log('   ✅ 自定义中间件已配置');
  }

  /**
   * 配置路由
   * 添加API路由到应用
   */
  setupRoutes() {
    console.log('🛣️  正在配置路由...');

    // 添加路由中间件
    this.app.use(router.routes());
    this.app.use(router.allowedMethods());

    console.log('   ✅ 路由配置完成');
  }

  /**
   * 配置错误处理
   * 添加全局错误处理中间件
   */
  setupErrorHandling() {
    console.log('🚨 正在配置错误处理...');

    // 添加错误处理中间件
    this.app.use(errorHandler());

    console.log('   ✅ 错误处理配置完成');
  }

  /**
   * 启动应用
   * @param {number} port - 监听端口
   * @returns {Promise<import('http').Server>}
   */
  async start(port) {
    try {
      console.log(`🚀 正在启动应用，端口: ${port}`);

      // 启动HTTP服务器
      await this.app.listen(port);

      logger.info(`应用启动成功，监听端口: ${port}`);
      console.log(`✅ 应用启动成功！监听端口: ${port}`);

      return this.app;
    } catch (error) {
      logger.error('应用启动失败:', error);
      console.error('❌ 应用启动失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取应用实例
   * @returns {Koa}
   */
  getApp() {
    return this.app;
  }
}

export default App;



