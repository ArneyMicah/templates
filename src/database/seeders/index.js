import { initializeSampleData } from '../../services/user.service.js';
import logger from '../../utils/logger.js';

/**
 * 数据库种子文件管理工具
 */

/**
 * 运行所有种子文件
 * @returns {Promise<void>}
 */
export const runSeeders = async () => {
    try {
        logger.info('开始运行数据库种子文件...');

        // 运行用户种子数据
        await initializeSampleData();

        logger.info('数据库种子文件运行完成');
    } catch (error) {
        logger.error('运行数据库种子文件失败:', error);
        throw error;
    }
};

/**
 * 清除所有种子数据
 * @returns {Promise<void>}
 */
export const clearSeedData = async () => {
    try {
        logger.warn('开始清除种子数据...');

        // 这里可以添加清除种子数据的逻辑
        // 例如：删除特定标记的数据

        logger.info('种子数据清除完成');
    } catch (error) {
        logger.error('清除种子数据失败:', error);
        throw error;
    }
};

export default {
    runSeeders,
    clearSeedData
};
