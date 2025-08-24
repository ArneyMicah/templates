import Joi from 'joi';

// 用户相关验证模式
export const userSchemas = {
    // 创建用户
    createUser: Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.min': '用户名至少需要3个字符',
                'string.max': '用户名不能超过30个字符',
                'any.required': '用户名是必填项'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': '请输入有效的邮箱地址',
                'any.required': '邮箱是必填项'
            }),
        password: Joi.string()
            .min(6)
            .max(100)
            .required()
            .messages({
                'string.min': '密码至少需要6个字符',
                'string.max': '密码不能超过100个字符',
                'any.required': '密码是必填项'
            }),
        age: Joi.number()
            .integer()
            .min(0)
            .max(150)
            .optional()
            .messages({
                'number.base': '年龄必须是数字',
                'number.integer': '年龄必须是整数',
                'number.min': '年龄不能小于0',
                'number.max': '年龄不能大于150'
            })
    }),

    // 更新用户
    updateUser: Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .optional()
            .messages({
                'string.min': '用户名至少需要3个字符',
                'string.max': '用户名不能超过30个字符'
            }),
        email: Joi.string()
            .email()
            .optional()
            .messages({
                'string.email': '请输入有效的邮箱地址'
            }),
        age: Joi.number()
            .integer()
            .min(0)
            .max(150)
            .optional()
            .messages({
                'number.base': '年龄必须是数字',
                'number.integer': '年龄必须是整数',
                'number.min': '年龄不能小于0',
                'number.max': '年龄不能大于150'
            })
    }),

    // 用户ID参数
    userId: Joi.object({
        id: Joi.string()
            .required()
            .messages({
                'any.required': '用户ID是必填项'
            })
    })
};

// 通用验证模式
export const commonSchemas = {
    // 分页参数
    pagination: Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .messages({
                'number.base': '页码必须是数字',
                'number.integer': '页码必须是整数',
                'number.min': '页码不能小于1'
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .messages({
                'number.base': '每页数量必须是数字',
                'number.integer': '每页数量必须是整数',
                'number.min': '每页数量不能小于1',
                'number.max': '每页数量不能超过100'
            })
    }),

    // 搜索参数
    search: Joi.object({
        q: Joi.string()
            .min(1)
            .max(100)
            .optional()
            .messages({
                'string.min': '搜索关键词至少需要1个字符',
                'string.max': '搜索关键词不能超过100个字符'
            })
    })
};

// 导出所有验证模式
export default {
    user: userSchemas,
    common: commonSchemas
};
