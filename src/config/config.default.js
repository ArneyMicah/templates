import dotenv from 'dotenv';
dotenv.config();

const {
    APP_PORT,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE
} = process.env;

export {
    APP_PORT,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD as MYSQL_PWD, 
    MYSQL_DATABASE as MYSQL_DB  
};