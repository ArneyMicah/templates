import { SwaggerRouter } from "koa-swagger-decorator";

const router = new SwaggerRouter();

// 配置 Swagger
router.swagger({
    title: "Koa API",
    description: "API documentation",
    version: "1.0.0",
    prefix: "/api",
});

// 普通路由
router.get("/users", async (ctx) => {
    ctx.body = [{ id: 1, name: "Alice" }];
});

export default router;
