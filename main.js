// 导入全局配置
import { app as appConfig } from './src/config/global.js';
import logger from './src/utils/logger.js';

// 启动服务器
async function startServer() {
	try {
		logger.info('🚀 正在启动 Koa Project 服务器...');

		// 导入并启动服务器
		const Server = (await import('./src/app/server.js')).default;
		const server = new Server();
		await server.start();

		// 打印服务器信息
		logger.info('🎉 服务器启动成功！');
		logger.info(`📡 地址: http://${appConfig.host}:${appConfig.port}`);
		logger.info(`📡 Swagger UI: http://${appConfig.host}:${appConfig.port}/public/swagger-ui.html`);
	} catch (error) {
		logger.error('❌ 启动服务器失败:', error);
		process.exit(1);
	}
}

// 启动服务器
startServer();