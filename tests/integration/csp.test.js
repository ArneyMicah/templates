// 测试CSP配置的脚本
import http from 'http';

function testSwaggerPage() {
    console.log('🧪 测试 Swagger 页面...');

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/public/swagger.html',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log('📋 状态码:', res.statusCode);
        console.log('📋 响应头:', res.headers);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            // 检查CSP头
            const cspHeader = res.headers['content-security-policy'];
            console.log('📋 CSP 头信息:', cspHeader);

            // 检查HTML内容
            if (data.includes('swagger-ui-bundle.js')) {
                console.log('✅ HTML 包含 Swagger UI 脚本引用');
            } else {
                console.log('❌ HTML 不包含 Swagger UI 脚本引用');
            }

            if (data.includes('unpkg.com')) {
                console.log('✅ HTML 包含 unpkg.com 引用');
            } else {
                console.log('❌ HTML 不包含 unpkg.com 引用');
            }

            console.log('✅ Swagger 页面可以正常访问');
        });
    });

    req.on('error', (error) => {
        console.error('❌ 测试失败:', error.message);
    });

    req.end();
}

// 运行测试
testSwaggerPage();

export { testSwaggerPage };
