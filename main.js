// 导入全局配置
import { app as appConfig } from './src/config/global.js';
import logger from './src/utils/logger.js';

// 启动服务器
const startServer = async () => {
	try {
		// 🚀 正在启动 Koa Project 服务器...

		// 导入并启动服务器
		const { start } = await import('./src/app/server.js');
		await start();

		// 打印服务器信息
		logger.info(`🎉 服务器启动成功！`);
		logger.info(`🌍 环境: ${appConfig.env}`);
		logger.info(`📦 应用名称: ${appConfig.name}`);
		logger.info(`🏷️  版本: ${appConfig.version}`);
		logger.info(`💾 Node.js 版本: ${process.version}`);
		logger.info(`🖥️  平台: ${process.platform} ${process.arch}`);
		logger.info(`📊 内存使用: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
		logger.info(`📡 地址: http://${appConfig.host}:${appConfig.port}`);
		logger.info(`📡 Swagger UI: http://${appConfig.host}:${appConfig.port}/public/swagger-ui.html`);
	} catch (error) {
		logger.error('❌ 启动服务器失败:', error);
		process.exit(1);
	}
};

// 启动服务器
startServer();