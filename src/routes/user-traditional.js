/**
 * 用户路由 - 传统方式
 * 不使用Swagger装饰器，直接定义路由
 */

import Router from 'koa-router';
import * as userService from '../services/user.service.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

const router = new Router();

/**
 * 获取用户列表
 * GET /users
 */
router.get('/users', async (ctx) => {
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
});

/**
 * 创建用户
 * POST /users
 */
router.post('/users', async (ctx) => {
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
});

/**
 * 获取单个用户
 * GET /users/:id
 */
router.get('/users/:id', async (ctx) => {
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
});

/**
 * 更新用户
 * PUT /users/:id
 */
router.put('/users/:id', async (ctx) => {
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
});

/**
 * 删除用户
 * DELETE /users/:id
 */
router.delete('/users/:id', async (ctx) => {
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
});

/**
 * 更新用户状态
 * PATCH /users/:id/status
 */
router.patch('/users/:id/status', async (ctx) => {
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
});

export default router;
