import Router from 'koa-router';

const router = new Router();

/**
 * Swagger文档路由
 * 提供API文档访问和Swagger UI界面
 */

// Swagger文档主页
router.get('/', async (ctx) => {
    console.log('📚 收到Swagger文档请求');

    // 重定向到静态Swagger页面
    ctx.redirect('/public/swagger.html');

    console.log('✅ Swagger文档重定向完成');
});

// Swagger JSON规范
router.get('/swagger.json', async (ctx) => {
    console.log('📖 收到Swagger规范请求');

    try {
        // 导入Swagger配置
        const { getSwaggerConfig } = await import('../utils/swagger.js');
        const swaggerConfig = getSwaggerConfig();

        // 设置响应头
        ctx.set('Content-Type', 'application/json');
        ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate');

        // 返回Swagger规范
        ctx.body = swaggerConfig;
        ctx.status = 200;

        console.log('✅ Swagger规范生成完成');

    } catch (error) {
        console.error('❌ 生成Swagger规范失败:', error.message);

        ctx.status = 500;
        ctx.body = {
            success: false,
            error: {
                message: '生成Swagger规范失败',
                code: 'SWAGGER_GENERATION_FAILED',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        };
    }
});

// Swagger UI配置
router.get('/ui', async (ctx) => {
    console.log('🎨 收到Swagger UI配置请求');

    const uiConfig = {
        success: true,
        message: 'Swagger UI配置信息',
        config: {
            url: '/docs/swagger.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
                'SwaggerUIBundle.presets.apis',
                'SwaggerUIStandalonePreset'
            ],
            plugins: [
                'SwaggerUIBundle.plugins.DownloadUrl'
            ],
            layout: 'StandaloneLayout',
            validatorUrl: null,
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch']
        }
    };

    ctx.body = uiConfig;
    ctx.status = 200;

    console.log('✅ Swagger UI配置完成');
});

// API文档信息
router.get('/info', async (ctx) => {
    console.log('ℹ️  收到API文档信息请求');

    const docInfo = {
        success: true,
        message: 'API文档信息',
        documentation: {
            title: 'Koa Project API 文档',
            version: '1.0.0',
            description: '完整的API接口文档和测试工具',
            urls: {
                swagger: '/docs/swagger',
                json: '/docs/swagger.json',
                ui: '/docs/ui',
                testPage: '/public/test.html'
            },
            features: [
                '交互式API文档',
                '在线接口测试',
                '请求/响应示例',
                '认证信息',
                '错误码说明'
            ]
        },
        timestamp: new Date().toISOString()
    };

    ctx.body = docInfo;
    ctx.status = 200;

    console.log('✅ API文档信息查询完成');
});

export default router;
