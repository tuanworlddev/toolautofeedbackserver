module.exports = {
  apps: [{
    name: 'tool-backend',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    
    // Chỉ định file env cho môi trường cụ thể
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
      env_file: ".env"
    }
  }]
};