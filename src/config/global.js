import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 全局配置管理
 */
class GlobalConfig {
    constructor() {
        this.env = process.env.NODE_ENV || 'development';
        this.init();
    }

    init() {
        // 应用基础配置
        this.app = {
            port: parseInt(process.env.PORT) || 3000,
            host: this.env === 'production' ? '0.0.0.0' : 'localhost',
            name: 'Koa Project',
            version: '1.0.0',
            env: this.env
        };

        // 数据库配置
        this.database = {
            host: process.env.DB_HOST || 'localhost',
            port: 3306,
            database: process.env.DB_NAME || 'koa_project_dev',
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || '',
            dialect: 'mysql',
            logging: this.env === 'development',
            pool: {
                max: this.env === 'production' ? 10 : 5,
                min: this.env === 'production' ? 2 : 0,
                acquire: 30000,
                idle: 10000
            }
        };

        // JWT配置
        this.jwt = {
            secret: process.env.JWT_SECRET || 'dev-secret-key',
            expiresIn: '24h'
        };

        // 日志配置
        this.log = {
            level: process.env.LOG_LEVEL || 'debug',
            filePath: path.join(__dirname, '../../logs')
        };

        // CORS配置
        this.cors = {
            allowedOrigins: process.env.ALLOWED_ORIGINS 
                ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
                : ['http://localhost:3000', 'http://localhost:3001'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            headers: ['Content-Type', 'Authorization', 'X-Requested-With']
        };

        // 静态文件配置
        this.staticFiles = {
            path: path.join(__dirname, '../../public'),
            url: '/public',
            maxAge: 86400000 // 24小时
        };

        // 安全配置
        this.security = {
            rateLimitWindow: 15 * 60 * 1000, // 15分钟
            rateLimitMax: 100
        };
    }

    get(path, defaultValue = undefined) {
        const keys = path.split('.');
        let value = this;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return defaultValue;
            }
        }

        return value;
    }
}

// 创建全局配置实例
const globalConfig = new GlobalConfig();

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
} = globalConfig;
