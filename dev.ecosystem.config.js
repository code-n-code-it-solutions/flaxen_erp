module.exports = {
    apps: [
        {
            name: 'code-n-code-dev',
            script: 'npm',
            args: 'run server-dev',
            watch: true,
            env: {
                NODE_ENV: 'development',
            },
            env_development: { // Added this section
                NODE_ENV: 'development',
            },
        },
    ],

    deploy: {
        development: {
            user: 'root', // e.g., 'root'
            host: 'dev.codencode.ae', // e.g., '123.45.67.89'
            ref: 'origin/suhaib-updates', // Branch to pull
            repo: 'git@github.com:code-n-code-it-solutions/flaxen_erp.git', // Git repo
            path: '/home/codencode-dev-erp/htdocs/dev.codencode.ae',
            'ssh_options': 'StrictHostKeyChecking=no',
            'post-deploy': 'npm install && npm run build && pm2 reload dev.ecosystem.config.js --env development',
            env: {
                NODE_ENV: 'development',
            },
        },
    },
};
