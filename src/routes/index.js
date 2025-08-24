import Router from 'koa-router';
import userRouter from './user.js';
import logger from '../utils/logger.js';
import databaseManager from '../database/index.js';

/**
 * 路由管理器类
 * 负责加载路由文件
 */
class RouterManager {
    constructor() {
        this.router = new Router(); // 创建主路由器
        this.routes = new Map();    // 存储已加载的路由
        this.loadRoutes();
    }

    /**
     * 加载所有路由文件
     */
    loadRoutes() {
        try {
            // 加载用户路由
            this.loadUserRoute();

            // 添加健康检查路由
            this.addHealthCheckRoute();

            // 添加Swagger UI路由
            this.router.get('/docs', async (ctx) => {
                ctx.redirect('/public/swagger-ui.html');
            });

        } catch (error) {
            logger.error('加载路由失败:', error);
            throw error;
        }
    }

    /**
     * 添加健康检查路由
     */
    addHealthCheckRoute() {
        // 基础健康检查
        this.router.get('/health', async (ctx) => {
            try {
                const dbHealth = await databaseManager.healthCheck();

                ctx.body = {
                    success: true,
                    data: {
                        status: 'healthy',
                        timestamp: new Date().toISOString(),
                        uptime: process.uptime(),
                        memory: process.memoryUsage(),
                        database: dbHealth
                    }
                };
            } catch (error) {
                logger.error('健康检查失败:', error);
                ctx.status = 500;
                ctx.body = {
                    success: false,
                    error: {
                        message: '健康检查失败',
                        status: 500,
                        timestamp: new Date().toISOString()
                    }
                };
            }
        });

        // 详细健康检查
        this.router.get('/health/detailed', async (ctx) => {
            try {
                const dbHealth = await databaseManager.healthCheck();
                const systemInfo = {
                    nodeVersion: process.version,
                    platform: process.platform,
                    arch: process.arch,
                    pid: process.pid,
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    cpu: process.cpuUsage()
                };

                ctx.body = {
                    success: true,
                    data: {
                        status: 'healthy',
                        timestamp: new Date().toISOString(),
                        system: systemInfo,
                        database: dbHealth
                    }
                };
            } catch (error) {
                logger.error('详细健康检查失败:', error);
                ctx.status = 500;
                ctx.body = {
                    success: false,
                    error: {
                        message: '详细健康检查失败',
                        status: 500,
                        timestamp: new Date().toISOString()
                    }
                };
            }
        });

        logger.info('健康检查路由已添加: /health, /health/detailed');
    }

    /**
     * 加载用户路由
     */
    loadUserRoute() {
        try {
            // 验证路由模块的有效性
            if (userRouter && typeof userRouter.routes === 'function') {
                this.routes.set('user', userRouter);

                // 注册用户路由
                this.router.use('/api/users', userRouter.routes(), userRouter.allowedMethods());

                logger.info('用户路由加载成功，前缀: /api/users');
            } else {
                logger.warn('用户路由文件可能不是有效的路由模块');
            }
        } catch (error) {
            logger.error('加载用户路由失败:', error);
        }
    }



    /**
     * 获取路由器实例
     * @returns {Router} Koa路由器实例
     */
    getRouter() {
        return this.router;
    }

    /**
     * 获取已加载的路由映射
     * @returns {Map} 路由映射表
     */
    getRoutes() {
        return this.routes;
    }
}

// 创建路由管理器实例
const routerManager = new RouterManager();

export default routerManager.getRouter();
export { routerManager };
