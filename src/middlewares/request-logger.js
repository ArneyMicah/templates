/**
 * 请求日志记录中间件
 * 记录所有HTTP请求的详细信息，包括请求时间、响应时间等
 * @returns {Function} Koa中间件函数
 */
export const requestLogger = () => {
  return async (ctx, next) => {
    // 记录请求开始时间
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(2, 15);

    try {
      // 继续执行下一个中间件
      await next();

      // 计算响应时间
      const responseTime = Date.now() - startTime;

      // 设置响应时间头
      ctx.set('X-Response-Time', `${responseTime}ms`);
      ctx.set('X-Request-ID', requestId);

    } catch (error) {
      // 计算响应时间
      const responseTime = Date.now() - startTime;

      // 设置响应时间头
      ctx.set('X-Response-Time', `${responseTime}ms`);
      ctx.set('X-Request-ID', requestId);

      // 重新抛出错误，让错误处理中间件处理
      throw error;
    }
  };
};
