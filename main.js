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
		console.log(`📁 环境配置: ${env}`);
		console.log(`⚙️  配置文件: ${configPath}`);
		
		// 导入并启动服务器
		const Server = (await import('./src/app/server.js')).default;
		const server = new Server();
		await server.start();
		
		// 打印服务器信息和访问链接
		console.log('\n🎉 服务器启动成功！');
		console.log('='.repeat(50));
		console.log('📡 服务器信息:');
		console.log(`   • 地址: http://localhost:${config.APP_PORT || 3003}`);
		console.log(`   • 环境: ${env}`);
		console.log(`   • 时间: ${new Date().toLocaleString('zh-CN')}`);
		console.log('\n🔗 可用链接:');
		console.log(`   • 健康检查: http://localhost:${config.APP_PORT || 3003}/health`);
		console.log(`   • 系统信息: http://localhost:${config.APP_PORT || 3003}/info`);
		console.log(`   • API信息: http://localhost:${config.APP_PORT || 3003}/api`);
		console.log(`   • 测试页面: http://localhost:${config.APP_PORT || 3003}/public/test.html`);
		console.log(`   • Swagger文档: http://localhost:${config.APP_PORT || 3003}/public/swagger.html`);
		console.log(`   • Swagger路由: http://localhost:${config.APP_PORT || 3003}/docs/swagger`);
		console.log('='.repeat(50));
		console.log('💡 提示: 按 Ctrl+C 停止服务器');
		
	} catch (error) {
		console.error('❌ 启动服务器失败:', error);
		process.exit(1);
	}
}).catch((error) => {
	console.error('❌ 加载配置文件失败:', error);
	process.exit(1);
});