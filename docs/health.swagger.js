import { GET } from '../src/utils/swagger.js';

/**
 * 健康检查相关的 Swagger 路径定义
 */
export const healthPaths = {
    '/health': {
        ...GET({
            summary: '基础健康检查',
            description: '检查应用基础运行状态',
            tags: ['健康检查'],
            responses: {
                '200': {
                    description: '应用运行正常',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: 'OK' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'healthy' },
                                            timestamp: { type: 'string', format: 'date-time' },
                                            uptime: { type: 'number', example: 12345.67 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    },
    '/health/detailed': {
        ...GET({
            summary: '详细健康检查',
            description: '获取详细的系统状态信息，包括内存使用、数据库状态等',
            tags: ['健康检查'],
            responses: {
                '200': {
                    description: '详细系统状态信息',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: '系统状态正常' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'healthy' },
                                            timestamp: { type: 'string', format: 'date-time' },
                                            uptime: { type: 'number', example: 12345.67 },
                                            memory: {
                                                type: 'object',
                                                properties: {
                                                    used: { type: 'number', example: 1024000 },
                                                    total: { type: 'number', example: 2048000 },
                                                    percentage: { type: 'number', example: 50.0 }
                                                }
                                            },
                                            database: {
                                                type: 'object',
                                                properties: {
                                                    status: { type: 'string', example: 'connected' },
                                                    responseTime: { type: 'number', example: 15.5 }
                                                }
                                            },
                                            system: {
                                                type: 'object',
                                                properties: {
                                                    platform: { type: 'string', example: 'linux' },
                                                    nodeVersion: { type: 'string', example: 'v18.0.0' },
                                                    cpuUsage: { type: 'number', example: 25.5 }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '503': {
                    description: '系统状态异常',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 503 },
                                    message: { type: 'string', example: '系统状态异常' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'unhealthy' },
                                            issues: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        component: { type: 'string', example: 'database' },
                                                        message: { type: 'string', example: '数据库连接失败' }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }
};
