import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize } = format;

// 自定义日志格式
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// 创建 logger
const logger = createLogger({
    level: "info", // 默认日志级别
    format: combine(
        colorize(),           // 彩色输出
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new transports.Console(), // 控制台输出
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),
    ],
});

export default logger;
