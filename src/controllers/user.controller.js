/**
 * 用户控制器
 * 处理用户相关的HTTP请求
 */

import { BaseController } from './base.controller.js';
import { UserService } from '../services/user.service.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export class UserController extends BaseController {
    constructor() {
        super();
        this.userService = new UserService();
    }

    /**
     * 获取所有用户
     * @param {Object} ctx - Koa上下文
     */
    async getAllUsers(ctx) {
        try {
            const { page = 1, limit = 10, role, status, search } = ctx.query;

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                role,
                status,
                search
            };

            const result = this.userService.getUsers(options);

            this.success(ctx, {
                users: result.users,
                pagination: result.pagination
            }, '获取用户列表成功');
        } catch (error) {
            this.error(ctx, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 根据ID获取用户
     * @param {Object} ctx - Koa上下文
     */
    async getUserById(ctx) {
        try {
            const { id } = ctx.params;
            const user = this.userService.findById(id);

            if (!user) {
                return this.error(ctx, '用户不存在', HTTP_STATUS.NOT_FOUND);
            }

            this.success(ctx, user, '获取用户信息成功');
        } catch (error) {
            this.error(ctx, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 创建用户
     * @param {Object} ctx - Koa上下文
     */
    async createUser(ctx) {
        try {
            const userData = ctx.request.body;

            // 验证必填字段
            if (!userData.username || !userData.email) {
                return this.error(ctx, '用户名和邮箱为必填字段', HTTP_STATUS.BAD_REQUEST);
            }

            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                return this.error(ctx, '邮箱格式不正确', HTTP_STATUS.BAD_REQUEST);
            }

            const newUser = this.userService.createUser(userData);

            this.success(ctx, newUser, '用户创建成功', HTTP_STATUS.CREATED);
        } catch (error) {
            if (error.message.includes('已存在')) {
                this.error(ctx, error.message, HTTP_STATUS.CONFLICT);
            } else {
                this.error(ctx, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
        }
    }

    /**
     * 更新用户
     * @param {Object} ctx - Koa上下文
     */
    async updateUser(ctx) {
        try {
            const { id } = ctx.params;
            const userData = ctx.request.body;

            // 验证邮箱格式（如果提供了邮箱）
            if (userData.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(userData.email)) {
                    return this.error(ctx, '邮箱格式不正确', HTTP_STATUS.BAD_REQUEST);
                }
            }

            const updatedUser = this.userService.updateUser(id, userData);

            if (!updatedUser) {
                return this.error(ctx, '用户不存在', HTTP_STATUS.NOT_FOUND);
            }

            this.success(ctx, updatedUser, '用户更新成功');
        } catch (error) {
            if (error.message.includes('已存在')) {
                this.error(ctx, error.message, HTTP_STATUS.CONFLICT);
            } else {
                this.error(ctx, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
        }
    }

    /**
     * 删除用户
     * @param {Object} ctx - Koa上下文
     */
    async deleteUser(ctx) {
        try {
            const { id } = ctx.params;
            const deletedUser = this.userService.deleteUser(id);

            if (!deletedUser) {
                return this.error(ctx, '用户不存在', HTTP_STATUS.NOT_FOUND);
            }

            this.success(ctx, deletedUser, '用户删除成功');
        } catch (error) {
            this.error(ctx, error.message, HTTP_STATUS.BAD_REQUEST);
        }
    }

    /**
     * 批量删除用户
     * @param {Object} ctx - Koa上下文
     */
    async deleteUsers(ctx) {
        try {
            const { ids } = ctx.request.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                return this.error(ctx, '请提供要删除的用户ID数组', HTTP_STATUS.BAD_REQUEST);
            }

            const result = this.userService.deleteUsers(ids);

            this.success(ctx, result, '批量删除用户完成');
        } catch (error) {
            this.error(ctx, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 更新用户状态
     * @param {Object} ctx - Koa上下文
     */
    async updateUserStatus(ctx) {
        try {
            const { id } = ctx.params;
            const { status } = ctx.request.body;

            if (!status) {
                return this.error(ctx, '状态字段为必填', HTTP_STATUS.BAD_REQUEST);
            }

            const updatedUser = this.userService.updateUserStatus(id, status);

            if (!updatedUser) {
                return this.error(ctx, '用户不存在', HTTP_STATUS.NOT_FOUND);
            }

            this.success(ctx, updatedUser, '用户状态更新成功');
        } catch (error) {
            this.error(ctx, error.message, HTTP_STATUS.BAD_REQUEST);
        }
    }

    /**
     * 获取用户统计信息
     * @param {Object} ctx - Koa上下文
     */
    async getUserStats(ctx) {
        try {
            const stats = this.userService.getUserStats();
            this.success(ctx, stats, '获取用户统计信息成功');
        } catch (error) {
            this.error(ctx, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 搜索用户
     * @param {Object} ctx - Koa上下文
     */
    async searchUsers(ctx) {
        try {
            const { q, page = 1, limit = 10 } = ctx.query;

            if (!q) {
                return this.error(ctx, '搜索关键词为必填', HTTP_STATUS.BAD_REQUEST);
            }

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                search: q
            };

            const result = this.userService.getUsers(options);

            this.success(ctx, {
                users: result.users,
                pagination: result.pagination,
                searchTerm: q
            }, '搜索用户完成');
        } catch (error) {
            this.error(ctx, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 根据角色获取用户
     * @param {Object} ctx - Koa上下文
     */
    async getUsersByRole(ctx) {
        try {
            const { role } = ctx.params;
            const { page = 1, limit = 10 } = ctx.query;

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                role
            };

            const result = this.userService.getUsers(options);

            this.success(ctx, {
                users: result.users,
                pagination: result.pagination,
                role
            }, `获取${role}角色用户列表成功`);
        } catch (error) {
            this.error(ctx, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 根据状态获取用户
     * @param {Object} ctx - Koa上下文
     */
    async getUsersByStatus(ctx) {
        try {
            const { status } = ctx.params;
            const { page = 1, limit = 10 } = ctx.query;

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                status
            };

            const result = this.userService.getUsers(options);

            this.success(ctx, {
                users: result.users,
                pagination: result.pagination,
                status
            }, `获取${status}状态用户列表成功`);
        } catch (error) {
            this.error(ctx, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}
