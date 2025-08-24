/**
 * 响应时间中间件
 * 计算并记录每个请求的响应时间
 * @returns {Function} Koa中间件函数
 */
export const responseTime = () => {
  return async (ctx, next) => {
    // 记录请求开始时间
    const start = process.hrtime.bigint();

    // 继续执行下一个中间件
    await next();

    // 计算响应时间（纳秒转换为毫秒）
    const end = process.hrtime.bigint();
    const responseTime = Number(end - start) / 1000000;

    // 设置响应时间头
    ctx.set('X-Response-Time', `${responseTime.toFixed(2)}ms`);

    // 记录响应时间信息（仅记录慢响应）
    if (responseTime > 1000) {
      // 响应时间超过1秒，记录警告
      console.warn(`慢响应警告: ${ctx.method} ${ctx.url} - ${responseTime.toFixed(2)}ms`);
    }
  };
};
