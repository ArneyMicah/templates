import koa from "koa";
import cors from "@koa/cors"
import logger from "../utils/logger.js";
import router from "../routes/index.js";
const app = new koa();
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());
// 控制台输出 info 级别
logger.info("Server started");

// 控制台输出 error 级别，同时写入 logs/error.log
logger.error("Database connection failed");

// 警告级别
logger.warn("Deprecated API used");
export default app;