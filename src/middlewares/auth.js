import jwt from "jsonwebtoken";
import config from "../config/security.js";

export default async function auth(ctx, next) {
    const token = ctx.headers.authorization?.split(" ")[1];
    if (!token) {
        ctx.throw(401, "Unauthorized");
    }

    try {
        const payload = jwt.verify(token, config.jwtSecret);
        ctx.state.user = payload; // 把用户信息放到 ctx.state
        await next();
    } catch (err) {
        ctx.throw(401, "Invalid token");
    }
}
