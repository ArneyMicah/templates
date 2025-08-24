import logger from '../utils/logger.js';

/**
 * JSON解析中间件
 * 安全地解析JSON请求体，并提供详细的错误信息
 * @returns {Function} Koa中间件函数
 */
export const jsonParser = () => {
  return async (ctx, next) => {
    // 只处理JSON类型的请求
    const contentType = ctx.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      return await next();
    }

    // 检查请求体是否为空
    if (!ctx.request.body || Object.keys(ctx.request.body).length === 0) {
      // 对于POST/PUT/PATCH请求，如果请求体为空，返回错误
      if (['POST', 'PUT', 'PATCH'].includes(ctx.method)) {
        logger.warn('空请求体', {
          method: ctx.method,
          path: ctx.path,
          contentType
        });

        ctx.status = 400;
        ctx.body = {
          success: false,
          error: {
            message: '请求体不能为空',
            details: '请提供有效的JSON数据',
            status: 400,
            timestamp: new Date().toISOString()
          }
        };
        return;
      }
    }

    try {
      await next();
    } catch (error) {
      // 处理JSON解析错误
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        logger.error('JSON解析错误', {
          message: error.message,
          path: ctx.path,
          method: ctx.method,
          contentType,
          stack: error.stack
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

      // 其他错误继续抛出
      throw error;
    }
  };
};

export default jsonParser;
