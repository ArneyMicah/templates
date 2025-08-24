/**
 * 用户服务函数
 * 提供用户相关的业务逻辑
 */

import {
    initializeData,
    create,
    findById as baseFindById,
    update,
    deleteRecord,
    getAllData
} from './base.service.js';

// 初始化示例数据
const initializeSampleData = () => {
    const sampleUsers = [
        {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            password: 'hashed_password_here',
            role: 'admin',
            status: 'active',
            firstName: '管理员',
            lastName: '系统',
            phone: '13800138000',
            avatar: 'https://example.com/avatar1.jpg',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 2,
            username: 'user1',
            email: 'user1@example.com',
            password: 'hashed_password_here',
            role: 'user',
            status: 'active',
            firstName: '张三',
            lastName: '李',
            phone: '13800138001',
            avatar: 'https://example.com/avatar2.jpg',
            createdAt: '2024-01-02T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z'
        },
        {
            id: 3,
            username: 'user2',
            email: 'user2@example.com',
            password: 'hashed_password_here',
            role: 'user',
            status: 'inactive',
            firstName: '王五',
            lastName: '赵',
            phone: '13800138002',
            avatar: 'https://example.com/avatar3.jpg',
            createdAt: '2024-01-03T00:00:00.000Z',
            updatedAt: '2024-01-03T00:00:00.000Z'
        }
    ];

    initializeData(sampleUsers);
};

// 初始化用户数据
initializeSampleData();

/**
 * 根据ID查找用户
 * @param {number} id - 用户ID
 * @returns {Object|null} 找到的用户或null
 */
export const findById = (id) => {
    return baseFindById(id);
};

/**
 * 根据用户名查找用户
 * @param {string} username - 用户名
 * @returns {Object|null} 找到的用户或null
 */
export const findByUsername = (username) => {
    const data = getAllData();
    return data.find(user => user.username === username) || null;
};

/**
 * 根据邮箱查找用户
 * @param {string} email - 邮箱
 * @returns {Object|null} 找到的用户或null
 */
export const findByEmail = (email) => {
    const data = getAllData();
    return data.find(user => user.email === email) || null;
};

/**
 * 创建用户
 * @param {Object} userData - 用户数据
 * @returns {Object} 创建的用户
 */
export const createUser = (userData) => {
    // 检查用户名是否已存在
    if (findByUsername(userData.username)) {
        throw new Error('用户名已存在');
    }

    // 检查邮箱是否已存在
    if (findByEmail(userData.email)) {
        throw new Error('邮箱已存在');
    }

    // 设置默认值
    const newUser = {
        ...userData,
        role: userData.role || 'user',
        status: userData.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return create(newUser);
};

/**
 * 更新用户
 * @param {number} id - 用户ID
 * @param {Object} userData - 用户数据
 * @returns {Object|null} 更新后的用户或null
 */
export const updateUser = (id, userData) => {
    const existingUser = findById(id);
    if (!existingUser) {
        return null;
    }

    // 检查用户名是否被其他用户使用
    if (userData.username && userData.username !== existingUser.username) {
        const userWithSameUsername = findByUsername(userData.username);
        if (userWithSameUsername) {
            throw new Error('用户名已存在');
        }
    }

    // 检查邮箱是否被其他用户使用
    if (userData.email && userData.email !== existingUser.email) {
        const userWithSameEmail = findByEmail(userData.email);
        if (userWithSameEmail) {
            throw new Error('邮箱已存在');
        }
    }

    return update(id, {
        ...userData,
        updatedAt: new Date().toISOString()
    });
};

/**
 * 获取用户列表（支持分页）
 * @param {Object} options - 查询选项
 * @returns {Object} 用户列表和分页信息
 */
export const getUsers = (options = {}) => {
    const { page = 1, limit = 10 } = options;
    const allUsers = [...getAllData()];

    const total = allUsers.length;
    const offset = (page - 1) * limit;
    const users = allUsers.slice(offset, offset + limit);

    return {
        users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    };
};

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Object|null} 删除的用户或null
 */
export const deleteUser = (id) => {
    const user = findById(id);
    if (!user) {
        return null;
    }

    // 防止删除管理员用户
    if (user.role === 'admin') {
        throw new Error('不能删除管理员用户');
    }

    return deleteRecord(id);
};

// 保持向后兼容性，导出UserService对象
export const UserService = {
    findByUsername,
    findByEmail,
    createUser,
    updateUser,
    getUsers,
    deleteUser,
    findById,
    initializeSampleData
};
