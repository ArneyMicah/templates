import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';
import { database as dbConfig } from '../config/global.js';

/**
 * Sequelize数据库连接管理
 */

// Sequelize实例
let sequelize = null;
let isConnected = false;

/**
 * 初始化Sequelize连接
 * @returns {Promise<Sequelize>} Sequelize实例
 */
export const connect = async () => {
    try {
        logger.info('正在连接数据库...');

        // 创建Sequelize实例
        sequelize = new Sequelize(
            dbConfig.database,
            dbConfig.username,
            dbConfig.password,
            {
                host: dbConfig.host,
                port: dbConfig.port,
                dialect: dbConfig.dialect,
                logging: dbConfig.logging ? console.log : false,
                pool: dbConfig.pool,
                timezone: dbConfig.timezone || '+08:00',
                charset: dbConfig.charset || 'utf8mb4',
                collate: dbConfig.collate || 'utf8mb4_unicode_ci',
                define: {
                    timestamps: true,
                    underscored: true,
                    freezeTableName: true,
                    charset: 'utf8mb4',
                    collate: 'utf8mb4_unicode_ci'
                }
            }
        );

        // 测试连接
        await sequelize.authenticate();
        isConnected = true;
        logger.info('数据库连接成功');

        return sequelize;
    } catch (error) {
        logger.error('数据库连接失败:', error);
        isConnected = false;
        throw error;
    }
};

/**
 * 关闭数据库连接
 * @returns {Promise<void>}
 */
export const disconnect = async () => {
    try {
        if (sequelize) {
            logger.info('正在关闭数据库连接...');
            await sequelize.close();
            isConnected = false;
            logger.info('数据库连接已关闭');
        }
    } catch (error) {
        logger.error('关闭数据库连接失败:', error);
        throw error;
    }
};

/**
 * 检查数据库连接状态
 * @returns {boolean} 连接状态
 */
export const isDatabaseConnected = () => {
    return isConnected;
};

/**
 * 获取Sequelize实例
 * @returns {Sequelize|null} Sequelize实例
 */
export const getSequelize = () => {
    return sequelize;
};

/**
 * 同步数据库模型（开发环境使用）
 * @param {boolean} force - 是否强制重建表
 * @returns {Promise<void>}
 */
export const syncDatabase = async (force = false) => {
    try {
        if (!sequelize) {
            throw new Error('数据库未连接');
        }

        logger.info(`正在同步数据库模型... (force: ${force})`);
        await sequelize.sync({ force });
        logger.info('数据库模型同步完成');
    } catch (error) {
        logger.error('数据库模型同步失败:', error);
        throw error;
    }
};

/**
 * 获取数据库配置信息（不包含敏感信息）
 * @returns {Object} 数据库配置
 */
export const getDatabaseInfo = () => {
    return {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        dialect: dbConfig.dialect,
        timezone: dbConfig.timezone || '+08:00',
        charset: dbConfig.charset || 'utf8mb4',
        isConnected: isConnected
    };
};

/**
 * 执行数据库健康检查
 * @returns {Promise<Object>} 健康检查结果
 */
export const healthCheck = async () => {
    try {
        if (!sequelize) {
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: '数据库未连接'
            };
        }

        // 执行简单查询测试连接
        await sequelize.authenticate();

        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: getDatabaseInfo()
        };
    } catch (error) {
        logger.error('数据库健康检查失败:', error);
        return {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        };
    }
};
