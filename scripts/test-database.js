import { Sequelize } from 'sequelize';
import { database as dbConfig } from '../src/config/global.js';

/**
 * 数据库连接测试脚本
 * 用于诊断数据库连接问题
 */

console.log('🔍 开始测试数据库连接...');
console.log('📋 数据库配置信息:');
console.log(`   主机: ${dbConfig.host}`);
console.log(`   端口: ${dbConfig.port}`);
console.log(`   数据库: ${dbConfig.database}`);
console.log(`   用户名: ${dbConfig.username}`);
console.log(`   方言: ${dbConfig.dialect}`);
console.log('');

async function testDatabaseConnection() {
    let sequelize = null;
    
    try {
        console.log('🔄 正在创建数据库连接...');
        
        // 创建Sequelize实例
        sequelize = new Sequelize(
            dbConfig.database,
            dbConfig.username,
            dbConfig.password,
            {
                host: dbConfig.host,
                port: dbConfig.port,
                dialect: dbConfig.dialect,
                logging: console.log,
                pool: {
                    max: 1,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },
                retry: {
                    max: 3,
                    timeout: 10000
                }
            }
        );

        console.log('🔐 正在测试连接...');
        
        // 测试连接
        await sequelize.authenticate();
        
        console.log('✅ 数据库连接成功！');
        
        // 测试查询
        console.log('🔍 正在测试查询...');
        const [results] = await sequelize.query('SELECT 1 as test');
        console.log('✅ 查询测试成功:', results);
        
        // 检查数据库是否存在
        console.log('🔍 正在检查数据库...');
        const [databases] = await sequelize.query('SHOW DATABASES');
        const dbExists = databases.some(db => db.Database === dbConfig.database);
        
        if (dbExists) {
            console.log(`✅ 数据库 '${dbConfig.database}' 存在`);
        } else {
            console.log(`⚠️  数据库 '${dbConfig.database}' 不存在`);
            console.log('📝 可用的数据库:');
            databases.forEach(db => {
                console.log(`   - ${db.Database}`);
            });
        }
        
    } catch (error) {
        console.error('❌ 数据库连接失败:');
        console.error('   错误类型:', error.constructor.name);
        console.error('   错误消息:', error.message);
        
        // 提供具体的错误诊断
        if (error.message.includes('ECONNREFUSED')) {
            console.error('\n💡 诊断建议:');
            console.error('   - 检查MySQL服务是否正在运行');
            console.error('   - 检查主机地址和端口是否正确');
            console.error('   - 检查防火墙设置');
        } else if (error.message.includes('Access denied')) {
            console.error('\n💡 诊断建议:');
            console.error('   - 检查用户名和密码是否正确');
            console.error('   - 检查用户是否有访问权限');
            console.error('   - 检查用户是否允许从当前主机连接');
        } else if (error.message.includes('Unknown database')) {
            console.error('\n💡 诊断建议:');
            console.error('   - 数据库不存在，需要先创建数据库');
            console.error('   - 或者修改配置中的数据库名称');
        }
        
        process.exit(1);
    } finally {
        if (sequelize) {
            await sequelize.close();
            console.log('🔒 数据库连接已关闭');
        }
    }
}

// 运行测试
testDatabaseConnection().catch(error => {
    console.error('❌ 测试过程中发生未预期的错误:', error);
    process.exit(1);
});
