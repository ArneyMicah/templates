/**
 * 用户CRUD接口测试脚本
 * 测试用户相关的所有API接口
 */

const BASE_URL = 'http://localhost:3003';

/**
 * 测试获取用户列表
 */
async function testGetUsers() {
    console.log('👥 测试获取用户列表...');

    try {
        const response = await fetch(`${BASE_URL}/users`);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ 获取用户列表成功');
            console.log(`   用户数量: ${data.data.users.length}`);
            console.log(`   分页信息: 第${data.data.pagination.page}页，共${data.data.pagination.totalPages}页`);
        } else {
            console.log('❌ 获取用户列表失败:', data);
        }
    } catch (error) {
        console.log('❌ 获取用户列表请求失败:', error.message);
    }
}

/**
 * 测试创建用户
 */
async function testCreateUser() {
    console.log('➕ 测试创建用户...');

    try {
        const userData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            role: 'user'
        };

        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ 创建用户成功');
            console.log(`   用户ID: ${data.data.id}`);
            console.log(`   用户名: ${data.data.username}`);
            return data.data.id;
        } else {
            console.log('❌ 创建用户失败:', data);
            return null;
        }
    } catch (error) {
        console.log('❌ 创建用户请求失败:', error.message);
        return null;
    }
}

/**
 * 测试获取单个用户
 */
async function testGetUser(userId) {
    console.log(`👤 测试获取用户 ${userId}...`);

    try {
        const response = await fetch(`${BASE_URL}/users/${userId}`);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ 获取用户成功');
            console.log(`   用户名: ${data.data.username}`);
            console.log(`   邮箱: ${data.data.email}`);
            console.log(`   角色: ${data.data.role}`);
        } else {
            console.log('❌ 获取用户失败:', data);
        }
    } catch (error) {
        console.log('❌ 获取用户请求失败:', error.message);
    }
}

/**
 * 测试更新用户
 */
async function testUpdateUser(userId) {
    console.log(`✏️  测试更新用户 ${userId}...`);

    try {
        const updateData = {
            username: 'updateduser',
            email: 'updated@example.com',
            role: 'admin'
        };

        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ 更新用户成功');
            console.log(`   新用户名: ${data.data.username}`);
            console.log(`   新邮箱: ${data.data.email}`);
            console.log(`   新角色: ${data.data.role}`);
        } else {
            console.log('❌ 更新用户失败:', data);
        }
    } catch (error) {
        console.log('❌ 更新用户请求失败:', error.message);
    }
}

/**
 * 测试更新用户状态
 */
async function testUpdateUserStatus(userId) {
    console.log(`🔄 测试更新用户状态 ${userId}...`);

    try {
        const statusData = {
            status: 'inactive'
        };

        const response = await fetch(`${BASE_URL}/users/${userId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(statusData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ 更新用户状态成功');
            console.log(`   新状态: ${data.data.status}`);
        } else {
            console.log('❌ 更新用户状态失败:', data);
        }
    } catch (error) {
        console.log('❌ 更新用户状态请求失败:', error.message);
    }
}

/**
 * 测试删除用户
 */
async function testDeleteUser(userId) {
    console.log(`🗑️  测试删除用户 ${userId}...`);

    try {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ 删除用户成功');
            console.log(`   删除的用户ID: ${data.data.id}`);
        } else {
            console.log('❌ 删除用户失败:', data);
        }
    } catch (error) {
        console.log('❌ 删除用户请求失败:', error.message);
    }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
    console.log('🚀 开始用户CRUD接口测试...\n');

    // 测试获取用户列表
    await testGetUsers();
    console.log('');

    // 测试创建用户
    const userId = await testCreateUser();
    console.log('');

    if (userId) {
        // 测试获取单个用户
        await testGetUser(userId);
        console.log('');

        // 测试更新用户
        await testUpdateUser(userId);
        console.log('');

        // 测试更新用户状态
        await testUpdateUserStatus(userId);
        console.log('');

        // 测试删除用户
        await testDeleteUser(userId);
        console.log('');
    }

    console.log('🎉 用户CRUD接口测试完成！');
}

// 如果直接运行此文件，则执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests();
}

export {
    testGetUsers,
    testCreateUser,
    testGetUser,
    testUpdateUser,
    testUpdateUserStatus,
    testDeleteUser,
    runAllTests
};
