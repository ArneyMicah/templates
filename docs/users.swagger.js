import { GET, POST, PUT, DELETE } from '../src/utils/swagger.js';

/**
 * 用户管理相关的 Swagger 路径定义
 */
export const userPaths = {
    '/api/users': {
        ...GET({
            summary: '获取用户列表',
            description: '获取所有用户的列表信息',
            tags: ['用户管理'],
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: '页码',
                    schema: { type: 'integer', default: 1 }
                },
                {
                    name: 'limit',
                    in: 'query',
                    description: '每页数量',
                    schema: { type: 'integer', default: 10 }
                },
                {
                    name: 'search',
                    in: 'query',
                    description: '搜索关键词',
                    schema: { type: 'string' }
                }
            ],
            responses: {
                '200': {
                    description: '成功获取用户列表',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: '获取成功' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            users: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer', example: 1 },
                                                        username: { type: 'string', example: 'john_doe' },
                                                        email: { type: 'string', example: 'john@example.com' },
                                                        createdAt: { type: 'string', format: 'date-time' }
                                                    }
                                                }
                                            },
                                            pagination: {
                                                type: 'object',
                                                properties: {
                                                    page: { type: 'integer', example: 1 },
                                                    limit: { type: 'integer', example: 10 },
                                                    total: { type: 'integer', example: 100 },
                                                    pages: { type: 'integer', example: 10 }
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
        }),
        ...POST({
            summary: '创建新用户',
            description: '创建新的用户账户',
            tags: ['用户管理'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['username', 'email', 'password'],
                            properties: {
                                username: {
                                    type: 'string',
                                    description: '用户名',
                                    example: 'john_doe'
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    description: '邮箱地址',
                                    example: 'john@example.com'
                                },
                                password: {
                                    type: 'string',
                                    description: '密码',
                                    example: 'password123'
                                },
                                fullName: {
                                    type: 'string',
                                    description: '全名',
                                    example: 'John Doe'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                '201': {
                    description: '用户创建成功',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 201 },
                                    message: { type: 'string', example: '用户创建成功' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            username: { type: 'string', example: 'john_doe' },
                                            email: { type: 'string', example: 'john@example.com' },
                                            createdAt: { type: 'string', format: 'date-time' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '400': {
                    description: '请求参数错误',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 400 },
                                    message: { type: 'string', example: '参数错误' },
                                    errors: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                field: { type: 'string', example: 'email' },
                                                message: { type: 'string', example: '邮箱格式不正确' }
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
    },
    '/api/users/{id}': {
        ...GET({
            summary: '获取用户详情',
            description: '根据用户ID获取用户详细信息',
            tags: ['用户管理'],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: '用户ID',
                    schema: { type: 'integer' }
                }
            ],
            responses: {
                '200': {
                    description: '成功获取用户详情',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: '获取成功' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            username: { type: 'string', example: 'john_doe' },
                                            email: { type: 'string', example: 'john@example.com' },
                                            fullName: { type: 'string', example: 'John Doe' },
                                            createdAt: { type: 'string', format: 'date-time' },
                                            updatedAt: { type: 'string', format: 'date-time' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '404': {
                    description: '用户不存在',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 404 },
                                    message: { type: 'string', example: '用户不存在' }
                                }
                            }
                        }
                    }
                }
            }
        }),
        ...PUT({
            summary: '更新用户信息',
            description: '更新指定用户的信息',
            tags: ['用户管理'],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: '用户ID',
                    schema: { type: 'integer' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                username: {
                                    type: 'string',
                                    description: '用户名',
                                    example: 'john_doe'
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    description: '邮箱地址',
                                    example: 'john@example.com'
                                },
                                fullName: {
                                    type: 'string',
                                    description: '全名',
                                    example: 'John Doe'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: '用户信息更新成功',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: '更新成功' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            username: { type: 'string', example: 'john_doe' },
                                            email: { type: 'string', example: 'john@example.com' },
                                            updatedAt: { type: 'string', format: 'date-time' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }),
        ...DELETE({
            summary: '删除用户',
            description: '删除指定的用户',
            tags: ['用户管理'],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: '用户ID',
                    schema: { type: 'integer' }
                }
            ],
            responses: {
                '200': {
                    description: '用户删除成功',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer', example: 200 },
                                    message: { type: 'string', example: '删除成功' }
                                }
                            }
                        }
                    }
                }
            }
        })
    }
};
