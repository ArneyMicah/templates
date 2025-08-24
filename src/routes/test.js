import Router from 'koa-router';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import logger from '../utils/logger.js';

const router = new Router({
    prefix: '/test'
});

/**
 * 测试API路由
 * 提供各种测试功能的API端点
 */

// 基础测试端点
router.get('/', async (ctx) => {
    logger.info('🔧 收到基础测试请求');

    ctx.body = {
        success: true,
        message: '测试API服务正常运行',
        timestamp: new Date().toISOString(),
        data: {
            service: 'Test API',
            version: '1.0.0',
            status: 'active'
        }
    };
    ctx.status = HTTP_STATUS.OK;
});

// 模拟用户数据
const mockUsers = [
    {
        id: 1,
        username: 'testuser1',
        email: 'test1@example.com',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
        id: 2,
        username: 'testuser2',
        email: 'test2@example.com',
        role: 'admin',
        createdAt: '2024-01-02T00:00:00.000Z'
    },
    {
        id: 3,
        username: 'testuser3',
        email: 'test3@example.com',
        role: 'user',
        createdAt: '2024-01-03T00:00:00.000Z'
    }
];

// 获取所有测试用户
router.get('/users', async (ctx) => {
    logger.info('👥 收到获取测试用户列表请求');

    ctx.body = {
        success: true,
        message: '测试用户列表获取成功',
        timestamp: new Date().toISOString(),
        data: {
            users: mockUsers,
            total: mockUsers.length
        }
    };
    ctx.status = HTTP_STATUS.OK;
});

// 根据ID获取测试用户
router.get('/users/:id', async (ctx) => {
    const { id } = ctx.params;
    logger.info(`👤 收到获取测试用户请求，ID: ${id}`);

    const user = mockUsers.find(u => u.id === parseInt(id));

    if (!user) {
        ctx.status = HTTP_STATUS.NOT_FOUND;
        ctx.body = {
            success: false,
            message: '测试用户不存在',
            timestamp: new Date().toISOString()
        };
        return;
    }

    ctx.body = {
        success: true,
        message: '测试用户获取成功',
        timestamp: new Date().toISOString(),
        data: user
    };
    ctx.status = HTTP_STATUS.OK;
});

// 创建测试用户
router.post('/users', async (ctx) => {
    const { username, email, role = 'user' } = ctx.request.body;
    logger.info(`➕ 收到创建测试用户请求: ${username}`);

    if (!username || !email) {
        ctx.status = HTTP_STATUS.BAD_REQUEST;
        ctx.body = {
            success: false,
            message: '用户名和邮箱为必填项',
            timestamp: new Date().toISOString()
        };
        return;
    }

    const newUser = {
        id: mockUsers.length + 1,
        username,
        email,
        role,
        createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);

    ctx.body = {
        success: true,
        message: '测试用户创建成功',
        timestamp: new Date().toISOString(),
        data: newUser
    };
    ctx.status = HTTP_STATUS.CREATED;
});

// 更新测试用户
router.put('/users/:id', async (ctx) => {
    const { id } = ctx.params;
    const updateData = ctx.request.body;
    logger.info(`✏️ 收到更新测试用户请求，ID: ${id}`);

    const userIndex = mockUsers.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
        ctx.status = HTTP_STATUS.NOT_FOUND;
        ctx.body = {
            success: false,
            message: '测试用户不存在',
            timestamp: new Date().toISOString()
        };
        return;
    }

    mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
    };

    ctx.body = {
        success: true,
        message: '测试用户更新成功',
        timestamp: new Date().toISOString(),
        data: mockUsers[userIndex]
    };
    ctx.status = HTTP_STATUS.OK;
});

// 删除测试用户
router.delete('/users/:id', async (ctx) => {
    const { id } = ctx.params;
    logger.info(`��️ 收到删除测试用户请求，ID: ${id}`);

    const userIndex = mockUsers.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
        ctx.status = HTTP_STATUS.NOT_FOUND;
        ctx.body = {
            success: false,
            message: '测试用户不存在',
            timestamp: new Date().toISOString()
        };
        return;
    }

    const deletedUser = mockUsers.splice(userIndex, 1)[0];

    ctx.body = {
        success: true,
        message: '测试用户删除成功',
        timestamp: new Date().toISOString(),
        data: deletedUser
    };
    ctx.status = HTTP_STATUS.OK;
});

// 测试认证端点
router.post('/auth/login', async (ctx) => {
    const { username, password } = ctx.request.body;
    logger.info(`🔐 收到测试登录请求: ${username}`);

    if (!username || !password) {
        ctx.status = HTTP_STATUS.BAD_REQUEST;
        ctx.body = {
            success: false,
            message: '用户名和密码为必填项',
            timestamp: new Date().toISOString()
        };
        return;
    }

    // 模拟认证逻辑
    if (username === 'testuser' && password === 'testpass') {
        const token = 'mock-jwt-token-' + Date.now();

        ctx.body = {
            success: true,
            message: '测试登录成功',
            timestamp: new Date().toISOString(),
            data: {
                token,
                user: {
                    id: 1,
                    username: 'testuser',
                    email: 'test@example.com',
                    role: 'admin'
                }
            }
        };
        ctx.status = HTTP_STATUS.OK;
    } else {
        ctx.status = HTTP_STATUS.UNAUTHORIZED;
        ctx.body = {
            success: false,
            message: '用户名或密码错误',
            timestamp: new Date().toISOString()
        };
    }
});

