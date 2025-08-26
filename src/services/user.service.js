/**
 * 用户服务函数
 * 提供用户相关的业务逻辑
 */

import { getModels } from '../models/index.js';
import logger from '../utils/logger.js';
import { Op } from 'sequelize';

/**
 * 根据ID查找用户
 * @param {number} id - 用户ID
 * @returns {Promise<Object|null>} 找到的用户或null
 */
export const findById = async (id) => {
    try {
        const { User } = getModels();
        const user = await User.findByPk(id);
        return user;
    } catch (error) {
        logger.error('查找用户失败:', error);
        throw error;
    }
};

/**
 * 根据用户名查找用户
 * @param {string} username - 用户名
 * @returns {Promise<Object|null>} 找到的用户或null
 */
export const findByUsername = async (username) => {
    try {
        const { User } = getModels();
        const user = await User.findOne({
            where: { username }
        });
        return user;
    } catch (error) {
        logger.error('根据用户名查找用户失败:', error);
        throw error;
    }
};

/**
 * 根据邮箱查找用户
 * @param {string} email - 邮箱
 * @returns {Promise<Object|null>} 找到的用户或null
 */
export const findByEmail = async (email) => {
    try {
        const { User } = getModels();
        const user = await User.findOne({
            where: { email }
        });
        return user;
    } catch (error) {
        logger.error('根据邮箱查找用户失败:', error);
        throw error;
    }
};

/**
 * 创建用户
 * @param {Object} userData - 用户数据
 * @returns {Promise<Object>} 创建的用户
 */
export const createUser = async (userData) => {
    try {
        // 检查用户名是否已存在
        const existingUsername = await findByUsername(userData.username);
        if (existingUsername) {
            throw new Error('用户名已存在');
        }

        // 检查邮箱是否已存在
        const existingEmail = await findByEmail(userData.email);
        if (existingEmail) {
            throw new Error('邮箱已存在');
        }

        // 创建用户
        const { User } = getModels();
        const user = await User.create(userData);
        logger.info(`用户创建成功: ${user.username}`);
        return user;
    } catch (error) {
        logger.error('创建用户失败:', error);
        throw error;
    }
};

/**
 * 更新用户
 * @param {number} id - 用户ID
 * @param {Object} userData - 用户数据
 * @returns {Promise<Object|null>} 更新后的用户或null
 */
export const updateUser = async (id, userData) => {
    try {
        const user = await findById(id);
        if (!user) {
            return null;
        }

        // 检查用户名是否被其他用户使用
        if (userData.username && userData.username !== user.username) {
            const userWithSameUsername = await findByUsername(userData.username);
            if (userWithSameUsername) {
                throw new Error('用户名已存在');
            }
        }

        // 检查邮箱是否被其他用户使用
        if (userData.email && userData.email !== user.email) {
            const userWithSameEmail = await findByEmail(userData.email);
            if (userWithSameEmail) {
                throw new Error('邮箱已存在');
            }
        }

        // 更新用户
        await user.update(userData);
        logger.info(`用户更新成功: ${user.username}`);
        return user;
    } catch (error) {
        logger.error('更新用户失败:', error);
        throw error;
    }
};

/**
 * 获取用户列表（支持分页和筛选）
 * @param {Object} options - 查询选项
 * @returns {Promise<Object>} 用户列表和分页信息
 */
export const getUsers = async (options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            role,
            search,
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = options;

        // 构建查询条件
        const where = {};
        if (status) where.status = status;
        if (role) where.role = role;
        if (search) {
            where[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { nickname: { [Op.like]: `%${search}%` } }
            ];
        }

        // 执行查询
        const { User } = getModels();
        const { count, rows: users } = await User.findAndCountAll({
            where,
            order: [[sortBy, sortOrder]],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            attributes: { exclude: ['password'] }
        });

        return {
            users,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit),
                hasNext: page < Math.ceil(count / limit),
                hasPrev: page > 1
            }
        };
    } catch (error) {
        logger.error('获取用户列表失败:', error);
        throw error;
    }
};

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Promise<Object|null>} 删除的用户或null
 */
export const deleteUser = async (id) => {
    try {
        const user = await findById(id);
        if (!user) {
            return null;
        }

        // 防止删除管理员用户
        if (user.role === 'admin') {
            throw new Error('不能删除管理员用户');
        }

        await user.destroy();
        logger.info(`用户删除成功: ${user.username}`);
        return user;
    } catch (error) {
        logger.error('删除用户失败:', error);
        throw error;
    }
};

/**
 * 验证用户登录
 * @param {string} username - 用户名或邮箱
 * @param {string} password - 密码
 * @returns {Promise<Object|null>} 验证成功的用户或null
 */
export const validateLogin = async (username, password) => {
    try {
        // 查找用户（支持用户名或邮箱登录）
        const { User } = getModels();
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { email: username }
                ]
            }
        });

        if (!user) {
            return null;
        }

        // 验证密码
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return null;
        }

        // 检查用户状态
        if (user.status !== 'active') {
            throw new Error('用户账户已被禁用');
        }

        // 更新最后登录信息
        await user.update({
            last_login_at: new Date()
        });

        return user;
    } catch (error) {
        logger.error('用户登录验证失败:', error);
        throw error;
    }
};

/**
 * 初始化示例数据
 * @returns {Promise<void>}
 */
export const initializeSampleData = async () => {
    try {
        // 检查是否已有数据
        const { User } = getModels();
        const count = await User.count();
        if (count > 0) {
            logger.info('用户表已有数据，跳过初始化');
            return;
        }

        const sampleUsers = [
            {
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin123',
                nickname: '系统管理员',
                role: 'admin',
                status: 'active',
                phone: '13800138000',
                avatar: 'https://example.com/avatar1.jpg'
            },
            {
                username: 'user1',
                email: 'user1@example.com',
                password: 'user123',
                nickname: '张三',
                role: 'user',
                status: 'active',
                phone: '13800138001',
                avatar: 'https://example.com/avatar2.jpg'
            },
            {
                username: 'user2',
                email: 'user2@example.com',
                password: 'user123',
                nickname: '李四',
                role: 'user',
                status: 'active',
                phone: '13800138002',
                avatar: 'https://example.com/avatar3.jpg'
            }
        ];

        for (const userData of sampleUsers) {
            await createUser(userData);
        }

        logger.info('示例用户数据初始化完成');
    } catch (error) {
        logger.error('初始化示例数据失败:', error);
        throw error;
    }
};
