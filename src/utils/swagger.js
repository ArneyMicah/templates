import swaggerJSDoc from 'swagger-jsdoc';
import { koaSwagger } from 'koa2-swagger-ui';

/**
 * Swagger 配置管理函数
 */

// Swagger规范对象
let spec = {
    openapi: '3.0.0',
    info: {
        title: 'Koa Project API',
        version: '1.0.0',
        description: '基于 Koa.js 构建的 Web API 服务'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: '开发服务器'
        }
    ],
    tags: [
        {
            name: '用户管理',
            description: '用户相关的 API 接口'
        },
        {
            name: '健康检查',
            description: '系统健康检查接口'
        }
    ],
    paths: {},
    components: {
        schemas: {}
    }
};

/**
 * 设置 API 信息
 * @param {Object} info - API信息
 */
export const setInfo = (info) => {
    spec.info = { ...spec.info, ...info };
};

/**
 * 添加 API 规范
 * @param {Object} specData - API规范数据
 */
export const addSpec = (specData) => {
    if (specData.paths) {
        spec.paths = { ...spec.paths, ...specData.paths };
    }
    if (specData.tags) {
        spec.tags = [...spec.tags, ...specData.tags];
    }
    if (specData.components && specData.components.schemas) {
        spec.components.schemas = { ...spec.components.schemas, ...specData.components.schemas };
    }
};

/**
 * 获取 Swagger UI 中间件
 * @param {string} path - 路径前缀
 * @returns {Function} 中间件函数
 */
export const getMiddleware = (path = '/api-docs') => {
    return koaSwagger({
        routePrefix: path,
        swaggerOptions: {
            url: '/swagger.json',
            spec: spec
        }
    });
};

/**
 * 获取 Swagger JSON 中间件
 * @returns {Function} 中间件函数
 */
export const getJsonMiddleware = () => {
    return async (ctx, next) => {
        if (ctx.path === '/swagger.json') {
            ctx.body = spec;
            return;
        }
        await next();
    };
};

/**
 * 获取当前规范
 * @returns {Object} 当前规范
 */
export const getSpec = () => {
    return spec;
};

/**
 * 重置规范
 */
export const resetSpec = () => {
    spec = {
        openapi: '3.0.0',
        info: {
            title: 'Koa Project API',
            version: '1.0.0',
            description: '基于 Koa.js 构建的 Web API 服务'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: '开发服务器'
            }
        ],
        tags: [
            {
                name: '用户管理',
                description: '用户相关的 API 接口'
            },
            {
                name: '健康检查',
                description: '系统健康检查接口'
            }
        ],
        paths: {},
        components: {
            schemas: {}
        }
    };
};

// 路径注册存储
const pathRegistry = {};

/**
 * 注册 API 路径
 * @param {Object} pathDefinition - 路径定义
 */
export const registerPath = (pathDefinition) => {
    Object.assign(pathRegistry, pathDefinition);
    addSpec({ paths: pathDefinition });
};

/**
 * 获取所有注册的路径
 * @returns {Object} 所有路径
 */
export const getAllPaths = () => {
    return pathRegistry;
};

/**
 * 获取 Swagger 配置实例
 * @returns {Object} Swagger配置对象
 */
export const getSwaggerConfig = () => {
    return {
        setInfo,
        addSpec,
        getMiddleware,
        getJsonMiddleware,
        getSpec,
        resetSpec
    };
};

// HTTP 方法定义函数
export const GET = (options = {}) => {
    return {
        get: {
            summary: options.summary || 'GET 请求',
            description: options.description || '',
            tags: options.tags || [],
            parameters: options.parameters || [],
            responses: options.responses || {
                '200': {
                    description: '成功响应',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: '成功' },
                                    data: { type: 'object' }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};

export const POST = (options = {}) => {
    return {
        post: {
            summary: options.summary || 'POST 请求',
            description: options.description || '',
            tags: options.tags || [],
            parameters: options.parameters || [],
            requestBody: options.requestBody || {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object'
                        }
                    }
                }
            },
            responses: options.responses || {
                '201': {
                    description: '创建成功',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 201 },
                                    message: { type: 'string', example: '创建成功' },
                                    data: { type: 'object' }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};

export const PUT = (options = {}) => {
    return {
        put: {
            summary: options.summary || 'PUT 请求',
            description: options.description || '',
            tags: options.tags || [],
            parameters: options.parameters || [],
            requestBody: options.requestBody || {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object'
                        }
                    }
                }
            },
            responses: options.responses || {
                '200': {
                    description: '更新成功',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: '更新成功' },
                                    data: { type: 'object' }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};

export const DELETE = (options = {}) => {
    return {
        delete: {
            summary: options.summary || 'DELETE 请求',
            description: options.description || '',
            tags: options.tags || [],
            parameters: options.parameters || [],
            responses: options.responses || {
                '200': {
                    description: '删除成功',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: '删除成功' },
                                    data: { type: 'object' }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};

export const PATCH = (options = {}) => {
    return {
        patch: {
            summary: options.summary || 'PATCH 请求',
            description: options.description || '',
            tags: options.tags || [],
            parameters: options.parameters || [],
            requestBody: options.requestBody || {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object'
                        }
                    }
                }
            },
            responses: options.responses || {
                '200': {
                    description: '部分更新成功',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: '更新成功' },
                                    data: { type: 'object' }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};

export default {
    getSwaggerConfig,
    registerPath,
    getAllPaths,
    GET,
    POST,
    PUT,
    DELETE,
    PATCH
};
