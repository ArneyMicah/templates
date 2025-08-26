import Router from 'koa-router';
import userRouter from './user.js';
import logger from '../utils/logger.js';
import { healthCheck } from '../database/index.js';

/**
 * 路由管理
 */

// 创建主路由器
const router = new Router();

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
};

/**
 * 加载所有路由
 */
const loadRoutes = () => {
    try {
        // 注册用户路由
        router.use('/api/users', userRouter.routes(), userRouter.allowedMethods());

        // 添加健康检查路由
        addHealthCheckRoute();

        // 添加Swagger UI路由
        router.get('/docs', async (ctx) => {
            ctx.redirect('/public/swagger-ui.html');
        });

        logger.info('所有路由加载完成');
    } catch (error) {
        logger.error('加载路由失败:', error);
        throw error;
    }
};

// 初始化路由
loadRoutes();

export default router;
