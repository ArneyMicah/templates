/**
 * 用户路由
 * 提供用户相关的API接口
 */

import Router from 'koa-router';
import { UserController } from '../controllers/user.controller.js';
import { createValidator } from '../middlewares/validate.js';
import { userSchemas, commonSchemas } from '../utils/validators.js';

const router = new Router();
const userController = new UserController();

// 获取所有用户（支持分页、过滤和搜索）
router.get('/', 
    createValidator(commonSchemas.pagination, 'query'),
    async (ctx) => {
        await userController.getAllUsers(ctx);
    }
);

// 获取用户统计信息
router.get('/stats', async (ctx) => {
    await userController.getUserStats(ctx);
});

// 搜索用户
router.get('/search', 
    createValidator(commonSchemas.search, 'query'),
    async (ctx) => {
        await userController.searchUsers(ctx);
    }
);

// 根据角色获取用户
router.get('/role/:role', async (ctx) => {
    await userController.getUsersByRole(ctx);
});

// 根据状态获取用户
router.get('/status/:status', async (ctx) => {
    await userController.getUsersByStatus(ctx);
});

// 根据ID获取用户
router.get('/:id', 
    createValidator(userSchemas.userId, 'params'),
    async (ctx) => {
        await userController.getUserById(ctx);
    }
);

// 创建用户
router.post('/', 
    createValidator(userSchemas.createUser, 'body'),
    async (ctx) => {
        await userController.createUser(ctx);
    }
);

// 批量删除用户
router.post('/delete-batch', async (ctx) => {
    await userController.deleteUsers(ctx);
});

// 更新用户
router.put('/:id', 
    createValidator(userSchemas.userId, 'params'),
    createValidator(userSchemas.updateUser, 'body'),
    async (ctx) => {
        await userController.updateUser(ctx);
    }
);

// 更新用户状态
router.patch('/:id/status', 
    createValidator(userSchemas.userId, 'params'),
    async (ctx) => {
        await userController.updateUserStatus(ctx);
    }
);

// 删除用户
router.delete('/:id', 
    createValidator(userSchemas.userId, 'params'),
    async (ctx) => {
        await userController.deleteUser(ctx);
    }
);

export default router;
