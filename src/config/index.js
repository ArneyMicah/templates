import defaultConfig from "./config.default.js";

let envConfig = {};
const env = process.env.NODE_ENV || "development";

try {
    envConfig = await import(`./config.${env}.js`).then(m => m.default);
} catch {
    console.warn(`⚠️ No specific config for NODE_ENV=${env}, using default.`);
}

export default { ...defaultConfig, ...envConfig };
