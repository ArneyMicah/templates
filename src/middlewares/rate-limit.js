import koaRateLimit from 'koa-ratelimit';
import { security as securityConfig } from '../config/global.js';

/**
 * API限流中间件
 * 防止API被恶意请求，保护服务器资源
 * @returns {Function} Koa中间件函数
 */
export const rateLimit = () => {
  // 使用内存存储限流数据（生产环境建议使用Redis）
  const db = new Map();

  return koaRateLimit({
    driver: 'memory',
    db: db,
    duration: securityConfig.rateLimitWindow, // 从全局配置获取限流时间窗口
    max: securityConfig.rateLimitMax,        // 从全局配置获取最大请求次数
    errorMessage: {
      success: false,
      error: {
        message: '请求过于频繁，请稍后再试',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: 60
      }
    },
    headers: {
      'X-RateLimit-Limit': securityConfig.rateLimitMax.toString(),
      'X-RateLimit-Remaining': 'remaining',
      'X-RateLimit-Reset': 'reset'
    },
    // 自定义限流逻辑
    async getKey(ctx) {
      // 根据IP地址进行限流
      const key = ctx.ip;
      return key;
    },
    // 限流触发时的处理
    async afterLimit(ctx, next) {
      await next();
    }
  });
};
