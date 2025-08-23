import dotenv from 'dotenv';
dotenv.config();

export const APP_PORT = process.env.APP_PORT || 3003;
export const APP_HOST = process.env.APP_HOST || 'localhost';

// 数据库配置
export const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'koa_project_dev',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: console.log,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

// JWT 配置
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// 日志配置
export const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
export const LOG_FILE_PATH = process.env.LOG_FILE_PATH || './logs';

// CORS 配置
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3000', 'http://localhost:3003'];
