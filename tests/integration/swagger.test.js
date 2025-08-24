/**
 * Swagger文档测试脚本
 * 用于验证Swagger文档是否正常工作
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3003';

/**
 * 测试健康检查接口
 */
async function testHealth() {
    try {
        console.log('🏥 测试健康检查接口...');
        const response = await fetch(`${BASE_URL}/health`);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ 健康检查通过:', data);
            return true;
        } else {
            console.log('❌ 健康检查失败:', data);
            return false;
        }
    } catch (error) {
        console.log('❌ 健康检查请求失败:', error.message);
        return false;
    }
}

/**
 * 测试Swagger JSON规范
 */
async function testSwaggerJson() {
    try {
        console.log('📖 测试Swagger JSON规范...');
        const response = await fetch(`${BASE_URL}/docs/swagger.json`);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ Swagger JSON规范获取成功');
            console.log('   - OpenAPI版本:', data.openapi);
            console.log('   - 标题:', data.info.title);
            console.log('   - 版本:', data.info.version);
            console.log('   - 路径数量:', Object.keys(data.paths || {}).length);
            return true;
        } else {
            console.log('❌ Swagger JSON规范获取失败:', data);
            return false;
        }
    } catch (error) {
        console.log('❌ Swagger JSON规范请求失败:', error.message);
        return false;
    }
}

/**
 * 测试Swagger UI配置
 */
async function testSwaggerUI() {
    try {
        console.log('🎨 测试Swagger UI配置...');
        const response = await fetch(`${BASE_URL}/docs/ui`);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ Swagger UI配置获取成功');
            console.log('   - 配置URL:', data.config.url);
            console.log('   - 支持的方法:', data.config.supportedSubmitMethods);
            return true;
        } else {
            console.log('❌ Swagger UI配置获取失败:', data);
            return false;
        }
    } catch (error) {
        console.log('❌ Swagger UI配置请求失败:', error.message);
        return false;
    }
}

/**
 * 测试Swagger文档信息
 */
async function testSwaggerInfo() {
    try {
        console.log('ℹ️  测试Swagger文档信息...');
        const response = await fetch(`${BASE_URL}/docs/info`);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ Swagger文档信息获取成功');
            console.log('   - 文档标题:', data.documentation.title);
            console.log('   - 文档版本:', data.documentation.version);
            console.log('   - 功能数量:', data.documentation.features.length);
            return true;
        } else {
            console.log('❌ Swagger文档信息获取失败:', data);
            return false;
        }
    } catch (error) {
        console.log('❌ Swagger文档信息请求失败:', error.message);
        return false;
    }
}

/**
 * 测试静态文件访问
 */
async function testStaticFiles() {
    try {
        console.log('📁 测试静态文件访问...');
        const response = await fetch(`${BASE_URL}/public/swagger.html`);

        if (response.ok) {
            const html = await response.text();
            if (html.includes('swagger-ui')) {
                console.log('✅ Swagger HTML页面访问成功');
                return true;
            } else {
                console.log('❌ Swagger HTML页面内容异常');
                return false;
            }
        } else {
            console.log('❌ Swagger HTML页面访问失败:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ 静态文件访问失败:', error.message);
        return false;
    }
}

/**
 * 运行所有Swagger测试
 */
async function runSwaggerTests() {
    console.log('🚀 开始Swagger文档功能测试...\n');

    const tests = [
        { name: '健康检查', fn: testHealth },
        { name: 'Swagger JSON规范', fn: testSwaggerJson },
        { name: 'Swagger UI配置', fn: testSwaggerUI },
        { name: 'Swagger文档信息', fn: testSwaggerInfo },
        { name: '静态文件访问', fn: testStaticFiles }
    ];

    let passed = 0;
    const total = tests.length;

    for (const test of tests) {
        console.log(`\n📋 测试: ${test.name}`);
        console.log('─'.repeat(50));

        const result = await test.fn();
        if (result) {
            passed++;
        }

        console.log('─'.repeat(50));
    }

    console.log(`\n📊 测试结果汇总:`);
    console.log(`   通过: ${passed}/${total}`);
    console.log(`   失败: ${total - passed}/${total}`);

    if (passed === total) {
        console.log('🎉 所有测试通过！Swagger文档功能正常');
    } else {
        console.log('⚠️  部分测试失败，请检查服务器状态');
    }

    console.log('\n🔗 访问地址:');
    console.log(`   • Swagger UI: ${BASE_URL}/public/swagger.html`);
    console.log(`   • API规范: ${BASE_URL}/docs/swagger.json`);
    console.log(`   • 文档信息: ${BASE_URL}/docs/info`);
}

// 如果直接运行此文件，则执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
    runSwaggerTests();
}

export {
    testHealth,
    testSwaggerJson,
    testSwaggerUI,
    testSwaggerInfo,
    testStaticFiles,
    runSwaggerTests
};
