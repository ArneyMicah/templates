import { getSequelize, syncDatabase } from '../index.js';
import logger from '../../utils/logger.js';

/**
 * 数据库迁移管理工具
 */

/**
 * 运行数据库迁移
 * @param {boolean} force - 是否强制重建表
 * @returns {Promise<void>}
 */
export const runMigrations = async (force = false) => {
    try {
        logger.info(`开始运行数据库迁移... (force: ${force})`);
        
        // 使用Sequelize的sync方法进行迁移
        await syncDatabase(force);
        
        logger.info('数据库迁移完成');
    } catch (error) {
        logger.error('数据库迁移失败:', error);
        throw error;
    }
};

/**
 * 重置数据库（删除所有表并重新创建）
 * @returns {Promise<void>}
 */
export const resetDatabase = async () => {
    try {
        logger.warn('开始重置数据库...');
        
        // 强制重建所有表
        await syncDatabase(true);
        
        logger.info('数据库重置完成');
    } catch (error) {
        logger.error('数据库重置失败:', error);
        throw error;
    }
};

/**
 * 检查数据库状态
 * @returns {Promise<Object>} 数据库状态信息
 */
export const checkDatabaseStatus = async () => {
    try {
        const sequelize = getSequelize();
        if (!sequelize) {
            return {
                status: 'disconnected',
                message: '数据库未连接'
            };
        }

        // 测试连接
        await sequelize.authenticate();
        
        // 获取表信息
        const tables = await sequelize.showAllSchemas();
        
        return {
            status: 'connected',
            message: '数据库连接正常',
            tables: tables.length
        };
    } catch (error) {
        logger.error('检查数据库状态失败:', error);
        return {
            status: 'error',
            message: error.message
        };
    }
};

export default {
    runMigrations,
    resetDatabase,
    checkDatabaseStatus
};
