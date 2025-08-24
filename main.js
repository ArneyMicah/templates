import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 加载环境变量配置文件
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 根据环境变量加载不同的配置文件
const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, 'src', 'config', `config.${env}.js`);

// 转换为 file:// URL 格式以支持 ESM 模块导入
const fileUrl = `file://${configPath.replace(/\\/g, '/')}`;

// 动态导入配置文件并启动服务器
import(fileUrl).then(async (config) => {
	try {
		console.log('🚀 正在启动 Koa Project 服务器...');

		// 导入并启动服务器
		const Server = (await import('./src/app/server.js')).default;
		const server = new Server();
		await server.start();

		// 获取正确的端口号
		const port = config.APP_PORT || 3003;

		// 打印服务器信息
		console.log('🎉 服务器启动成功！');
		console.log(`📡 地址: http://localhost:${port}`);
		console.log(`🔗 Swagger文档: http://localhost:${port}/public/swagger.html`);

	} catch (error) {
		console.error('❌ 启动服务器失败:', error);
		process.exit(1);
	}
}).catch((error) => {
	console.error('❌ 加载配置文件失败:', error);
	process.exit(1);
});