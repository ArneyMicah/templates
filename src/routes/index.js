import Router from 'koa-router';
import userRouter from './user.js';
import logger from '../utils/logger.js';
import { healthCheck } from '../database/index.js';

/**
 * 路由管理函数
 * 负责加载路由文件
 */

// 创建主路由器
const router = new Router();
const routes = new Map();

/**
 * 加载所有路由文件
 */
const loadRoutes = () => {
    try {
        // 加载用户路由
        loadUserRoute();

        // 添加健康检查路由
        addHealthCheckRoute();

        // 添加Swagger UI路由
        router.get('/docs', async (ctx) => {
            ctx.redirect('/public/swagger-ui.html');
        });

    } catch (error) {
        logger.error('加载路由失败:', error);
        throw error;
    }
};

/**
 * 添加健康检查路由
 */
const addHealthCheckRoute = () => {
    // 基础健康检查
    router.get('/health', async (ctx) => {
        try {
            const dbHealth = await healthCheck();

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
    router.get('/health/detailed', async (ctx) => {
        try {
            const dbHealth = await healthCheck();
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

    // 健康检查路由已添加: /health, /health/detailed
};

/**
 * 加载用户路由
 */
const loadUserRoute = () => {
    try {
        // 验证路由模块的有效性
        if (userRouter && typeof userRouter.routes === 'function') {
            routes.set('user', userRouter);

            // 注册用户路由
            router.use('/api/users', userRouter.routes(), userRouter.allowedMethods());

            // 用户路由加载成功，前缀: /api/users
        } else {
            logger.warn('用户路由文件可能不是有效的路由模块');
        }
    } catch (error) {
        logger.error('加载用户路由失败:', error);
    }
};

/**
 * 获取路由器实例
 * @returns {Router} Koa路由器实例
 */
const getRouter = () => {
    return router;
};

/**
 * 获取已加载的路由映射
 * @returns {Map} 路由映射表
 */
const getRoutes = () => {
    return routes;
};

// 初始化路由
loadRoutes();

// 保持向后兼容性，导出routerManager对象
const routerManager = {
    getRouter,
    getRoutes,
    loadRoutes,
    loadUserRoute,
    addHealthCheckRoute
};

export default routerManager.getRouter();
export { routerManager };
