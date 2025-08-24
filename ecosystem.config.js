module.exports = {
  apps: [
    {
      name: 'abyarsanat-backend-service',
      script: 'dist/server.js',
      exec_mode: 'cluster',
      instances: 'max',
      port: 7070
    }
  ]
}