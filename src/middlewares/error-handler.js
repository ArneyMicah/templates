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
      // 记录错误日志
      console.error('🚨 捕获到错误:', error.message);
      console.error('📍 错误堆栈:', error.stack);
      
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
      if (process.env.NODE_ENV === 'development') {
        errorBody.error.stack = error.stack;
        errorBody.error.details = error.details || {};
      }
      
      // 设置响应头
      ctx.set('Content-Type', 'application/json');
      
      // 发送错误响应
      ctx.body = errorBody;
      
      // 记录错误到日志系统
      if (status >= 500) {
        console.error('💥 服务器错误 (5xx):', {
          status,
          message: error.message,
          path: ctx.path,
          method: ctx.method,
          userAgent: ctx.get('User-Agent'),
          ip: ctx.ip
        });
      } else {
        console.warn('⚠️  客户端错误 (4xx):', {
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
