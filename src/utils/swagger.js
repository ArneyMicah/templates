/**
 * Swagger API文档配置
 * 自动生成API文档和交互式测试界面
 */

// Swagger配置选项
const swaggerOptions = {
    openapi: '3.0.0',
    info: {
        title: 'Koa Project API',
        description: '基于Koa.js构建的现代化Web API服务',
        version: '1.0.0',
        contact: {
            name: '开发团队',
            email: 'dev@example.com'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        }
    },
    servers: [
        {
            url: 'http://localhost:3003',
            description: '开发环境'
        },
        {
            url: 'https://api.example.com',
            description: '生产环境'
        }
    ],
    tags: [
        {
            name: '健康检查',
            description: '系统健康状态和监控接口'
        },
        {
            name: '用户管理',
            description: '用户注册、登录、信息管理等接口'
        },
        {
            name: '认证授权',
            description: 'JWT认证和权限管理接口'
        },
        {
            name: '文件上传',
            description: '文件上传和管理接口'
        },
        {
            name: '文章管理',
            description: '文章CRUD操作接口'
        }
    ],
    components: {
        securitySchemes: {
            Bearer: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                description: 'JWT认证令牌，格式：Bearer <token>'
            }
        }
    },
    security: [
        {
            Bearer: []
        }
    ]
};

/**
 * 获取Swagger配置信息
 * @returns {Object} Swagger配置对象
 */
export const getSwaggerConfig = () => {
    return {
        ...swaggerOptions,
        paths: {
            // 健康检查接口
            '/health': {
                get: {
                    tags: ['健康检查'],
                    summary: '系统健康检查',
                    description: '检查系统运行状态和基本信息',
                    responses: {
                        200: {
                            description: '系统运行正常',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            message: { type: 'string' },
                                            status: { type: 'string' },
                                            timestamp: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/info': {
                get: {
                    tags: ['健康检查'],
                    summary: '系统详细信息',
                    description: '获取详细的系统运行信息',
                    responses: {
                        200: {
                            description: '系统信息获取成功',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            message: { type: 'string' },
                                            system: { type: 'object' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/api': {
                get: {
                    tags: ['API信息'],
                    summary: 'API基本信息',
                    description: '获取API版本、状态和功能信息',
                    responses: {
                        200: {
                            description: 'API信息获取成功',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            message: { type: 'string' },
                                            api: { type: 'object' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
};

export default getSwaggerConfig;
