/**
 * 用户服务类
 * 提供用户相关的业务逻辑
 */

import { BaseService } from './base.service.js';

export class UserService extends BaseService {
    constructor() {
        super();
        // 初始化一些示例用户数据
        this.initializeSampleData();
    }

    /**
     * 初始化示例数据
     */
    initializeSampleData() {
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

        this.data = sampleUsers;
    }

    /**
     * 根据用户名查找用户
     * @param {string} username - 用户名
     * @returns {Object|null} 找到的用户或null
     */
    findByUsername(username) {
        return this.data.find(user => user.username === username) || null;
    }

    /**
     * 根据邮箱查找用户
     * @param {string} email - 邮箱
     * @returns {Object|null} 找到的用户或null
     */
    findByEmail(email) {
        return this.data.find(user => user.email === email) || null;
    }

    /**
     * 创建用户
     * @param {Object} userData - 用户数据
     * @returns {Object} 创建的用户
     */
    createUser(userData) {
        // 检查用户名是否已存在
        if (this.findByUsername(userData.username)) {
            throw new Error('用户名已存在');
        }

        // 检查邮箱是否已存在
        if (this.findByEmail(userData.email)) {
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

        return this.create(newUser);
    }

    /**
     * 更新用户
     * @param {number} id - 用户ID
     * @param {Object} userData - 用户数据
     * @returns {Object|null} 更新后的用户或null
     */
    updateUser(id, userData) {
        const existingUser = this.findById(id);
        if (!existingUser) {
            return null;
        }

        // 检查用户名是否被其他用户使用
        if (userData.username && userData.username !== existingUser.username) {
            const userWithSameUsername = this.findByUsername(userData.username);
            if (userWithSameUsername) {
                throw new Error('用户名已存在');
            }
        }

        // 检查邮箱是否被其他用户使用
        if (userData.email && userData.email !== existingUser.email) {
            const userWithSameEmail = this.findByEmail(userData.email);
            if (userWithSameEmail) {
                throw new Error('邮箱已存在');
            }
        }

        return this.update(id, {
            ...userData,
            updatedAt: new Date().toISOString()
        });
    }

    /**
     * 获取用户列表（支持分页和过滤）
     * @param {Object} options - 查询选项
     * @returns {Object} 用户列表和分页信息
     */
    getUsers(options = {}) {
        const { page = 1, limit = 10, role, status, search } = options;
        let filteredUsers = [...this.data];

        // 按角色过滤
        if (role) {
            filteredUsers = filteredUsers.filter(user => user.role === role);
        }

        // 按状态过滤
        if (status) {
            filteredUsers = filteredUsers.filter(user => user.status === status);
        }

        // 搜索功能
        if (search) {
            const searchLower = search.toLowerCase();
            filteredUsers = filteredUsers.filter(user => 
                user.username.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.firstName.toLowerCase().includes(searchLower) ||
                user.lastName.toLowerCase().includes(searchLower)
            );
        }

        const total = filteredUsers.length;
        const offset = (page - 1) * limit;
        const users = filteredUsers.slice(offset, offset + limit);

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
    }

    /**
     * 删除用户
     * @param {number} id - 用户ID
     * @returns {Object|null} 删除的用户或null
     */
    deleteUser(id) {
        const user = this.findById(id);
        if (!user) {
            return null;
        }

        // 防止删除管理员用户
        if (user.role === 'admin') {
            throw new Error('不能删除管理员用户');
        }

        return this.delete(id);
    }

    /**
     * 批量删除用户
     * @param {Array} ids - 用户ID数组
     * @returns {Array} 删除的用户列表
     */
    deleteUsers(ids) {
        const deletedUsers = [];
        const errors = [];

        ids.forEach(id => {
            try {
                const deletedUser = this.deleteUser(id);
                if (deletedUser) {
                    deletedUsers.push(deletedUser);
                }
            } catch (error) {
                errors.push({ id, error: error.message });
            }
        });

        return { deletedUsers, errors };
    }

    /**
     * 更新用户状态
     * @param {number} id - 用户ID
     * @param {string} status - 新状态
     * @returns {Object|null} 更新后的用户或null
     */
    updateUserStatus(id, status) {
        const validStatuses = ['active', 'inactive', 'suspended'];
        if (!validStatuses.includes(status)) {
            throw new Error('无效的状态值');
        }

        return this.updateUser(id, { status });
    }

    /**
     * 获取用户统计信息
     * @returns {Object} 用户统计信息
     */
    getUserStats() {
        const total = this.data.length;
        const active = this.data.filter(user => user.status === 'active').length;
        const inactive = this.data.filter(user => user.status === 'inactive').length;
        const suspended = this.data.filter(user => user.status === 'suspended').length;
        const admins = this.data.filter(user => user.role === 'admin').length;
        const users = this.data.filter(user => user.role === 'user').length;

        return {
            total,
            active,
            inactive,
            suspended,
            admins,
            users
        };
    }
}
