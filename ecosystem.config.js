module.exports = {
  apps: [
    {
      name: 'myapp',
      script: 'bin/www',
      watch: false,
      env: {
        // "PORT": 3000,
        // "NODE_ENV": "development"
      },
      env_production: {
        // 'PORT': 80
        // "NODE_ENV": "production",
      },

      ignore_watch: ['node_modules', 'public/downloads', '.git/*', 'ip.log', 'archive', 'public/deleted'],
      watch_options: {
        followSymlinks: false
      }

    }
  ]
}
