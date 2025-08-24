import { createLogger, format, transports } from "winston";
import { log as logConfig } from '../config/global.js';
import fs from 'fs';
import path from 'path';
const { combine, timestamp, printf, colorize } = format;

// 确保日志目录存在
const ensureLogDirectory = () => {
    try {
        if (!fs.existsSync(logConfig.filePath)) {
            fs.mkdirSync(logConfig.filePath, { recursive: true });
        }
    } catch (error) {
        console.error('创建日志目录失败:', error);
    }
};

// 创建日志目录
ensureLogDirectory();

// 自定义日志格式
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// 创建 logger
const logger = createLogger({
    level: logConfig.level, // 从全局配置获取日志级别
    format: combine(
        colorize(),           // 彩色输出
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new transports.Console(), // 控制台输出
        new transports.File({
            filename: path.join(logConfig.filePath, 'error.log'),
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        new transports.File({
            filename: path.join(logConfig.filePath, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
    ],
    // 添加异常处理
    exceptionHandlers: [
        new transports.File({
            filename: path.join(logConfig.filePath, 'exceptions.log')
        })
    ],
    // 添加退出处理
    exitOnError: false
});

export default logger;
