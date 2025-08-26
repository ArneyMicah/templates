/**
 * 用户路由
 * 定义用户相关的API端点
 */

import Router from 'koa-router';
import {
    createUserController,
    getUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    loginController
} from '../controllers/user.controller.js';

// 创建用户路由器
const router = new Router();

/**
 * 用户路由配置
 * 
 * POST   /api/users/login    - 用户登录
 * GET    /api/users          - 获取用户列表
 * POST   /api/users          - 创建新用户
 * GET    /api/users/:id      - 根据ID获取用户详情
 * PUT    /api/users/:id      - 更新用户信息
 * DELETE /api/users/:id      - 删除用户
 */

// 用户登录
router.post('/login', loginController);

// 获取用户列表
router.get('/', getUsersController);

// 创建新用户
router.post('/', createUserController);

// 根据ID获取用户详情
router.get('/:id', getUserByIdController);

// 更新用户信息
router.put('/:id', updateUserController);

// 删除用户
router.delete('/:id', deleteUserController);

export default router;
