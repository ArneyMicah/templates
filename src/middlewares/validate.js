/**
 * 请求验证中间件
 * 验证请求的格式和内容类型
 * @returns {Function} Koa中间件函数
 */
export const validate = () => {
  return async (ctx, next) => {
    const method = ctx.method;
    const contentType = ctx.get('Content-Type');
    
    // 记录请求验证信息
    console.log(`🔍 请求验证: ${method} ${ctx.url}`, {
      contentType: contentType || '未指定',
      contentLength: ctx.get('Content-Length') || '未知'
    });
    
    // 对于POST、PUT、PATCH请求，验证Content-Type
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (!contentType) {
        console.warn(`⚠️  缺少Content-Type头 - ${method} ${ctx.url}`);
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
        console.warn(`⚠️  不支持的Content-Type: ${contentType} - ${method} ${ctx.url}`);
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
      
      console.log(`✅ Content-Type验证通过: ${contentType}`);
    }
    
    // 验证请求体大小（如果有的话）
    const contentLength = parseInt(ctx.get('Content-Length') || '0');
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (contentLength > maxSize) {
      console.warn(`⚠️  请求体过大: ${contentLength} bytes - ${method} ${ctx.url}`);
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
    console.log(`✅ 请求验证通过 - ${method} ${ctx.url}`);
    await next();
  };
};
