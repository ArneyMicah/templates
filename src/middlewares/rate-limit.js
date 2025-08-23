import koaRateLimit from 'koa-ratelimit';

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
    duration: 60000, // 限流时间窗口：1分钟
    max: 100,        // 最大请求次数：100次/分钟
    errorMessage: {
      success: false,
      error: {
        message: '请求过于频繁，请稍后再试',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: 60
      }
    },
    headers: {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': 'remaining',
      'X-RateLimit-Reset': 'reset'
    },
    // 自定义限流逻辑
    async getKey(ctx) {
      // 根据IP地址进行限流
      const key = ctx.ip;
      console.log(`🔒 限流检查 - IP: ${key}`);
      return key;
    },
    // 限流触发时的处理
    async afterLimit(ctx, next) {
      const key = ctx.ip;
      const remaining = ctx.get('X-RateLimit-Remaining');

      if (remaining <= 0) {
        console.warn(`⚠️  触发限流 - IP: ${key}, 剩余次数: ${remaining}`);
      } else {
        console.log(`✅ 限流通过 - IP: ${key}, 剩余次数: ${remaining}`);
      }

      await next();
    }
  });
};
