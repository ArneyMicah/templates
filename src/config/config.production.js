import dotenv from 'dotenv';
dotenv.config();

export const APP_PORT = process.env.APP_PORT || 3000;
export const APP_HOST = process.env.APP_HOST || '0.0.0.0';

// 数据库配置
export const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'koa_project_prod',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000
    }
};

// JWT 配置
export const JWT_SECRET = process.env.JWT_SECRET || 'production-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// 日志配置
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const LOG_FILE_PATH = process.env.LOG_FILE_PATH || './logs';

// CORS 配置
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'];
