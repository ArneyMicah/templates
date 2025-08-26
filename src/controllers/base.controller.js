import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

/**
 * 基础控制器函数
 * 提供通用的响应方法
 */

/**
 * 成功响应
 * @param {Object} ctx - Koa上下文
 * @param {*} data - 响应数据
 * @param {string} message - 响应消息
 * @param {number} status - HTTP状态码
 */
export const success = (ctx, data = null, message = MESSAGES.SUCCESS, status = HTTP_STATUS.OK) => {
    ctx.status = status;
    ctx.body = {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    };
};

/**
 * 错误响应
 * @param {Object} ctx - Koa上下文
 * @param {string} message - 错误消息
 * @param {number} status - HTTP状态码
 * @param {*} data - 错误详情
 */
export const error = (ctx, message = MESSAGES.FAILED, status = HTTP_STATUS.BAD_REQUEST, data = null) => {
    ctx.status = status;
    ctx.body = {
        success: false,
        message,
        data,
        timestamp: new Date().toISOString()
    };
};

/**
 * 分页响应
 * @param {Object} ctx - Koa上下文
 * @param {Array} data - 数据列表
 * @param {number} total - 总数
 * @param {number} page - 当前页
 * @param {number} limit - 每页数量
 */
export const paginate = (ctx, data, total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    
    ctx.status = HTTP_STATUS.OK;
    ctx.body = {
        success: true,
        message: MESSAGES.SUCCESS,
        data: {
            list: data,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        },
        timestamp: new Date().toISOString()
    };
};



