import { userPaths, userSchemas } from './user.swagger.js';
import { healthPaths } from './health.swagger.js';

/**
 * 获取所有 Swagger 路径
 */
export function getAllSwaggerPaths() {
    return {
        ...userPaths,
        ...healthPaths
    };
}

/**
 * 获取所有 Swagger Schema
 */
export function getAllSwaggerSchemas() {
    return {
        ...userSchemas
    };
}

/**
 * 获取 Swagger 基础信息
 */
export function getSwaggerInfo() {
    return {
        title: 'Koa Project API',
        version: '1.0.0',
        description: '基于 Koa.js 构建的现代化 Web API 服务',
        contact: {
            name: 'API Support',
            email: 'support@example.com'
        },
        license: {
            name: 'ISC',
            url: 'https://opensource.org/licenses/ISC'
        },
        tags: [
            {
                name: '用户管理',
                description: '用户相关的 API 接口'
            },
            {
                name: '健康检查',
                description: '系统健康检查接口'
            }
        ]
    };
}

export default {
    getAllSwaggerPaths,
    getSwaggerInfo
};
