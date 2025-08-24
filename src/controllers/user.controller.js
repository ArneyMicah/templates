import * as userService from "../services/user.service.js";
import { HTTP_STATUS, MESSAGES } from "../constants/index.js";
import pkg from 'koa-swagger-decorator';
const { request, summary, tags, body, responses, path, query } = pkg;

const tag = tags(['用户管理']);

/**
 * 用户控制器
 * 提供用户相关的API接口
 */
export default class UserController {

    /**
     * 获取用户列表
     */
    @request('get', '/users')
    @summary('获取用户列表')
    @tag
    @query({
        page: { type: 'number', required: false, description: '页码', default: 1 },
        limit: { type: 'number', required: false, description: '每页数量', default: 10 },
        search: { type: 'string', required: false, description: '搜索关键词' }
    })
    @responses({
        200: {
            description: '用户列表获取成功',
            schema: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: '用户列表获取成功' },
                    data: {
                        type: 'object',
                        properties: {
                            users: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer', example: 1 },
                                        username: { type: 'string', example: 'admin' },
                                        email: { type: 'string', example: 'admin@example.com' },
                                        role: { type: 'string', example: 'admin' },
                                        status: { type: 'string', example: 'active' },
                                        createdAt: { type: 'string', format: 'date-time' },
                                        updatedAt: { type: 'string', format: 'date-time' }
                                    }
                                }
                            },
                            pagination: {
                                type: 'object',
                                properties: {
                                    page: { type: 'integer', example: 1 },
                                    limit: { type: 'integer', example: 10 },
                                    total: { type: 'integer', example: 2 },
                                    totalPages: { type: 'integer', example: 1 }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    static async getUsers(ctx) {
        try {
            const { page, limit, search } = ctx.query;
            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                search: search || ''
            };

            const result = userService.getAllUsers(options);

            ctx.status = HTTP_STATUS.OK;
            ctx.body = {
                success: true,
                message: '用户列表获取成功',
                data: result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            ctx.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            ctx.body = {
                success: false,
                error: {
                    message: error.message,
                    code: 'USER_LIST_ERROR'
                }
            };
        }
    }

    /**
     * 获取单个用户
     */
    @request('get', '/users/{id}')
    @summary('获取单个用户')
    @tag
    @path({
        id: { type: 'integer', required: true, description: '用户ID' }
    })
    @responses({
        200: {
            description: '用户信息获取成功',
            schema: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: '用户信息获取成功' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 1 },
                            username: { type: 'string', example: 'admin' },
                            email: { type: 'string', example: 'admin@example.com' },
                            role: { type: 'string', example: 'admin' },
                            status: { type: 'string', example: 'active' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        }
                    }
                }
            }
        },
        404: {
            description: '用户不存在',
            schema: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                        type: 'object',
                        properties: {
                            message: { type: 'string', example: '用户不存在' },
                            code: { type: 'string', example: 'USER_NOT_FOUND' }
                        }
                    }
                }
            }
        }
    })
    static async getUser(ctx) {
        try {
            const { id } = ctx.params;
            const user = userService.findUserById(id);

            if (!user) {
                ctx.status = HTTP_STATUS.NOT_FOUND;
                ctx.body = {
                    success: false,
                    error: {
                        message: MESSAGES.USER_NOT_FOUND,
                        code: 'USER_NOT_FOUND'
                    }
                };
                return;
            }

            ctx.status = HTTP_STATUS.OK;
            ctx.body = {
                success: true,
                message: '用户信息获取成功',
                data: user,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            ctx.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            ctx.body = {
                success: false,
                error: {
                    message: error.message,
                    code: 'USER_GET_ERROR'
                }
            };
        }
    }

    /**
     * 创建用户
     */
    @request('post', '/users')
    @summary('创建新用户')
    @tag
    @body({
        username: { type: 'string', required: true, description: '用户名', example: 'newuser' },
        email: { type: 'string', required: true, description: '邮箱地址', example: 'newuser@example.com' },
        password: { type: 'string', required: true, description: '密码', example: 'password123' },
        role: { type: 'string', required: false, description: '用户角色', example: 'user', default: 'user' }
    })
    @responses({
        201: {
            description: '用户创建成功',
            schema: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: '用户创建成功' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 3 },
                            username: { type: 'string', example: 'newuser' },
                            email: { type: 'string', example: 'newuser@example.com' },
                            role: { type: 'string', example: 'user' },
                            status: { type: 'string', example: 'active' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        }
                    }
                }
            }
        },
        400: {
            description: '请求参数错误',
            schema: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                        type: 'object',
                        properties: {
                            message: { type: 'string', example: '用户名已存在' },
                            code: { type: 'string', example: 'USER_CREATE_ERROR' }
                        }
                    }
                }
            }
        }
    })
    static async createUser(ctx) {
        try {
            const { username, email, password, role } = ctx.request.body;

            // 参数验证
            if (!username || !email || !password) {
                ctx.status = HTTP_STATUS.BAD_REQUEST;
                ctx.body = {
                    success: false,
                    error: {
                        message: '用户名、邮箱和密码不能为空',
                        code: 'INVALID_PARAMETERS'
                    }
                };
                return;
            }

            const newUser = userService.createUser({ username, email, password, role });

            ctx.status = HTTP_STATUS.CREATED;
            ctx.body = {
                success: true,
                message: '用户创建成功',
                data: newUser,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            ctx.status = HTTP_STATUS.BAD_REQUEST;
            ctx.body = {
                success: false,
                error: {
                    message: error.message,
                    code: 'USER_CREATE_ERROR'
                }
            };
        }
    }

    /**
     * 更新用户
     */
    @request('put', '/users/{id}')
    @summary('更新用户信息')
    @tag
    @path({
        id: { type: 'integer', required: true, description: '用户ID' }
    })
    @body({
        username: { type: 'string', required: false, description: '用户名' },
        email: { type: 'string', required: false, description: '邮箱地址' },
        role: { type: 'string', required: false, description: '用户角色' },
        status: { type: 'string', required: false, description: '用户状态', enum: ['active', 'inactive'] }
    })
    @responses({
        200: {
            description: '用户更新成功',
            schema: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: '用户更新成功' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 1 },
                            username: { type: 'string', example: 'updateduser' },
                            email: { type: 'string', example: 'updated@example.com' },
                            role: { type: 'string', example: 'admin' },
                            status: { type: 'string', example: 'active' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        }
                    }
                }
            }
        },
        404: {
            description: '用户不存在',
            schema: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                        type: 'object',
                        properties: {
                            message: { type: 'string', example: '用户不存在' },
                            code: { type: 'string', example: 'USER_NOT_FOUND' }
                        }
                    }
                }
            }
        }
    })
    static async updateUser(ctx) {
        try {
            const { id } = ctx.params;
            const updateData = ctx.request.body;

            const updatedUser = userService.updateUser(id, updateData);

            if (!updatedUser) {
                ctx.status = HTTP_STATUS.NOT_FOUND;
                ctx.body = {
                    success: false,
                    error: {
                        message: MESSAGES.USER_NOT_FOUND,
                        code: 'USER_NOT_FOUND'
                    }
                };
                return;
            }

            ctx.status = HTTP_STATUS.OK;
            ctx.body = {
                success: true,
                message: '用户更新成功',
                data: updatedUser,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            ctx.status = HTTP_STATUS.BAD_REQUEST;
            ctx.body = {
                success: false,
                error: {
                    message: error.message,
                    code: 'USER_UPDATE_ERROR'
                }
            };
        }
    }

    /**
     * 删除用户
     */
    @request('delete', '/users/{id}')
    @summary('删除用户')
    @tag
    @path({
        id: { type: 'integer', required: true, description: '用户ID' }
    })
    @responses({
        200: {
            description: '用户删除成功',
            schema: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: '用户删除成功' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 1 },
                            username: { type: 'string', example: 'deleteduser' },
                            email: { type: 'string', example: 'deleted@example.com' },
                            role: { type: 'string', example: 'user' },
                            status: { type: 'string', example: 'active' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        }
                    }
                }
            }
        },
        404: {
            description: '用户不存在',
            schema: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                        type: 'object',
                        properties: {
                            message: { type: 'string', example: '用户不存在' },
                            code: { type: 'string', example: 'USER_NOT_FOUND' }
                        }
                    }
                }
            }
        }
    })
    static async deleteUser(ctx) {
        try {
            const { id } = ctx.params;
            const deletedUser = userService.deleteUser(id);

            if (!deletedUser) {
                ctx.status = HTTP_STATUS.NOT_FOUND;
                ctx.body = {
                    success: false,
                    error: {
                        message: MESSAGES.USER_NOT_FOUND,
                        code: 'USER_NOT_FOUND'
                    }
                };
                return;
            }

            ctx.status = HTTP_STATUS.OK;
            ctx.body = {
                success: true,
                message: '用户删除成功',
                data: deletedUser,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            ctx.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            ctx.body = {
                success: false,
                error: {
                    message: error.message,
                    code: 'USER_DELETE_ERROR'
                }
            };
        }
    }

    /**
     * 更新用户状态
     */
    @request('patch', '/users/{id}/status')
    @summary('更新用户状态')
    @tag
    @path({
        id: { type: 'integer', required: true, description: '用户ID' }
    })
    @body({
        status: { type: 'string', required: true, description: '用户状态', enum: ['active', 'inactive'] }
    })
    @responses({
        200: {
            description: '用户状态更新成功',
            schema: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: '用户状态更新成功' },
                    data: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 1 },
                            username: { type: 'string', example: 'admin' },
                            email: { type: 'string', example: 'admin@example.com' },
                            role: { type: 'string', example: 'admin' },
                            status: { type: 'string', example: 'inactive' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        }
                    }
                }
            }
        },
        404: {
            description: '用户不存在',
            schema: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                        type: 'object',
                        properties: {
                            message: { type: 'string', example: '用户不存在' },
                            code: { type: 'string', example: 'USER_NOT_FOUND' }
                        }
                    }
                }
            }
        }
    })
    static async updateUserStatus(ctx) {
        try {
            const { id } = ctx.params;
            const { status } = ctx.request.body;

            if (!status || !['active', 'inactive'].includes(status)) {
                ctx.status = HTTP_STATUS.BAD_REQUEST;
                ctx.body = {
                    success: false,
                    error: {
                        message: '状态必须是 active 或 inactive',
                        code: 'INVALID_STATUS'
                    }
                };
                return;
            }

            const updatedUser = userService.updateUserStatus(id, status);

            if (!updatedUser) {
                ctx.status = HTTP_STATUS.NOT_FOUND;
                ctx.body = {
                    success: false,
                    error: {
                        message: MESSAGES.USER_NOT_FOUND,
                        code: 'USER_NOT_FOUND'
                    }
                };
                return;
            }

            ctx.status = HTTP_STATUS.OK;
            ctx.body = {
                success: true,
                message: '用户状态更新成功',
                data: updatedUser,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            ctx.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            ctx.body = {
                success: false,
                error: {
                    message: error.message,
                    code: 'USER_STATUS_UPDATE_ERROR'
                }
            };
        }
    }
}