// 测试文件上传端点
router.post('/upload', async (ctx) => {
    logger.info('�� 收到测试文件上传请求');

    const files = ctx.request.files;

    if (!files || Object.keys(files).length === 0) {
        ctx.status = HTTP_STATUS.BAD_REQUEST;
        ctx.body = {
            success: false,
            message: '没有上传文件',
            timestamp: new Date().toISOString()
        };
        return;
    }

    const uploadedFiles = [];

    for (const [fieldName, file] of Object.entries(files)) {
        uploadedFiles.push({
            fieldName,
            originalName: file.originalname,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            uploadTime: new Date().toISOString()
        });
    }

    ctx.body = {
        success: true,
        message: '测试文件上传成功',
        timestamp: new Date().toISOString(),
        data: {
            files: uploadedFiles,
            totalFiles: uploadedFiles.length
        }
    };
    ctx.status = HTTP_STATUS.CREATED;
});

// 测试错误端点
router.get('/error/:type', async (ctx) => {
    const { type } = ctx.params;
    logger.info(`❌ 收到测试错误请求，类型: ${type}`);

    switch (type) {
        case '400':
            ctx.status = HTTP_STATUS.BAD_REQUEST;
            ctx.body = {
                success: false,
                message: '测试400错误',
                timestamp: new Date().toISOString()
            };
            break;
        case '401':
            ctx.status = HTTP_STATUS.UNAUTHORIZED;
            ctx.body = {
                success: false,
                message: '测试401错误',
                timestamp: new Date().toISOString()
            };
            break;
        case '403':
            ctx.status = HTTP_STATUS.FORBIDDEN;
            ctx.body = {
                success: false,
                message: '测试403错误',
                timestamp: new Date().toISOString()
            };
            break;
        case '404':
            ctx.status = HTTP_STATUS.NOT_FOUND;
            ctx.body = {
                success: false,
                message: '测试404错误',
                timestamp: new Date().toISOString()
            };
            break;
        case '500':
            ctx.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            ctx.body = {
                success: false,
                message: '测试500错误',
                timestamp: new Date().toISOString()
            };
            break;
        default:
            ctx.status = HTTP_STATUS.BAD_REQUEST;
            ctx.body = {
                success: false,
                message: '无效的错误类型',
                timestamp: new Date().toISOString()
            };
    }
});

// 测试延迟响应端点
router.get('/delay/:seconds', async (ctx) => {
    const { seconds } = ctx.params;
    const delayMs = parseInt(seconds) * 1000;

    logger.info(`⏱️ 收到延迟测试请求，延迟: ${seconds}秒`);

    await new Promise(resolve => setTimeout(resolve, delayMs));

    ctx.body = {
        success: true,
        message: `延迟${seconds}秒后响应成功`,
        timestamp: new Date().toISOString(),
        data: {
            requestedDelay: parseInt(seconds),
            actualDelay: delayMs
        }
    };
    ctx.status = HTTP_STATUS.OK;
});

// 测试数据生成端点
router.get('/data/:type', async (ctx) => {
    const { type } = ctx.params;
    logger.info(`📊 收到数据生成请求，类型: ${type}`);

    let data = [];

    switch (type) {
        case 'posts':
            data = Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                title: `测试文章 ${i + 1}`,
                content: `这是第 ${i + 1} 篇测试文章的内容...`,
                author: `作者${i + 1}`,
                createdAt: new Date(Date.now() - i * 86400000).toISOString(),
                views: Math.floor(Math.random() * 1000)
            }));
            break;
        case 'products':
            data = Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                name: `测试产品 ${i + 1}`,
                price: Math.floor(Math.random() * 1000) + 10,
                category: ['电子产品', '服装', '食品', '家居'][Math.floor(Math.random() * 4)],
                stock: Math.floor(Math.random() * 100),
                createdAt: new Date(Date.now() - i * 86400000).toISOString()
            }));
            break;
        case 'orders':
            data = Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                orderNumber: `ORD-${String(i + 1).padStart(6, '0')}`,
                customer: `客户${i + 1}`,
                total: Math.floor(Math.random() * 1000) + 10,
                status: ['待付款', '已付款', '已发货', '已完成'][Math.floor(Math.random() * 4)],
                createdAt: new Date(Date.now() - i * 86400000).toISOString()
            }));
            break;
        default:
            ctx.status = HTTP_STATUS.BAD_REQUEST;
            ctx.body = {
                success: false,
                message: '无效的数据类型',
                timestamp: new Date().toISOString()
            };
            return;
    }

    ctx.body = {
        success: true,
        message: `${type}数据生成成功`,
        timestamp: new Date().toISOString(),
        data: {
            type,
            items: data,
            total: data.length
        }
    };
    ctx.status = HTTP_STATUS.OK;
});

export default router;
