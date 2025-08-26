#!/usr/bin/env node

/**
 * 数据库管理脚本
 * 用于命令行操作数据库
 */

import { connect, disconnect, syncDatabase } from '../src/database/index.js';
import { initializeModels } from '../src/models/index.js';
import { runMigrations, resetDatabase, checkDatabaseStatus } from '../src/database/migrations/index.js';
import { runSeeders } from '../src/database/seeders/index.js';
import logger from '../src/utils/logger.js';

// 获取命令行参数
const args = process.argv.slice(2);
const command = args[0];

/**
 * 显示帮助信息
 */
const showHelp = () => {
    console.log(`
数据库管理工具

用法: node scripts/database.js <command> [options]

命令:
  connect     连接数据库
  disconnect  断开数据库连接
  status      检查数据库状态
  migrate     运行数据库迁移
  reset       重置数据库（删除所有表并重新创建）
  seed        运行种子文件
  init        初始化数据库（连接 + 迁移 + 种子）

选项:
  --force     强制重建表（用于migrate和reset命令）
  --help      显示帮助信息

示例:
  node scripts/database.js init
  node scripts/database.js migrate --force
  node scripts/database.js status
`);
};

/**
 * 连接数据库
 */
const connectDB = async () => {
    try {
        await connect();
        logger.info('数据库连接成功');
    } catch (error) {
        logger.error('数据库连接失败:', error);
        process.exit(1);
    }
};

/**
 * 断开数据库连接
 */
const disconnectDB = async () => {
    try {
        await disconnect();
        logger.info('数据库连接已断开');
    } catch (error) {
        logger.error('断开数据库连接失败:', error);
        process.exit(1);
    }
};

/**
 * 检查数据库状态
 */
const checkStatus = async () => {
    try {
        const status = await checkDatabaseStatus();
        console.log('数据库状态:', status);
    } catch (error) {
        logger.error('检查数据库状态失败:', error);
        process.exit(1);
    }
};

/**
 * 运行迁移
 */
const migrate = async () => {
    try {
        const force = args.includes('--force');
        await connect();
        await initializeModels();
        await runMigrations(force);
        await disconnect();
        logger.info('数据库迁移完成');
    } catch (error) {
        logger.error('数据库迁移失败:', error);
        process.exit(1);
    }
};

/**
 * 重置数据库
 */
const reset = async () => {
    try {
        const force = args.includes('--force');
        if (!force) {
            console.log('警告: 重置数据库将删除所有数据！');
            console.log('请使用 --force 参数确认操作');
            process.exit(1);
        }

        await connect();
        await initializeModels();
        await resetDatabase();
        await disconnect();
        logger.info('数据库重置完成');
    } catch (error) {
        logger.error('数据库重置失败:', error);
        process.exit(1);
    }
};

/**
 * 运行种子文件
 */
const seed = async () => {
    try {
        await connect();
        await initializeModels();
        await runSeeders();
        await disconnect();
        logger.info('种子文件运行完成');
    } catch (error) {
        logger.error('运行种子文件失败:', error);
        process.exit(1);
    }
};

/**
 * 初始化数据库
 */
const init = async () => {
    try {
        await connect();
        await initializeModels();
        await syncDatabase(false);
        await runSeeders();
        await disconnect();
        logger.info('数据库初始化完成');
    } catch (error) {
        logger.error('数据库初始化失败:', error);
        process.exit(1);
    }
};

// 主函数
const main = async () => {
    if (args.includes('--help') || !command) {
        showHelp();
        return;
    }

    switch (command) {
        case 'connect':
            await connectDB();
            break;
        case 'disconnect':
            await disconnectDB();
            break;
        case 'status':
            await checkStatus();
            break;
        case 'migrate':
            await migrate();
            break;
        case 'reset':
            await reset();
            break;
        case 'seed':
            await seed();
            break;
        case 'init':
            await init();
            break;
        default:
            console.error(`未知命令: ${command}`);
            showHelp();
            process.exit(1);
    }
};

// 运行主函数
main().catch((error) => {
    logger.error('脚本执行失败:', error);
    process.exit(1);
});
