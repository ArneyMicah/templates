import { app as appConfig } from '../config/global.js';
import logger from '../utils/logger.js';

/**
 * 全局错误处理中间件
 * 捕获并处理应用中发生的所有错误
 * @returns {Function} Koa中间件函数
 */
export const errorHandler = () => {
  return async (ctx, next) => {
    try {
      // 继续执行下一个中间件
      await next();
    } catch (error) {
      // 处理JSON解析错误
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        logger.warn('JSON解析错误:', {
          message: error.message,
          path: ctx.path,
          method: ctx.method,
          contentType: ctx.get('Content-Type'),
          body: ctx.request.body
        });

        ctx.status = 400;
        ctx.body = {
          success: false,
          error: {
            message: 'JSON格式错误',
            details: '请求体必须是有效的JSON格式',
            status: 400,
            timestamp: new Date().toISOString(),
            path: ctx.path,
            method: ctx.method
          }
        };
        return;
      }

      // 设置错误状态码
      const status = error.status || error.statusCode || 500;

      // 设置响应状态
      ctx.status = status;

      // 构建错误响应体
      const errorBody = {
        success: false,
        error: {
          message: error.message || '服务器内部错误',
          status: status,
          timestamp: new Date().toISOString(),
          path: ctx.path,
          method: ctx.method
        }
      };

      // 开发环境下添加更多调试信息
      if (appConfig.env === 'development') {
        errorBody.error.stack = error.stack;
        errorBody.error.details = error.details || {};
      }

      // 设置响应头
      ctx.set('Content-Type', 'application/json');

      // 发送错误响应
      ctx.body = errorBody;

      // 记录错误到日志系统
      if (status >= 500) {
        // 服务器错误记录到日志文件
        logger.error('服务器错误:', {
          status,
          message: error.message,
          stack: error.stack,
          path: ctx.path,
          method: ctx.method,
          ip: ctx.ip,
          userAgent: ctx.get('User-Agent')
        });
      } else {
        // 客户端错误记录到日志文件
        logger.warn('客户端错误:', {
          status,
          message: error.message,
          path: ctx.path,
          method: ctx.method,
          ip: ctx.ip
        });
      }
    }
  };
};
