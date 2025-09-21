// PM2 ecosystem configuration for NEX-T 2025 Speakers Website
module.exports = {
  apps: [
    {
      name: 'nex-t-speakers',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=nex-t-speakers --local --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      restart_delay: 2000,
      max_restarts: 10
    }
  ]
}