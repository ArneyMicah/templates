import defaultConfig from "./config.default.js";

let envConfig = {};
const env = process.env.NODE_ENV || "development";

try {
    envConfig = await import(`./config.${env}.js`).then(m => m.default);
} catch {
    // 使用默认配置，无需警告
}

export default { ...defaultConfig, ...envConfig };
