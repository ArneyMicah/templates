import swaggerJSDoc from 'swagger-jsdoc';
import { koaSwagger } from 'koa2-swagger-ui';

/**
 * Swagger 配置管理类
 */
class SwaggerConfig {
    constructor() {
        this.spec = {
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
            paths: {}
        };
    }

    /**
     * 设置 API 信息
     */
    setInfo(info) {
        this.spec.info = { ...this.spec.info, ...info };
    }

    /**
     * 添加 API 规范
     */
    addSpec(spec) {
        if (spec.paths) {
            this.spec.paths = { ...this.spec.paths, ...spec.paths };
        }
        if (spec.tags) {
            this.spec.tags = [...this.spec.tags, ...spec.tags];
        }
    }

    /**
     * 获取 Swagger UI 中间件
     */
    getMiddleware(path = '/api-docs') {
        return koaSwagger({
            routePrefix: path,
            swaggerOptions: {
                url: '/swagger.json',
                spec: this.spec
            }
        });
    }

    /**
     * 获取 Swagger JSON 中间件
     */
    getJsonMiddleware() {
        return async (ctx, next) => {
            if (ctx.path === '/swagger.json') {
                ctx.body = this.spec;
                return;
            }
            await next();
        };
    }

    /**
     * 获取当前规范
     */
    getSpec() {
        return this.spec;
    }
}

// 创建全局 Swagger 配置实例
const swaggerConfig = new SwaggerConfig();

// 路径注册存储
const pathRegistry = {};

/**
 * 注册 API 路径
 */
export function registerPath(pathDefinition) {
    Object.assign(pathRegistry, pathDefinition);
    swaggerConfig.addSpec({ paths: pathDefinition });
}

/**
 * 获取所有注册的路径
 */
export function getAllPaths() {
    return pathRegistry;
}

/**
 * 获取 Swagger 配置实例
 */
export function getSwaggerConfig() {
    return swaggerConfig;
}

// HTTP 方法定义函数
export function GET(options = {}) {
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
}

export function POST(options = {}) {
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
}

export function PUT(options = {}) {
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
}

export function DELETE(options = {}) {
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
}

export function PATCH(options = {}) {
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
}

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
