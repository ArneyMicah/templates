import dotenv from 'dotenv';
dotenv.config();

const {
    APP_PORT: ENV_APP_PORT,
    MYSQL_HOST: ENV_MYSQL_HOST,
    MYSQL_PORT: ENV_MYSQL_PORT,
    MYSQL_USER: ENV_MYSQL_USER,
    MYSQL_PASSWORD: ENV_MYSQL_PASSWORD,
    MYSQL_DATABASE: ENV_MYSQL_DATABASE
} = process.env;

export const APP_PORT = ENV_APP_PORT || 3003;
export const MYSQL_HOST = ENV_MYSQL_HOST || 'localhost';
export const MYSQL_PORT = ENV_MYSQL_PORT || 3306;
export const MYSQL_USER = ENV_MYSQL_USER || 'root';
export const MYSQL_PASSWORD = ENV_MYSQL_PASSWORD || '';
export const MYSQL_DATABASE = ENV_MYSQL_DATABASE || 'koa_project_dev';