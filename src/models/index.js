import { getSequelize } from '../database/index.js';
import { defineUserModel } from './user.model.js';
import logger from '../utils/logger.js';

/**
 * Sequelize模型管理器
 */

// 存储模型实例
let models = null;

/**
 * 初始化所有模型
 * @returns {Promise<Object>} 模型对象
 */
export const initializeModels = async () => {
    try {
        const sequelize = getSequelize();

        if (!sequelize) {
            throw new Error('数据库未连接');
        }

        // 定义模型
        const User = defineUserModel(sequelize);

        // 在这里可以定义模型之间的关联关系
        // 例如：User.hasMany(Post), Post.belongsTo(User) 等

        // 存储模型实例
        models = { User };

        logger.info('所有模型已初始化');
        return models;
    } catch (error) {
        logger.error('模型初始化失败:', error);
        return null;
    }
};

/**
 * 获取所有模型
 * @returns {Object} 模型对象
 */
export const getModels = () => {
    if (!models) {
        const sequelize = getSequelize();
        if (!sequelize) {
            throw new Error('数据库未连接');
        }
        const User = defineUserModel(sequelize);
        models = { User };
    }
    return models;
};

// 导出模型定义函数
export { defineUserModel };
