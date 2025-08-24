module.exports = {
  apps: [
    {
      name: 'backend-service',
      script: 'dist/server.js',
      exec_mode: 'cluster',
      instances: 'max',
      port: 8080
    }
  ]
}