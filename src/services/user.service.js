/**
 * 用户服务
 * 提供用户相关的业务逻辑处理
 */

// 模拟用户数据存储
let users = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: 'hashed_password_123',
        role: 'admin',
        status: 'active',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
    },
    {
        id: 2,
        username: 'user1',
        email: 'user1@example.com',
        password: 'hashed_password_456',
        role: 'user',
        status: 'active',
        createdAt: new Date('2024-01-02T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z')
    }
];

let nextId = 3;

/**
 * 获取所有用户
 * @param {Object} options - 查询选项
 * @param {number} options.page - 页码
 * @param {number} options.limit - 每页数量
 * @param {string} options.search - 搜索关键词
 * @returns {Object} 用户列表和分页信息
 */
export const getAllUsers = (options = {}) => {
    const { page = 1, limit = 10, search = '' } = options;

    let filteredUsers = [...users];

    // 搜索过滤
    if (search) {
        filteredUsers = filteredUsers.filter(user =>
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
        users: paginatedUsers.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }),
        pagination: {
            page,
            limit,
            total: filteredUsers.length,
            totalPages: Math.ceil(filteredUsers.length / limit)
        }
    };
};

/**
 * 根据ID查找用户
 * @param {number} id - 用户ID
 * @returns {Object|null} 用户对象或null
 */
export const findUserById = (id) => {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

/**
 * 根据邮箱查找用户
 * @param {string} email - 邮箱地址
 * @returns {Object|null} 用户对象或null
 */
export const findUserByEmail = (email) => {
    return users.find(u => u.email === email);
};

/**
 * 根据用户名查找用户
 * @param {string} username - 用户名
 * @returns {Object|null} 用户对象或null
 */
export const findUserByUsername = (username) => {
    return users.find(u => u.username === username);
};

/**
 * 创建新用户
 * @param {Object} userData - 用户数据
 * @param {string} userData.username - 用户名
 * @param {string} userData.email - 邮箱
 * @param {string} userData.password - 密码
 * @param {string} userData.role - 角色
 * @returns {Object} 创建的用户对象
 */
export const createUser = (userData) => {
    const { username, email, password, role = 'user' } = userData;

    // 检查用户名是否已存在
    if (findUserByUsername(username)) {
        throw new Error('用户名已存在');
    }

    // 检查邮箱是否已存在
    if (findUserByEmail(email)) {
        throw new Error('邮箱已存在');
    }

    const now = new Date();
    const newUser = {
        id: nextId++,
        username,
        email,
        password: `hashed_${password}`, // 实际应用中应该使用bcrypt等加密
        role,
        status: 'active',
        createdAt: now,
        updatedAt: now
    };

    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

/**
 * 更新用户信息
 * @param {number} id - 用户ID
 * @param {Object} updateData - 更新数据
 * @returns {Object|null} 更新后的用户对象或null
 */
export const updateUser = (id, updateData) => {
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) return null;

    const user = users[userIndex];

    // 检查用户名唯一性
    if (updateData.username && updateData.username !== user.username) {
        if (findUserByUsername(updateData.username)) {
            throw new Error('用户名已存在');
        }
    }

    // 检查邮箱唯一性
    if (updateData.email && updateData.email !== user.email) {
        if (findUserByEmail(updateData.email)) {
            throw new Error('邮箱已存在');
        }
    }

    // 更新用户信息
    const updatedUser = {
        ...user,
        ...updateData,
        updatedAt: new Date()
    };

    users[userIndex] = updatedUser;

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
};

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Object|null} 删除的用户对象或null
 */
export const deleteUser = (id) => {
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) return null;

    const deletedUser = users.splice(userIndex, 1)[0];
    const { password, ...userWithoutPassword } = deletedUser;
    return userWithoutPassword;
};

/**
 * 更新用户状态
 * @param {number} id - 用户ID
 * @param {string} status - 新状态
 * @returns {Object|null} 更新后的用户对象或null
 */
export const updateUserStatus = (id, status) => {
    return updateUser(id, { status });
};

/**
 * 验证用户密码
 * @param {string} email - 邮箱
 * @param {string} password - 密码
 * @returns {Object|null} 用户对象或null
 */
export const validateUserPassword = (email, password) => {
    const user = findUserByEmail(email);
    if (!user) return null;

    // 实际应用中应该使用bcrypt.compare()
    if (user.password === `hashed_${password}`) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    return null;
};

export default {
    getAllUsers,
    findUserById,
    findUserByEmail,
    findUserByUsername,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    validateUserPassword
};
