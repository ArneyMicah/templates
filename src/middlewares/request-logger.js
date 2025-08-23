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
    
    // 记录请求信息
    console.log(`📥 收到请求 [${requestId}]:`, {
      method: ctx.method,
      url: ctx.url,
      ip: ctx.ip,
      userAgent: ctx.get('User-Agent'),
      timestamp: new Date().toLocaleString('zh-CN')
    });
    
    try {
      // 继续执行下一个中间件
      await next();
      
      // 计算响应时间
      const responseTime = Date.now() - startTime;
      
      // 记录响应信息
      console.log(`📤 响应完成 [${requestId}]:`, {
        status: ctx.status,
        responseTime: `${responseTime}ms`,
        contentLength: ctx.length || 0,
        timestamp: new Date().toLocaleString('zh-CN')
      });
      
      // 设置响应时间头
      ctx.set('X-Response-Time', `${responseTime}ms`);
      ctx.set('X-Request-ID', requestId);
      
    } catch (error) {
      // 计算响应时间
      const responseTime = Date.now() - startTime;
      
      // 记录错误响应信息
      console.error(`❌ 请求失败 [${requestId}]:`, {
        status: ctx.status || 500,
        error: error.message,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toLocaleString('zh-CN')
      });
      
      // 设置响应时间头
      ctx.set('X-Response-Time', `${responseTime}ms`);
      ctx.set('X-Request-ID', requestId);
      
      // 重新抛出错误，让错误处理中间件处理
      throw error;
    }
  };
};
