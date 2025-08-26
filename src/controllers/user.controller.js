/**
 * 用户控制器
 * 处理用户相关的HTTP请求
 */

import { success, error, paginate } from './base.controller.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import { 
    createUser, 
    updateUser, 
    deleteUser, 
    getUsers, 
    findById,
    validateLogin
} from '../services/user.service.js';
import logger from '../utils/logger.js';

/**
 * 创建用户
 * @param {Object} ctx - Koa上下文
 */
export const createUserController = async (ctx) => {
    try {
        const userData = ctx.request.body;
        
        // 验证必需字段
        if (!userData.username || !userData.email || !userData.password) {
            return error(ctx, '用户名、邮箱和密码是必需的', HTTP_STATUS.BAD_REQUEST);
        }

        const newUser = await createUser(userData);
        logger.info(`用户创建成功: ${newUser.username}`);
        
        return success(ctx, newUser, '用户创建成功', HTTP_STATUS.CREATED);
    } catch (err) {
        logger.error('创建用户失败:', err);
        return error(ctx, err.message, HTTP_STATUS.BAD_REQUEST);
    }
};

/**
 * 获取用户列表
 * @param {Object} ctx - Koa上下文
 */
export const getUsersController = async (ctx) => {
    try {
        const { 
            page, 
            limit, 
            status, 
            role, 
            search, 
            sortBy, 
            sortOrder 
        } = ctx.query;
        
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            status,
            role,
            search,
            sortBy: sortBy || 'created_at',
            sortOrder: sortOrder || 'DESC'
        };

        const result = await getUsers(options);
        logger.info(`获取用户列表成功，共${result.pagination.total}条记录`);
        
        return paginate(
            ctx, 
            result.users, 
            result.pagination.total, 
            result.pagination.page, 
            result.pagination.limit
        );
    } catch (err) {
        logger.error('获取用户列表失败:', err);
        return error(ctx, '获取用户列表失败', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

/**
 * 根据ID获取用户
 * @param {Object} ctx - Koa上下文
 */
export const getUserByIdController = async (ctx) => {
    try {
        const { id } = ctx.params;
        const userId = parseInt(id);
        
        if (isNaN(userId)) {
            return error(ctx, '无效的用户ID', HTTP_STATUS.BAD_REQUEST);
        }

        const user = await findById(userId);
        if (!user) {
            return error(ctx, '用户不存在', HTTP_STATUS.NOT_FOUND);
        }

        logger.info(`获取用户成功: ${user.username}`);
        return success(ctx, user, '获取用户成功');
    } catch (err) {
        logger.error('获取用户失败:', err);
        return error(ctx, '获取用户失败', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

/**
 * 更新用户
 * @param {Object} ctx - Koa上下文
 */
export const updateUserController = async (ctx) => {
    try {
        const { id } = ctx.params;
        const userId = parseInt(id);
        const userData = ctx.request.body;
        
        if (isNaN(userId)) {
            return error(ctx, '无效的用户ID', HTTP_STATUS.BAD_REQUEST);
        }

        const updatedUser = await updateUser(userId, userData);
        if (!updatedUser) {
            return error(ctx, '用户不存在', HTTP_STATUS.NOT_FOUND);
        }

        logger.info(`用户更新成功: ${updatedUser.username}`);
        return success(ctx, updatedUser, '用户更新成功');
    } catch (err) {
        logger.error('更新用户失败:', err);
        return error(ctx, err.message, HTTP_STATUS.BAD_REQUEST);
    }
};

/**
 * 删除用户
 * @param {Object} ctx - Koa上下文
 */
export const deleteUserController = async (ctx) => {
    try {
        const { id } = ctx.params;
        const userId = parseInt(id);
        
        if (isNaN(userId)) {
            return error(ctx, '无效的用户ID', HTTP_STATUS.BAD_REQUEST);
        }

        const deletedUser = await deleteUser(userId);
        if (!deletedUser) {
            return error(ctx, '用户不存在', HTTP_STATUS.NOT_FOUND);
        }

        logger.info(`用户删除成功: ${deletedUser.username}`);
        return success(ctx, deletedUser, '用户删除成功');
    } catch (err) {
        logger.error('删除用户失败:', err);
        return error(ctx, err.message, HTTP_STATUS.BAD_REQUEST);
    }
};

/**
 * 用户登录
 * @param {Object} ctx - Koa上下文
 */
export const loginController = async (ctx) => {
    try {
        const { username, password } = ctx.request.body;
        
        // 验证必需字段
        if (!username || !password) {
            return error(ctx, '用户名和密码是必需的', HTTP_STATUS.BAD_REQUEST);
        }

        const user = await validateLogin(username, password);
        if (!user) {
            return error(ctx, '用户名或密码错误', HTTP_STATUS.UNAUTHORIZED);
        }

        logger.info(`用户登录成功: ${user.username}`);
        return success(ctx, user, '登录成功');
    } catch (err) {
        logger.error('用户登录失败:', err);
        return error(ctx, err.message, HTTP_STATUS.UNAUTHORIZED);
    }
};
