import logger from '../utils/logger.js';

/**
 * 请求日志中间件
 * 记录所有HTTP请求的详细信息
 * @returns {Function} Koa中间件函数
 */
export const requestLogger = () => {
  return async (ctx, next) => {
    const start = Date.now();
    const requestId = generateRequestId();

    // 记录请求开始
    // logger.info('请求开始', {
    //   requestId,
    //   method: ctx.method,
    //   url: ctx.url,
    //   ip: ctx.ip,
    //   userAgent: ctx.get('User-Agent'),
    //   contentType: ctx.get('Content-Type'),
    //   contentLength: ctx.get('Content-Length')
    // });

    // 记录请求体（仅对POST/PUT/PATCH请求且Content-Type为application/json）
    if (['POST', 'PUT', 'PATCH'].includes(ctx.method) && 
        ctx.get('Content-Type')?.includes('application/json')) {
      try {
        const body = ctx.request.body;
        if (body && Object.keys(body).length > 0) {
          logger.debug('请求体内容', {
            requestId,
            body: JSON.stringify(body, null, 2)
          });
        }
      } catch (error) {
        logger.warn('无法记录请求体', {
          requestId,
          error: error.message
        });
      }
    }

    try {
      await next();
    } catch (error) {
      // 记录错误
      logger.error('请求处理错误', {
        requestId,
        error: error.message,
        stack: error.stack
      });
      throw error;
    } finally {
      const duration = Date.now() - start;
      
      // 记录响应信息
      logger.info('请求完成', {
        requestId,
        method: ctx.method,
        url: ctx.url,
        status: ctx.status,
        duration: `${duration}ms`,
        contentLength: ctx.response.length || 0
      });
    }
  };
};

/**
 * 生成请求ID
 * @returns {string} 唯一的请求ID
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
