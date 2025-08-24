import Router from 'koa-router';

const router = new Router();

/**
 * Swagger文档路由
 * 提供API文档访问和Swagger UI界面
 * 支持OpenAPI 3.0规范的文档生成和展示
 */

// Swagger文档主页 - 重定向到静态Swagger页面
router.get('/', async (ctx) => {
    try {
        // 重定向到静态Swagger页面
        ctx.redirect('/public/swagger.html');
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: {
                message: 'Swagger文档访问失败',
                code: 'SWAGGER_REDIRECT_FAILED',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        };
    }
});

// Swagger JSON规范 - 提供OpenAPI 3.0规范的JSON文档
router.get('/swagger.json', async (ctx) => {
    try {
        // 由于使用装饰器，Swagger规范由koa-swagger-decorator自动生成
        // 这里返回一个基本的OpenAPI 3.0规范
        const swaggerConfig = {
            openapi: '3.0.0',
            info: {
                title: 'Koa Project API',
                description: '基于Koa.js构建的现代化Web API服务',
                version: '1.0.0',
                contact: {
                    name: '开发团队',
                    email: 'dev@example.com'
                }
            },
            servers: [
                {
                    url: 'http://localhost:3003',
                    description: '开发环境服务器'
                }
            ],
            paths: {},
            components: {
                securitySchemes: {
                    Bearer: {
                        type: 'apiKey',
                        name: 'Authorization',
                        in: 'header',
                        description: 'JWT认证令牌'
                    }
                }
            }
        };

        // 设置响应头
        ctx.set('Content-Type', 'application/json');
        ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        ctx.set('Pragma', 'no-cache');
        ctx.set('Expires', '0');

        // 返回Swagger规范
        ctx.body = swaggerConfig;
        ctx.status = 200;

    } catch (error) {
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

// Swagger UI配置 - 提供UI配置信息
router.get('/ui', async (ctx) => {
    try {
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
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                docExpansion: 'list',
                filter: true,
                showRequestHeaders: true,
                showCommonExtensions: true
            },
            timestamp: new Date().toISOString()
        };

        ctx.body = uiConfig;
        ctx.status = 200;

    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: {
                message: '生成Swagger UI配置失败',
                code: 'SWAGGER_UI_CONFIG_FAILED',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        };
    }
});

// API文档信息 - 提供文档相关的元信息
router.get('/info', async (ctx) => {
    try {
        const docInfo = {
            success: true,
            message: 'API文档信息',
            documentation: {
                title: 'Koa Project API 文档',
                version: '1.0.0',
                description: '完整的API接口文档和测试工具，支持OpenAPI 3.0规范',
                urls: {
                    swagger: '/docs/swagger',
                    json: '/docs/swagger.json',
                    ui: '/docs/ui',
                    testPage: '/public/test.html',
                    healthCheck: '/health',
                    apiInfo: '/api'
                },
                features: [
                    '交互式API文档',
                    '在线接口测试',
                    '请求/响应示例',
                    '认证信息管理',
                    '错误码说明',
                    'OpenAPI 3.0规范支持'
                ],
                specifications: {
                    openapi: '3.0.0',
                    format: 'JSON',
                    validation: '内置验证器'
                }
            },
            server: {
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            },
            timestamp: new Date().toISOString()
        };

        ctx.body = docInfo;
        ctx.status = 200;

    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: {
                message: '获取API文档信息失败',
                code: 'API_DOC_INFO_FAILED',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        };
    }
});

// 健康检查 - 检查Swagger服务状态
router.get('/health', async (ctx) => {
    try {
        const healthInfo = {
            success: true,
            message: 'Swagger服务运行正常',
            status: 'healthy',
            service: 'swagger-docs',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            endpoints: {
                swagger: '/docs/swagger',
                json: '/docs/swagger.json',
                ui: '/docs/ui',
                info: '/docs/info'
            }
        };

        ctx.body = healthInfo;
        ctx.status = 200;

    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Swagger服务异常',
            status: 'unhealthy',
            error: {
                message: 'Swagger健康检查失败',
                code: 'SWAGGER_HEALTH_CHECK_FAILED',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            timestamp: new Date().toISOString()
        };
    }
});

export default router;
