import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 全局配置管理
 */

// 配置对象
let config = {};

/**
 * 初始化配置
 */
const init = () => {
    const env = process.env.NODE_ENV || 'development';

    // 应用基础配置
    config.app = {
        port: parseInt(process.env.PORT) || 3000,
        host: env === 'production' ? '0.0.0.0' : 'localhost',
        name: 'Koa Project',
        version: '1.0.0',
        env: env
    };

    // 数据库配置
    config.database = {
        host: process.env.DB_HOST || '154.36.164.3',
        port: 3306,
        database: process.env.DB_NAME || 'koa-project',
        username: process.env.DB_USERNAME || 'koa-project',
        password: process.env.DB_PASSWORD || '123456',
        dialect: 'mysql',
        logging: env === 'development',
        pool: {
            max: env === 'production' ? 10 : 5,
            min: env === 'production' ? 2 : 0,
            acquire: 30000,
            idle: 10000
        }
    };

    // JWT配置
    config.jwt = {
        secret: process.env.JWT_SECRET || 'dev-secret-key',
        expiresIn: '24h'
    };

    // 日志配置
    config.log = {
        level: process.env.LOG_LEVEL || 'debug',
        filePath: path.join(__dirname, '../../logs')
    };

    // CORS配置
    config.cors = {
        allowedOrigins: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
            : ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization', 'X-Requested-With']
    };

    // 静态文件配置
    config.staticFiles = {
        path: path.join(__dirname, '../../public'),
        url: '/public',
        maxAge: 86400000 // 24小时
    };

    // 安全配置
    config.security = {
        rateLimitWindow: 15 * 60 * 1000, // 15分钟
        rateLimitMax: 100
    };
};

/**
 * 获取配置值
 * @param {string} path - 配置路径
 * @param {*} defaultValue - 默认值
 * @returns {*} 配置值
 */
const get = (path, defaultValue = undefined) => {
    const keys = path.split('.');
    let value = config;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }

    return value;
};
/**
 * 设置配置值
 * @param {string} path - 配置路径
 * @param {*} value - 配置值
 */
const set = (path, value) => {
    const keys = path.split('.');
    let current = config;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
};

/**
 * 获取所有配置
 * @returns {Object} 所有配置
 */
const getAll = () => {
    return { ...config };
};

// 初始化配置
init();

// 保持向后兼容性，导出globalConfig对象
const globalConfig = {
    get,
    set,
    getAll,
    init
};

export default globalConfig;

// 导出常用配置的快捷方式
export const {
    app,
    database,
    jwt,
    log,
    cors,
    staticFiles,
    security
} = config;

