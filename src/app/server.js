import App from './app.js';
import logger from '../utils/logger.js';

// 动态导入配置文件
const env = process.env.NODE_ENV || 'development';
const configModule = await import(`../config/config.${env}.js`);
const { APP_PORT } = configModule;

/**
 * 服务器管理类
 * 负责服务器的启动、关闭和进程信号处理
 */
class Server {
  constructor() {
    this.app = new App(); // 创建Koa应用实例
    this.server = null;   // 存储HTTP服务器实例
  }

  /**
   * 启动服务器
   * @returns {Promise<void>}
   */
  async start() {
    try {
      console.log(`🌐 正在启动服务器，端口: ${APP_PORT}`);

      // 启动应用并监听指定端口
      this.server = await this.app.start(APP_PORT);

      // 设置优雅关闭处理
      this.setupGracefulShutdown();

      // 记录启动成功日志
      logger.info(`服务器启动成功，运行在端口: ${APP_PORT}`);
      console.log(`✅ 服务器启动成功！地址: http://localhost:${APP_PORT}`);

    } catch (error) {
      logger.error('启动服务器失败:', error);
      console.error('❌ 启动服务器失败:', error.message);
      process.exit(1);
    }
  }

  /**
   * 设置优雅关闭处理
   * 处理各种进程信号和异常情况
   */
  setupGracefulShutdown() {
    const shutdown = (signal) => {
      logger.info(`收到信号: ${signal}，开始优雅关闭...`);
      console.log(`\n🔄 收到信号: ${signal}，正在优雅关闭服务器...`);

      if (this.server && typeof this.server.close === 'function') {
        // 关闭HTTP服务器
        this.server.close(() => {
          logger.info('服务器关闭成功');
          console.log('✅ 服务器已成功关闭');
          process.exit(0);
        });

        // 设置强制关闭超时（10秒）
        setTimeout(() => {
          logger.error('无法在指定时间内关闭连接，强制关闭');
          console.log('⚠️  无法在10秒内关闭连接，强制关闭服务器');
          process.exit(1);
        }, 10000);
      } else {
        logger.info('服务器未运行，直接退出');
        console.log('ℹ️  服务器未运行，直接退出');
        process.exit(0);
      }
    };

    // 监听进程终止信号
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // 处理未捕获的异常
    process.on('uncaughtException', (error) => {
      logger.error('未捕获的异常:', error);
      console.error('💥 未捕获的异常:', error.message);
      shutdown('uncaughtException');
    });

    // 处理未处理的Promise拒绝
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('未处理的Promise拒绝:', promise, '原因:', reason);
      console.error('💥 未处理的Promise拒绝:', reason);
      shutdown('unhandledRejection');
    });
  }
}

export default Server;

