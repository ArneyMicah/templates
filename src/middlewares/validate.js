import Joi from 'joi';
import logger from '../utils/logger.js';

/**
 * 参数验证中间件
 * 使用 Joi 进行参数验证
 */
export function validate() {
    return async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            // 如果是参数验证错误
            if (error.isJoi) {
                logger.warn('参数验证失败:', {
                    path: ctx.path,
                    method: ctx.method,
                    error: error.message
                });

                ctx.status = 422;
                ctx.body = {
                    success: false,
                    message: '参数验证失败',
                    errors: error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message
                    })),
                    timestamp: new Date().toISOString()
                };
                return;
            }

            // 其他错误继续抛出
            throw error;
        }
    };
}

/**
 * 创建验证器函数
 * @param {Object} schema - Joi 验证模式
 * @param {string} type - 验证类型 ('body', 'query', 'params')
 * @returns {Function} 验证中间件函数
 */
export function createValidator(schema, type = 'body') {
    return async (ctx, next) => {
        try {
            let data;
            switch (type) {
                case 'body':
                    data = ctx.request.body;
                    break;
                case 'query':
                    data = ctx.query;
                    break;
                case 'params':
                    data = ctx.params;
                    break;
                default:
                    data = ctx.request.body;
            }

            // 执行验证
            const { error, value } = schema.validate(data, {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true
            });

            if (error) {
                logger.warn('参数验证失败:', {
                    path: ctx.path,
                    method: ctx.method,
                    type,
                    errors: error.details
                });

                ctx.status = 422;
                ctx.body = {
                    success: false,
                    message: '参数验证失败',
                    errors: error.details.map(detail => ({
                        field: detail.path.join('.'),
                        message: detail.message
                    })),
                    timestamp: new Date().toISOString()
                };
                return;
            }

            // 将验证后的数据重新赋值
            switch (type) {
                case 'body':
                    ctx.request.body = value;
                    break;
                case 'query':
                    ctx.query = value;
                    break;
                case 'params':
                    ctx.params = value;
                    break;
            }

            await next();
        } catch (error) {
            logger.error('验证中间件错误:', error);
            throw error;
        }
    };
}

export default validate;
