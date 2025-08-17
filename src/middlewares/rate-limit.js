import ratelimit from "koa-ratelimit";
import Redis from "ioredis";

const db = new Redis();

export default ratelimit({
    driver: "redis",
    db: db,
    duration: 60000,   // 1分钟
    errorMessage: "Too many requests",
    id: (ctx) => ctx.ip,
    max: 100
});
