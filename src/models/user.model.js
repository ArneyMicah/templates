import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

/**
 * 用户模型定义
 */

/**
 * 验证密码
 * @param {string} password - 待验证的密码
 * @param {string} hashedPassword - 加密后的密码
 * @returns {Promise<boolean>} 验证结果
 */
const validatePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

/**
 * 加密密码
 * @param {string} password - 明文密码
 * @returns {Promise<string>} 加密后的密码
 */
const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

/**
 * 定义用户模型
 * @param {Object} sequelize - Sequelize实例
 * @returns {Object} 用户模型
 */
export const defineUserModel = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: '用户ID'
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 50],
                is: /^[a-zA-Z0-9_]+$/
            },
            comment: '用户名'
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            },
            comment: '邮箱'
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: '密码（加密）'
        },
        nickname: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: '昵称'
        },
        avatar: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: '头像URL'
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            validate: {
                is: /^1[3-9]\d{9}$/
            },
            comment: '手机号'
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'banned'),
            defaultValue: 'active',
            comment: '用户状态'
        },
        role: {
            type: DataTypes.ENUM('user', 'admin', 'moderator'),
            defaultValue: 'user',
            comment: '用户角色'
        },
        last_login_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: '最后登录时间'
        },
        last_login_ip: {
            type: DataTypes.STRING(45),
            allowNull: true,
            comment: '最后登录IP'
        },
        email_verified_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: '邮箱验证时间'
        },
        phone_verified_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: '手机验证时间'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: '创建时间'
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: '更新时间'
        }
    }, {
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['username']
            },
            {
                unique: true,
                fields: ['email']
            },
            {
                fields: ['status']
            },
            {
                fields: ['role']
            },
            {
                fields: ['created_at']
            }
        ],
        hooks: {
            // 创建前钩子
            beforeCreate: async (user) => {
                if (user.password && !user.password.startsWith('$2b$')) {
                    user.password = await hashPassword(user.password);
                }
            },
            // 更新前钩子
            beforeUpdate: async (user) => {
                if (user.changed('password') && !user.password.startsWith('$2b$')) {
                    user.password = await hashPassword(user.password);
                }
            }
        }
    });

    // 添加实例方法
    User.prototype.validatePassword = async function(password) {
        return validatePassword(password, this.password);
    };

    User.prototype.setPassword = async function(password) {
        this.password = await hashPassword(password);
    };

    User.prototype.toJSON = function() {
        const values = { ...this.get() };
        delete values.password;
        return values;
    };

    return User;
};
