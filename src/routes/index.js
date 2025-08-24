import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Router from 'koa-router';
import logger from '../utils/logger.js';
import testRouter from './test.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 路由管理器类
 * 负责自动发现和加载路由文件
 */
class RouterManager {
    constructor() {
        this.router = new Router(); // 创建主路由器
        this.routes = new Map();    // 存储已加载的路由
        console.log('🛣️  路由管理器初始化完成');
    }

    /**
     * 加载所有路由文件
     * 自动扫描routes目录下的.js文件
     */
    async loadRoutes() {
        try {
            console.log('🔍 正在扫描路由文件...');

            // 读取routes目录下的所有文件
            const files = await fs.readdir(__dirname);

            // 过滤出有效的路由文件
            const routeFiles = files.filter(file =>
                file.endsWith('.js') &&
                file !== 'index.js' &&
                !file.startsWith('.')
            );

            // console.log(`📁 发现 ${routeFiles.length} 个路由文件: ${routeFiles.join(', ')}`);
            // logger.info(`发现 ${routeFiles.length} 个路由文件`);

            // 逐个加载路由文件
            for (const file of routeFiles) {
                await this.loadRouteFile(file);
            }

            // console.log('✅ 所有路由加载完成');
            // logger.info('所有路由加载成功');

        } catch (error) {
            console.error('❌ 加载路由失败:', error.message);
            logger.error('加载路由失败:', error);
            throw error;
        }
    }

    /**
     * 加载单个路由文件
     * @param {string} filename - 路由文件名
     */
    async loadRouteFile(filename) {
        try {
            const filePath = path.join(__dirname, filename);

            // 动态导入路由模块
            const routeModule = await import(`file://${filePath}`);

            // 验证路由模块的有效性
            if (routeModule.default && typeof routeModule.default.routes === 'function') {
                const routeName = filename.replace('.js', '');
                this.routes.set(routeName, routeModule.default);

                // 获取路由前缀并注册路由
                const prefix = this.getRoutePrefix(routeName);
                this.router.use(prefix, routeModule.default.routes(), routeModule.default.allowedMethods());

                logger.info(`路由 ${routeName} 加载成功，前缀: ${prefix}`);
            } else {
                logger.warn(`路由文件 ${filename} 可能不是有效的路由模块`);
            }
        } catch (error) {
            logger.error(`加载路由文件 ${filename} 失败:`, error);
        }
    }

    /**
     * 获取路由前缀
     * 根据文件名设置合适的路由前缀
     * @param {string} routeName - 路由名称
     * @returns {string} 路由前缀
     */
    getRoutePrefix(routeName) {
        // 根据文件名设置路由前缀
        const prefixMap = {
            'auth': '/auth',           // 认证相关路由
            'user': '/users',          // 用户管理路由
            'post': '/posts',          // 文章管理路由
            'upload': '/upload',       // 文件上传路由
            'api': '/api',             // API相关路由
            'health': '/',             // 健康检查使用根路径
            'swagger': '/docs'         // Swagger文档使用/docs路径
        };

        const prefix = prefixMap[routeName] || `/${routeName}`;

        return prefix;
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

    /**
     * 获取所有注册的路由信息
     * 用于调试和监控
     * @returns {Array} 路由信息数组
     */
    getRouteInfo() {
        const routeInfo = [];
        this.router.stack.forEach(layer => {
            if (layer.route) {
                const methods = Object.keys(layer.route.methods);
                routeInfo.push({
                    path: layer.route.path,
                    methods: methods,
                    prefix: layer.route.path.split('/')[1] || '/'
                });
            }
        });
        return routeInfo;
    }
}

// 创建路由管理器实例
const routerManager = new RouterManager();

// 初始化函数
async function initializeRouter() {
    await routerManager.loadRoutes();
}

// 立即初始化
initializeRouter().catch(error => {
    logger.error('路由初始化失败:', error);
    process.exit(1);
});

export default routerManager.getRouter();
export { routerManager };
