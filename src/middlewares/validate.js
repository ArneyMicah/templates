/**
 * 请求验证中间件
 * 验证请求的格式和内容类型
 * @returns {Function} Koa中间件函数
 */
export const validate = () => {
  return async (ctx, next) => {
    const method = ctx.method;
    const contentType = ctx.get('Content-Type');

    // 对于POST、PUT、PATCH请求，验证Content-Type
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (!contentType) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          error: {
            message: '请求缺少Content-Type头',
            code: 'MISSING_CONTENT_TYPE',
            required: 'application/json 或 application/x-www-form-urlencoded'
          }
        };
        return;
      }

      // 检查Content-Type是否支持
      const supportedTypes = [
        'application/json',
        'application/x-www-form-urlencoded',
        'multipart/form-data'
      ];

      const isSupported = supportedTypes.some(type =>
        contentType.includes(type)
      );

      if (!isSupported) {
        ctx.status = 415;
        ctx.body = {
          success: false,
          error: {
            message: '不支持的Content-Type',
            code: 'UNSUPPORTED_CONTENT_TYPE',
            received: contentType,
            supported: supportedTypes
          }
        };
        return;
      }
    }

    // 验证请求体大小（如果有的话）
    const contentLength = parseInt(ctx.get('Content-Length') || '0');
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (contentLength > maxSize) {
      ctx.status = 413;
      ctx.body = {
        success: false,
        error: {
          message: '请求体过大',
          code: 'PAYLOAD_TOO_LARGE',
          received: `${contentLength} bytes`,
          maxAllowed: `${maxSize} bytes`
        }
      };
      return;
    }

    // 验证通过，继续执行
    await next();
  };
};
