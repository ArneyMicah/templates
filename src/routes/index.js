import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Router from 'koa-router';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = new Router();
const loadRoutes = async () => {
    try {
        const files = await fs.readdir(__dirname);
        const routePromises = files
            .filter(file => file.endsWith('.js') && file !== 'index.js') // 筛选出符合条件的文件
            .map(async file => {
                const filePath = path.join(__dirname, file);
                const r = await import(`file://${filePath}`);
                if (r.default && typeof r.default.routes === 'function') {
                    router.use(r.default.routes(), r.default.allowedMethods());
                } else {
                    console.warn(`文件 ${file} 可能不是有效的路由模块。`);
                }
            });

        await Promise.all(routePromises); // 并行加载所有路由文件
    } catch (err) {
        console.error('加载路由时发生错误：', err);
    }
}
await loadRoutes();
export default router;
