import jwt from 'jsonwebtoken';

/**
 * JWT认证中间件
 * 验证请求中的JWT令牌，保护需要认证的API端点
 * @returns {Function} Koa中间件函数
 */
export const auth = () => {
  return async (ctx, next) => {
    // 获取Authorization头
    const authHeader = ctx.get('Authorization');

    // 检查Authorization头是否存在
    if (!authHeader) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: {
          message: '缺少认证令牌',
          code: 'MISSING_AUTH_TOKEN',
          required: 'Authorization: Bearer <token>'
        }
      };
      return;
    }

    // 检查Authorization头格式
    if (!authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: {
          message: '认证令牌格式错误',
          code: 'INVALID_AUTH_FORMAT',
          required: 'Authorization: Bearer <token>'
        }
      };
      return;
    }

    // 提取JWT令牌
    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    try {
      // 验证JWT令牌
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, secret);

      // 将解码后的用户信息添加到上下文
      ctx.state.user = decoded;

      // 继续执行下一个中间件
      await next();

    } catch (error) {
      // 根据错误类型返回相应的状态码
      let status = 401;
      let message = '认证令牌无效';
      let code = 'INVALID_TOKEN';

      if (error.name === 'TokenExpiredError') {
        status = 401;
        message = '认证令牌已过期';
        code = 'TOKEN_EXPIRED';
      } else if (error.name === 'JsonWebTokenError') {
        status = 401;
        message = '认证令牌格式错误';
        code = 'MALFORMED_TOKEN';
      }

      ctx.status = status;
      ctx.body = {
        success: false,
        error: {
          message: message,
          code: code,
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }
      };
    }
  };
};
