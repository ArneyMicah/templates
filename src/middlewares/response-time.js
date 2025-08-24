import logger from '../utils/logger.js';

/**
 * 响应时间中间件
 * 计算并记录每个请求的响应时间
 * @returns {Function} Koa中间件函数
 */
export const responseTime = () => {
  return async (ctx, next) => {
    // 记录请求开始时间
    const start = process.hrtime.bigint();

    try {
      // 继续执行下一个中间件
      await next();
    } catch (error) {
      // 重新抛出错误，让错误处理中间件处理
      throw error;
    } finally {
      // 计算响应时间（纳秒转换为毫秒）
      const end = process.hrtime.bigint();
      const responseTime = Number(end - start) / 1000000;

      // 设置响应时间头
      ctx.set('X-Response-Time', `${responseTime.toFixed(2)}ms`);

      // 记录响应时间信息（仅记录慢响应）
      if (responseTime > 1000) {
        logger.warn('慢响应警告', {
          method: ctx.method,
          path: ctx.path,
          status: ctx.status,
          responseTime: `${responseTime.toFixed(2)}ms`
        });
      }
    }
  };
};
