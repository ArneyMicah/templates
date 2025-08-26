import { start as startApp } from './app.js';
import logger from '../utils/logger.js';
import { app as appConfig } from '../config/global.js';
import { connect, disconnect } from '../database/index.js';

/**
 * 服务器管理
 */

// 服务器状态
let server = null;
const port = appConfig.port;

/**
 * 启动服务器
 * @returns {Promise<void>}
 */
export const start = async () => {
  try {
    // 初始化数据库连接
    await initializeDatabase();

    // 启动应用并监听指定端口
    server = await startApp(port);

    // 设置优雅关闭处理
    setupGracefulShutdown();

  } catch (error) {
    logger.error('启动服务器失败:', error);
    process.exit(1);
  }
};

/**
 * 初始化数据库连接
 * @returns {Promise<void>}
 */
const initializeDatabase = async () => {
  try {
    await connect();
    logger.info('数据库连接成功');
  } catch (error) {
    logger.error('初始化数据库失败:', error);
    logger.warn('数据库连接失败，但服务器将继续启动');
  }
};

/**
 * 设置优雅关闭处理
 */
const setupGracefulShutdown = () => {
  const shutdown = async (signal) => {
    logger.info(`收到信号: ${signal}，开始优雅关闭...`);

    try {
      // 关闭数据库连接
      await disconnect();

      if (server && typeof server.close === 'function') {
        // 关闭HTTP服务器
        server.close(() => {
          logger.info('服务器关闭成功');
          process.exit(0);
        });

        // 设置强制关闭超时（10秒）
        setTimeout(() => {
          logger.error('无法在指定时间内关闭连接，强制关闭');
          process.exit(1);
        }, 10000);
      } else {
        logger.info('服务器未运行，直接退出');
        process.exit(0);
      }
    } catch (error) {
      logger.error('优雅关闭过程中发生错误:', error);
      process.exit(1);
    }
  };

  // 监听进程终止信号
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // 处理未捕获的异常
  process.on('uncaughtException', (error) => {
    logger.error('未捕获的异常:', error);
    shutdown('uncaughtException');
  });

  // 处理未处理的Promise拒绝
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('未处理的Promise拒绝:', promise, '原因:', reason);
    shutdown('unhandledRejection');
  });
};

