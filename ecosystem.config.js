require('dotenv').config(); // Đọc .env trong config file

module.exports = {
  apps: [{
    name: 'auto feedback',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    
    // Truyền biến môi trường trực tiếp
    env: {
      NODE_ENV: 'development',
      PORT: process.env.PORT || 3400,
      MONGO_URI: process.env.MONGO_URI,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 3400,
      MONGO_URI: process.env.MONGO_URI,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    }
  }]
};